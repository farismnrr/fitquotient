import { Injectable, NotFoundException } from '@nestjs/common';
import { JobComparisonSoftDeleteRepository } from '@jobs/repositories/jobComparisons/job-comparison-soft-delete.repository';
import { JobComparisonGetRepository } from '@jobs/repositories/jobComparisons/job-comparison-get.repository';

@Injectable()
export class JobComparisonSoftDeleteUsecase {
  constructor(
    private readonly jobComparisonSoftDeleteRepository: JobComparisonSoftDeleteRepository,
    private readonly jobComparisonGetRepository: JobComparisonGetRepository,
  ) {}

  async jobComparisonSoftDeleteUsecase(comparisonId: string): Promise<void> {
    const existing =
      await this.jobComparisonGetRepository.getByComparisonId(comparisonId);
    if (!existing) {
      throw new NotFoundException('Comparison not found');
    }

    await this.jobComparisonSoftDeleteRepository.softDeleteComparison(
      existing.id,
    );
  }
}
