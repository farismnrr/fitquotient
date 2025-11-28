import {
  Controller,
  Get,
  Req,
  UseFilters,
  UseInterceptors,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { JwtGuard } from '@common/guards';
import { GlobalExceptionFilter } from '@common/filters';
import { UserCvGetAllUsecase } from '../../usecases/userCVs/user-cv-get-all.usecase';
import { BaseResponseDto } from '@common/dtos';
import { UserCvResponseDto } from '@users/dtos';
import type { FastifyRequest } from 'fastify';
import { JwtPayload } from '@common/utilities/jwt.utility';

@Controller('users')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class UserCvGetAllController {
  constructor(private readonly userCvGetAllUsecase: UserCvGetAllUsecase) {}

  @Get('cvs')
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Req() req: FastifyRequest,
  ): Promise<BaseResponseDto<{ cvs: UserCvResponseDto[] }>> {
    const payload = (req as FastifyRequest & { user?: JwtPayload }).user;
    const userId = String(payload?.sub);
    const cvs = await this.userCvGetAllUsecase.userCvGetAllUsecase(userId);

    return {
      is_success: true,
      message: 'User CVs retrieved successfully',
      data: { cvs },
    };
  }
}
