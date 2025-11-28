import { Injectable, NotFoundException } from '@nestjs/common';
import { JobVectorResultService } from '@jobs/services';
import { UpdateJobComparisonUsecase } from '@jobs/usecases/jobComparisons/update-job-comparison.usecase';
import { JobComparisonEntity } from '@jobs/entities';
import { JobComparisonResultDto, JobResultQueryParamsDto } from '@jobs/dtos';

@Injectable()
export class JobResultUsecase {
  constructor(
    private readonly jobVectorResultService: JobVectorResultService,
    private readonly updateJobComparisonUsecase: UpdateJobComparisonUsecase,
  ) {}

  async execute(
    params: JobResultQueryParamsDto,
  ): Promise<JobComparisonResultDto> {
    const result = await this.jobVectorResultService.getJobResult(
      params.comparisonId,
    );
    if (!result.data) {
      // mark as failed in DB
      await this.updateJobComparisonUsecase.execute(params.comparisonId, {
        status: 'failed',
        errorMessage: 'Job result not found',
      } as unknown as Partial<JobComparisonEntity>);
      throw new NotFoundException('Job result not found');
    }

    // store result in DB (completed)
    await this.updateJobComparisonUsecase.execute(params.comparisonId, {
      status: result.data.status,
      result: result.data.result as unknown,
    } as unknown as Partial<JobComparisonEntity>);

    return result.data;
  }
}
