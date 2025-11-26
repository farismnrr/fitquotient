import {
  Controller,
  Post,
  Body,
  UseFilters,
  UseInterceptors,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { GlobalExceptionFilter } from '@common/filters';
import { JwtGuard } from '@common/guards';
import { CreateJobComparisonDto } from '@jobs/dtos/jobComparisons/job-comparison.dto';
import { CreateJobComparisonUsecase } from '@jobs/usecases/jobComparisons/create-job-comparison.usecase';
import { BaseResponseDto } from '@common/dtos';
import { JobComparisonResultDto } from '@jobs/dtos/jobEvaluates/job-result.dto';

@Controller('jobs/comparisons')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class JobComparisonCreateController {
  constructor(private readonly createUsecase: CreateJobComparisonUsecase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() body: CreateJobComparisonDto,
  ): Promise<BaseResponseDto<JobComparisonResultDto>> {
    const record = await this.createUsecase.execute(body.cvId, body.jobId);
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
      message: 'Comparison created',
      data: {
        comparisonId: record.comparisonId,
        status: record.status,
        result: safeResult,
      },
    };
  }
}
