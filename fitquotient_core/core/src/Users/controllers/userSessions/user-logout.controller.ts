import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseInterceptors,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { JwtPayload } from '@common/utilities/jwt.utility';
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

  @Delete('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<BaseResponseDto<void>> {
    const payload = (req as FastifyRequest & { user?: JwtPayload }).user;
    const userId = String(payload?.sub);
    await this.userLogoutUsecase.userLogoutUsecase(userId);

    cookieUtility.clearRefreshTokenCookie(reply, req);
    const response: BaseResponseDto<void> = {
      is_success: true,
      message: 'User logged out successfully',
    };

    reply.send(response);
    return response;
  }
}
