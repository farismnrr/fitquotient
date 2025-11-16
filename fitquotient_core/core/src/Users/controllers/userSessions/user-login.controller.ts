import {
  Controller,
  Post,
  Body,
  Req,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseInterceptors,
  UseGuards,
  Res,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import type { FastifyReply } from 'fastify';
import { instanceToPlain } from 'class-transformer';
import { UserLoginUsecase } from '@users/usecases';
import { BaseResponseDto } from '@common/dtos';
import { UserLoginDto, UserAccessTokenResponseDto } from '@users/dtos';
import { GlobalExceptionFilter } from '@common/filters';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { ApiKeyGuard } from '@common/guards';
import { cookieUtility } from '@common/utilities';

@Controller('users')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(ApiKeyGuard)
export class UserLoginController {
  constructor(private readonly userLoginUseCase: UserLoginUsecase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async login(
    @Body() dto: UserLoginDto,
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<BaseResponseDto<UserAccessTokenResponseDto>> {
    const userAgent =
      (Array.isArray(req.headers['user-agent'])
        ? req.headers['user-agent'].join(' ')
        : req.headers['user-agent']) ?? '';

    const authResult = await this.userLoginUseCase.userLoginUsecase(
      dto,
      userAgent,
    );
    cookieUtility.setRefreshTokenCookie(reply, req, authResult.refreshToken);

    const accessTokenResponse = new UserAccessTokenResponseDto();
    accessTokenResponse.accessToken = authResult.accessToken;

    const response: BaseResponseDto<UserAccessTokenResponseDto> = {
      isSuccess: true,
      message: 'User logged in successfully',
      data: instanceToPlain(accessTokenResponse) as UserAccessTokenResponseDto,
    };

    reply.send(response);
    return response;
  }
}
