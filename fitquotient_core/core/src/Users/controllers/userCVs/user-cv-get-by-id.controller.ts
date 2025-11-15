import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseInterceptors,
  UseGuards,
  Param,
} from '@nestjs/common';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { JwtGuard } from '@common/guards';
import { GlobalExceptionFilter } from '@common/filters';
import { UserCvGetByIdUsecase } from '../../usecases/userCVs/user-cv-get-by-id.usecase';
import { BaseResponseDto } from '@common/dtos';
import { UserCvGetByIdParamsDto } from '@users/dtos';
import { UserCvResponseDto } from '@users/dtos';

@Controller('users')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class UserCvGetByIdController {
  constructor(private readonly userCvGetByIdUsecase: UserCvGetByIdUsecase) {}

  @Get(':userId/cvs/:cvId')
  @HttpCode(HttpStatus.OK)
  async getById(
    @Param() params: UserCvGetByIdParamsDto,
  ): Promise<BaseResponseDto<{ cv: UserCvResponseDto }>> {
    const cv = await this.userCvGetByIdUsecase.execute(params.cvId);

    return {
      success: true,
      message: 'CV retrieved successfully',
      data: {
        cv,
      },
    };
  }
}
