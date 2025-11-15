import {
  Controller,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseInterceptors,
  UseGuards,
  Req,
  Res,
  Get,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import type { FastifyReply } from 'fastify';
import { instanceToPlain } from 'class-transformer';
import { UserRefreshTokenUsecase } from '@users/usecases';
import { BaseResponseDto } from '@common/dtos';
import { UserAccessTokenResponseDto } from '@users/dtos';
import { GlobalExceptionFilter } from '@common/filters';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { ApiKeyGuard } from '@common/guards';
import { cookieUtility } from '@common/utilities';

@Controller('users')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(ApiKeyGuard)
export class UserRefreshTokenController {
  constructor(
    private readonly userRefreshTokenUsecase: UserRefreshTokenUsecase,
  ) {}

  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<BaseResponseDto<UserAccessTokenResponseDto>> {
    const cookieHeader = req.headers.cookie || '';
    const authResult = await this.userRefreshTokenUsecase.execute(cookieHeader);
    cookieUtility.setRefreshTokenCookie(reply, req, authResult.refreshToken);

    const accessTokenResponse = new UserAccessTokenResponseDto();
    accessTokenResponse.accessToken = authResult.accessToken;

    const response: BaseResponseDto<UserAccessTokenResponseDto> = {
      success: true,
      message: 'Access token refreshed successfully',
      data: instanceToPlain(accessTokenResponse) as UserAccessTokenResponseDto,
    };

    reply.send(response);
    return response;
  }
}
