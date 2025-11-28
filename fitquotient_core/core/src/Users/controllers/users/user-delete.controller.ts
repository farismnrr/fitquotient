import {
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Delete,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '@common/guards';
import { UserSoftDeleteUsecase } from '@users/usecases';
import { BaseResponseDto } from '@common/dtos';
import type { FastifyRequest } from 'fastify';
import { JwtPayload } from '@common/utilities/jwt.utility';
import { GlobalExceptionFilter } from '@common/filters/global-exception.filter';
import { CaseTransformerInterceptor } from '@common/interceptors';

@Controller('users')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class UserSoftDeleteController {
  constructor(private readonly userSoftDeleteUsecase: UserSoftDeleteUsecase) {}

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Req() req: FastifyRequest): Promise<BaseResponseDto<void>> {
    const payload = (req as FastifyRequest & { user?: JwtPayload }).user;
    const userId = String(payload?.sub);
    await this.userSoftDeleteUsecase.userSoftDeleteUsecase(userId);
    return {
      is_success: true,
      message: `User deleted successfully`,
    };
  }
}
