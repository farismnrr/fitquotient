import { Injectable, NotFoundException } from '@nestjs/common';
import { JobVectorResultService } from '@jobs/services';
import { JobComparisonResultDto, JobResultQueryParamsDto } from '@jobs/dtos';

@Injectable()
export class JobResultUsecase {
  constructor(
    private readonly jobVectorResultService: JobVectorResultService,
  ) {}

  async execute(
    params: JobResultQueryParamsDto,
  ): Promise<JobComparisonResultDto> {
    const result = await this.jobVectorResultService.getJobResult(
      params.cvId,
      params.jobId,
    );

    if (!result.data) {
      throw new NotFoundException('Job result not found');
    }

    return result.data;
  }
}
