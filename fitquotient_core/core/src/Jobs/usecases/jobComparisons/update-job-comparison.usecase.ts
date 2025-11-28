import { Injectable, NotFoundException } from '@nestjs/common';
import {
  JobComparisonUpdateRepository,
  JobComparisonGetRepository,
} from '@jobs/repositories';
import { JobComparisonEntity } from '@jobs/entities';

@Injectable()
export class UpdateJobComparisonUsecase {
  constructor(
    private readonly jobComparisonUpdateRepository: JobComparisonUpdateRepository,
    private readonly jobComparisonGetRepository: JobComparisonGetRepository,
  ) {}

  async execute(
    comparisonId: string,
    payload: Partial<JobComparisonEntity>,
  ): Promise<void> {
    const existing =
      await this.jobComparisonGetRepository.getByComparisonId(comparisonId);
    if (!existing) throw new NotFoundException('Comparison not found');

    await this.jobComparisonUpdateRepository.updateComparisonResult(
      existing.id,
      payload,
    );
    return;
  }
}
