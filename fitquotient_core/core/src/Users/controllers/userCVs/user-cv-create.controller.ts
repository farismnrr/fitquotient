import {
  Controller,
  Post,
  Req,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseGuards,
  Param,
} from '@nestjs/common';
import { JwtGuard } from '@common/guards';
import { GlobalExceptionFilter } from '@common/filters';
import { UserCvCreateUsecase } from '../../usecases/userCVs/user-cv-create.usecase';
import { BaseResponseDto } from '@common/dtos';
import { UserGetByIdParamsDto } from '@users/dtos';
import { streamToBuffer } from '@common/utilities';
import type { FastifyRequest } from 'fastify';

type MultipartFile = {
  file: NodeJS.ReadableStream;
  filename: string;
  mimetype: string;
};

interface MultipartFastifyRequest extends FastifyRequest {
  file(): Promise<MultipartFile>;
  isMultipart(): boolean;
}

@Controller('users')
@UseFilters(GlobalExceptionFilter)
export class UserCvCreateController {
  constructor(private readonly userCvCreateUsecase: UserCvCreateUsecase) {}

  @Post(':userId/cvs')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param() params: UserGetByIdParamsDto,
    @Req() req: MultipartFastifyRequest,
  ): Promise<BaseResponseDto<{ cv_id: string; url: string }>> {
    try {
      // Check if request is multipart
      if (!req.isMultipart()) {
        throw new Error('Request is not multipart');
      }

      const uploaded = await req.file();
      if (!uploaded) {
        throw new Error(
          'No file uploaded. Make sure to send form-data with key "file"',
        );
      }
      const buffer = await streamToBuffer(uploaded.file);
      const result = await this.userCvCreateUsecase.userCvCreateUsecase(
        params.userId,
        {
          buffer,
          filename: uploaded.filename,
          mimetype: uploaded.mimetype,
        },
      );

      return {
        isSuccess: true,
        message: 'CV uploaded successfully',
        data: { cv_id: result.id, url: result.url },
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`File upload error: ${message}`);
    }
  }
}
