import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UserCreateUsecase } from '@users/usecases';
import { UserCreateDto, BaseResponseDto } from '@users/dtos';
import { GlobalExceptionFilter } from '@common/filters';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { ApiKeyGuard } from '@common/guards';

@Controller('users')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(ApiKeyGuard)
export class UserCreateController {
  constructor(private readonly userCreateUsecase: UserCreateUsecase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async create(
    @Body() dto: UserCreateDto,
  ): Promise<BaseResponseDto<{ user_id: string }>> {
    const userId = await this.userCreateUsecase.execute(dto);

    return {
      success: true,
      message: 'User created successfully',
      data: { user_id: userId },
    };
  }
}
