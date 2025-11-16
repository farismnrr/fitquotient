import {
  Controller,
  Delete,
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
import { UserCvSoftDeleteUsecase } from '../../usecases/userCVs/user-cv-soft-delete.usecase';
import { BaseResponseDto } from '@common/dtos';
import { UserCvGetByIdParamsDto } from '@users/dtos';

@Controller('users')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class UserCvSoftDeleteController {
  constructor(
    private readonly userCvSoftDeleteUsecase: UserCvSoftDeleteUsecase,
  ) {}

  @Delete(':userId/cvs/:cvId')
  @HttpCode(HttpStatus.OK)
  async softDelete(
    @Param() params: UserCvGetByIdParamsDto,
  ): Promise<BaseResponseDto<null>> {
    await this.userCvSoftDeleteUsecase.userCvSoftDeleteUsecase(params.cvId);

    return {
      success: true,
      message: 'CV deleted successfully',
    };
  }
}
