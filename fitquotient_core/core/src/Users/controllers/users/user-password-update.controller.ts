import {
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  UseInterceptors,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Body,
  Param,
  UseFilters,
} from '@nestjs/common';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { JwtGuard } from '@common/guards';
import { UserPasswordUpdateUsecase } from '@users/usecases';
import { BaseResponseDto } from '@common/dtos';
import { UserGetByIdParamsDto } from '@users/dtos';
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

  @Patch(':userId')
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
  async updatePassword(
    @Param() params: UserGetByIdParamsDto,
    @Body() dto: UserPasswordUpdateDto,
  ): Promise<BaseResponseDto<void>> {
    await this.userPasswordUpdateUsecase.userPasswordUpdateUsecase(
      params.userId,
      dto,
    );
    return {
      is_success: true,
      message: `User updated successfully`,
    };
  }
}
