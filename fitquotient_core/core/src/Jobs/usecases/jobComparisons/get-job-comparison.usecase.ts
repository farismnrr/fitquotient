import { Injectable, NotFoundException } from '@nestjs/common';
import { JobComparisonGetRepository } from '@jobs/repositories';
import { JobComparisonEntity } from '@jobs/entities';

@Injectable()
export class GetJobComparisonUsecase {
  constructor(
    private readonly jobComparisonGetRepository: JobComparisonGetRepository,
  ) {}

  async execute(comparisonId: string): Promise<JobComparisonEntity> {
    const existing =
      await this.jobComparisonGetRepository.getByComparisonId(comparisonId);
    if (!existing) throw new NotFoundException('Comparison not found');
    return existing;
  }
}
