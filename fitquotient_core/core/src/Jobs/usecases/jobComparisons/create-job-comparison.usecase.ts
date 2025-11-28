import { Injectable } from '@nestjs/common';
import { JobComparisonCreateRepository } from '@jobs/repositories';
import { JobComparisonEntity } from '@jobs/entities';

@Injectable()
export class CreateJobComparisonUsecase {
  constructor(
    private readonly jobComparisonCreateRepository: JobComparisonCreateRepository,
  ) {}

  async execute(cvId: string, jobId: string): Promise<JobComparisonEntity> {
    const created = await this.jobComparisonCreateRepository.createComparison({
      cvId,
      jobId,
      status: 'processing',
    });
    return created;
  }
}
