import {
  Controller,
  Delete,
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
import { UserCvSoftDeleteUsecase } from '../../usecases/userCVs/user-cv-soft-delete.usecase';
import { UserCvGetByIdUsecase } from '../../usecases/userCVs/user-cv-get-by-id.usecase';
import { BaseResponseDto } from '@common/dtos';
import type { FastifyRequest } from 'fastify';
import { JwtPayload } from '@common/utilities/jwt.utility';

@Controller('users')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class UserCvSoftDeleteController {
  constructor(
    private readonly userCvSoftDeleteUsecase: UserCvSoftDeleteUsecase,
    private readonly userCvGetByIdUsecase: UserCvGetByIdUsecase,
  ) {}

  @Delete('cvs/:cvId')
  @HttpCode(HttpStatus.OK)
  async softDelete(
    @Param('cvId') cvId: string,
    @Req() req: FastifyRequest,
  ): Promise<BaseResponseDto<null>> {
    const cv = await this.userCvGetByIdUsecase.userCvGetByIdUsecase(cvId);
    const payload = (req as FastifyRequest & { user?: JwtPayload }).user;
    const tokenUserId = String(payload?.sub);
    if (tokenUserId !== String(cv.userId)) {
      throw new ForbiddenException('Forbidden');
    }
    await this.userCvSoftDeleteUsecase.userCvSoftDeleteUsecase(cvId);

    return {
      is_success: true,
      message: 'CV deleted successfully',
    };
  }
}
