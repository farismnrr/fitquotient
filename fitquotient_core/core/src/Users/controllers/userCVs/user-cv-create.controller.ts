import {
  Controller,
  Post,
  Req,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@common/guards';
import { GlobalExceptionFilter } from '@common/filters';
import { UserCvCreateUsecase } from '../../usecases/userCVs/user-cv-create.usecase';
import { BaseResponseDto } from '@common/dtos';
import type { FastifyRequest } from 'fastify';
import { JwtPayload } from '@common/utilities/jwt.utility';
import type { FastifyMultipartFile } from '@users/types/fastify-multipart.types';

@Controller('users')
@UseFilters(GlobalExceptionFilter)
export class UserCvCreateController {
  constructor(private readonly userCvCreateUsecase: UserCvCreateUsecase) {}

  @Post('cvs')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: FastifyRequest,
  ): Promise<BaseResponseDto<{ cv_id: string; url: string }>> {
    const payload = (req as FastifyRequest & { user?: JwtPayload }).user;
    const userId = String(payload?.sub);
    const result = await this.userCvCreateUsecase.userCvCreateUsecase(
      userId,
      req as FastifyRequest,
    );

    return {
      is_success: true,
      message: 'CV uploaded successfully',
      data: { cv_id: result.id, url: result.url },
    };
  }
}
