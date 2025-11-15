import {
  Controller,
  Post,
  Req,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseInterceptors,
  UseGuards,
  Param,
} from '@nestjs/common';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { JwtGuard } from '@common/guards';
import { GlobalExceptionFilter } from '@common/filters';
import { UserCvCreateUsecase } from '../../usecases/userCVs/user-cv-create.usecase';
import { BaseResponseDto } from '@common/dtos';
import { UserGetByIdParamsDto } from '@users/dtos';
import type { FastifyRequest } from 'fastify';

type MultipartFile = {
  file: NodeJS.ReadableStream;
  filename: string;
  mimetype: string;
};

interface MultipartFastifyRequest extends FastifyRequest {
  file(): Promise<MultipartFile>;
}

@Controller('users')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class UserCvCreateController {
  constructor(private readonly userCvCreateUsecase: UserCvCreateUsecase) {}

  @Post(':userId/cvs')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param() params: UserGetByIdParamsDto,
    @Req() req: MultipartFastifyRequest,
  ): Promise<BaseResponseDto<{ cv_id: string; url: string }>> {
    const uploaded = await req.file();
    const streamToBuffer = (stream: NodeJS.ReadableStream) =>
      new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk: Buffer) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', (err) => reject(new Error(String(err))));
      });

    const buffer = await streamToBuffer(uploaded.file);

    const result = await this.userCvCreateUsecase.execute(params.userId, {
      buffer,
      filename: uploaded.filename,
      mimetype: uploaded.mimetype,
    });

    return {
      success: true,
      message: 'CV uploaded successfully',
      data: { cv_id: result.id, url: result.url },
    };
  }
}
