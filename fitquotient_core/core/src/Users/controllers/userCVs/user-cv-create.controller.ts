import {
  Controller,
  Post,
  Req,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseGuards,
  Param,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtGuard } from '@common/guards';
import { GlobalExceptionFilter } from '@common/filters';
import { UserCvCreateUsecase } from '../../usecases/userCVs/user-cv-create.usecase';
import { BaseResponseDto } from '@common/dtos';
import { UserGetByIdParamsDto } from '@users/dtos';
import { streamToBuffer } from '@common/utilities';
import type { FastifyRequest } from 'fastify';

interface FastifyMultipartFile {
  file: NodeJS.ReadableStream;
  filename: string;
  mimetype: string;
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
    @Req() req: FastifyRequest,
  ): Promise<BaseResponseDto<{ cv_id: string; url: string }>> {
    try {
      // Cast to access @fastify/multipart methods with proper typing
      const fastifyReq = req as FastifyRequest & {
        file: () => Promise<FastifyMultipartFile | undefined>;
      };

      // Try to get file from multipart plugin
      let data: FastifyMultipartFile | undefined;
      try {
        data = await fastifyReq.file();
      } catch {
        throw new InternalServerErrorException(
          'Failed to read file from request. Make sure to send multipart/form-data with a file field',
        );
      }

      if (!data) {
        throw new InternalServerErrorException(
          'No file uploaded. Please send a file in the request body',
        );
      }

      const buffer = await streamToBuffer(data.file);
      const result = await this.userCvCreateUsecase.userCvCreateUsecase(
        params.userId,
        {
          buffer,
          filename: data.filename,
          mimetype: data.mimetype,
        },
      );

      return {
        isSuccess: true,
        message: 'CV uploaded successfully',
        data: { cv_id: result.id, url: result.url },
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new InternalServerErrorException(`File upload error: ${message}`);
    }
  }
}
