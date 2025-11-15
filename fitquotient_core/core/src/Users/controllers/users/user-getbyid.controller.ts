import {
  Controller,
  Get,
  Param,
  UseFilters,
  UseInterceptors,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserGetByIdUsecase } from '@users/usecases';
import { BaseResponseDto } from '@common/dtos';
import { UserGetByIdParamsDto, UserGetDto } from '@users/dtos';
import { GlobalExceptionFilter } from '@common/filters';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { JwtGuard } from '@common/guards';

@Controller('users')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class UserGetByIdController {
  constructor(private readonly UserGetByIdUsecase: UserGetByIdUsecase) {}

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  async getById(
    @Param() params: UserGetByIdParamsDto,
  ): Promise<BaseResponseDto<{ user: UserGetDto }>> {
    const user = await this.UserGetByIdUsecase.execute(params.userId);

    return {
      success: true,
      message: 'User retrieved successfully',
      data: {
        user,
      },
    };
  }
}
