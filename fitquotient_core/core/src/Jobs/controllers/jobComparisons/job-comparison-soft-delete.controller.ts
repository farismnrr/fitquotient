import {
  Controller,
  Delete,
  Param,
  UseFilters,
  UseInterceptors,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { GlobalExceptionFilter } from '@common/filters';
import { JwtGuard } from '@common/guards';
import { JobComparisonSoftDeleteUsecase } from '@jobs/usecases/jobComparisons/job-comparison-soft-delete.usecase';
import { BaseResponseDto } from '@common/dtos';

@Controller('jobs/comparisons')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class JobComparisonSoftDeleteController {
  constructor(
    private readonly softDeleteUsecase: JobComparisonSoftDeleteUsecase,
  ) {}

  @Delete(':comparisonId')
  @HttpCode(HttpStatus.OK)
  async softDelete(
    @Param('comparisonId') comparisonId: string,
  ): Promise<BaseResponseDto<null>> {
    await this.softDeleteUsecase.jobComparisonSoftDeleteUsecase(comparisonId);
    return {
      is_success: true,
      message: 'Comparison soft deleted',
      data: null,
    };
  }
}
