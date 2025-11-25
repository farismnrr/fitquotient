import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseInterceptors,
  UseGuards,
  Param,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { JwtGuard } from '@common/guards';
import { GlobalExceptionFilter } from '@common/filters';
import { UserCvGetByIdUsecase } from '../../usecases/userCVs/user-cv-get-by-id.usecase';
import { BaseResponseDto } from '@common/dtos';
import type { FastifyRequest } from 'fastify';
import { JwtPayload } from '@common/utilities/jwt.utility';
import { UserCvResponseDto } from '@users/dtos';

@Controller('users')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class UserCvGetByIdController {
  constructor(private readonly userCvGetByIdUsecase: UserCvGetByIdUsecase) {}

  @Get('cvs/:cvId')
  @HttpCode(HttpStatus.OK)
  async getById(
    @Param('cvId') cvId: string,
    @Req() req: FastifyRequest,
  ): Promise<BaseResponseDto<{ cv: UserCvResponseDto }>> {
    const cv = await this.userCvGetByIdUsecase.userCvGetByIdUsecase(cvId);
    const payload = (req as FastifyRequest & { user?: JwtPayload }).user;
    const tokenUserId = String(payload?.sub);
    if (tokenUserId !== String(cv.userId)) {
      throw new ForbiddenException('Forbidden');
    }

    return {
      is_success: true,
      message: 'CV retrieved successfully',
      data: {
        cv,
      },
    };
  }
}
