import {
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  UseInterceptors,
  UseGuards,
  Body,
  Req,
  UseFilters,
} from '@nestjs/common';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { JwtGuard } from '@common/guards';
import { UserPasswordUpdateUsecase } from '@users/usecases';
import { BaseResponseDto } from '@common/dtos';
import type { FastifyRequest } from 'fastify';
import { JwtPayload } from '@common/utilities/jwt.utility';
import { UserPasswordUpdateDto } from '@users/dtos/users/user-update.dto';
import { GlobalExceptionFilter } from '@common/filters';

@Controller('users')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class UserUpdateController {
  constructor(
    private readonly userPasswordUpdateUsecase: UserPasswordUpdateUsecase,
  ) {}

  @Patch()
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Req() req: FastifyRequest,
    @Body() dto: UserPasswordUpdateDto,
  ): Promise<BaseResponseDto<void>> {
    const payload = (req as FastifyRequest & { user?: JwtPayload }).user;
    const userId = String(payload?.sub);
    await this.userPasswordUpdateUsecase.userPasswordUpdateUsecase(userId, dto);
    return {
      is_success: true,
      message: `User updated successfully`,
    };
  }
}
