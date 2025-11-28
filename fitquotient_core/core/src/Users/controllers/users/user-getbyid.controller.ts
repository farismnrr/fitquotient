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
import { UserGetByIdUsecase } from '@users/usecases';
import { BaseResponseDto } from '@common/dtos';
import { UserGetDto } from '@users/dtos';
import type { FastifyRequest } from 'fastify';
import { JwtPayload } from '@common/utilities/jwt.utility';
import { GlobalExceptionFilter } from '@common/filters';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { JwtGuard } from '@common/guards';

@Controller('users')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class UserGetByIdController {
  constructor(private readonly userGetByIdUsecase: UserGetByIdUsecase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getById(
    @Req() req: FastifyRequest,
  ): Promise<BaseResponseDto<{ user: UserGetDto }>> {
    const payload = (req as FastifyRequest & { user?: JwtPayload }).user;
    const userId = String(payload?.sub);
    const user = await this.userGetByIdUsecase.userGetByIdUsecase(userId);

    return {
      is_success: true,
      message: 'User retrieved successfully',
      data: {
        user,
      },
    };
  }
}
