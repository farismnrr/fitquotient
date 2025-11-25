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
import { CaseTransformerInterceptor } from '@common/interceptors';
import { JwtGuard } from '@common/guards';
import { GlobalExceptionFilter } from '@common/filters';
import { UserCvGetAllUsecase } from '../../usecases/userCVs/user-cv-get-all.usecase';
import { BaseResponseDto } from '@common/dtos';
import { UserCvResponseDto } from '@users/dtos';
import { UserGetByIdParamsDto } from '@users/dtos';

@Controller('users')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class UserCvGetAllController {
  constructor(private readonly userCvGetAllUsecase: UserCvGetAllUsecase) {}

  @Get(':userId/cvs')
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Param() params: UserGetByIdParamsDto,
  ): Promise<BaseResponseDto<{ cvs: UserCvResponseDto[] }>> {
    const cvs = await this.userCvGetAllUsecase.userCvGetAllUsecase(
      params.userId,
    );

    return {
      is_success: true,
      message: 'User CVs retrieved successfully',
      data: { cvs },
    };
  }
}
