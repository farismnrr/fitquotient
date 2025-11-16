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
import { JobSoftDeleteUsecase } from '@jobs/usecases';
import { BaseResponseDto } from '@common/dtos';
import { JobIdDto } from '@jobs/dtos';
import { GlobalExceptionFilter } from '@common/filters';
import { CaseTransformerInterceptor } from '@common/interceptors';

@Controller('jobs')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class JobSoftDeleteController {
  constructor(private readonly jobSoftDeleteUsecase: JobSoftDeleteUsecase) {}

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteJob(@Param() params: JobIdDto): Promise<BaseResponseDto<void>> {
    await this.jobSoftDeleteUsecase.jobSoftDeleteUsecase(params.id);
    return {
      isSuccess: true,
      message: `Job deleted successfully`,
    };
  }
}
