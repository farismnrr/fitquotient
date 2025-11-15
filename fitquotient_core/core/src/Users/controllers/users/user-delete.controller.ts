import {
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  Param,
  Delete,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '@common/guards';
import { UserSoftDeleteUsecase } from '@users/usecases';
import { BaseResponseDto, UserGetByIdParamsDto } from '@users/dtos';
import { GlobalExceptionFilter } from '@common/filters/global-exception.filter';
import { CaseTransformerInterceptor } from '@common/interceptors';

@Controller('users')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class UserSoftDeleteController {
  constructor(private readonly userSoftDeleteUsecase: UserSoftDeleteUsecase) {}

  @Delete(':userId')
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @Param() params: UserGetByIdParamsDto,
  ): Promise<BaseResponseDto<void>> {
    await this.userSoftDeleteUsecase.execute(params.userId);
    return {
      success: true,
      message: `User deleted successfully`,
    };
  }
}
