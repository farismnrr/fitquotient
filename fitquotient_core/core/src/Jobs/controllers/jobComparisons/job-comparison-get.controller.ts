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
import { GlobalExceptionFilter } from '@common/filters';
import { JwtGuard } from '@common/guards';
import { GetJobComparisonUsecase } from '@jobs/usecases/jobComparisons/get-job-comparison.usecase';
import { BaseResponseDto } from '@common/dtos';
import { JobComparisonResultDto } from '@jobs/dtos/jobEvaluates/job-result.dto';

@Controller('jobs/comparisons')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class JobComparisonGetController {
  constructor(private readonly getUsecase: GetJobComparisonUsecase) {}

  @Get(':comparisonId')
  @HttpCode(HttpStatus.OK)
  async get(
    @Param('comparisonId') comparisonId: string,
  ): Promise<BaseResponseDto<JobComparisonResultDto>> {
    const record = await this.getUsecase.execute(comparisonId);
    const result = record.result as JobComparisonResultDto['result'] | null;
    const safeResult: JobComparisonResultDto['result'] = result ?? {
      matchPercentage: 0,
      matchedSkills: [],
      missingSkills: [],
      summary: '',
      recommendations: '',
    };
    return {
      is_success: true,
      message: 'Comparison retrieved',
      data: {
        comparisonId: record.comparisonId,
        status: record.status,
        cvName: record.cv?.name ?? null,
        jobTitle: record.job?.title ?? null,
        result: safeResult,
      },
    };
  }
}
