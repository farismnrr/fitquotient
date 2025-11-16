import {
  Controller,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseInterceptors,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { UserLogoutUsecase } from '@users/usecases';
import { BaseResponseDto } from '@common/dtos';
import { GlobalExceptionFilter } from '@common/filters';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { JwtGuard } from '@common/guards';
import { cookieUtility } from '@common/utilities';

@Controller('users')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class UserLogoutController {
  constructor(private readonly userLogoutUsecase: UserLogoutUsecase) {}

  @Delete('/logout/:userId')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Param('userId') userId: string,
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<BaseResponseDto<void>> {
    await this.userLogoutUsecase.userLogoutUsecase(userId);

    cookieUtility.clearRefreshTokenCookie(reply, req);
    const response: BaseResponseDto<void> = {
      isSuccess: true,
      message: 'User logged out successfully',
    };

    reply.send(response);
    return response;
  }
}
