import { Injectable } from '@nestjs/common';
import { JobComparisonGetRepository } from '@jobs/repositories';
import { JobComparisonResultDto } from '@jobs/dtos/jobEvaluates/job-result.dto';
import { JobResultUsecase } from '@jobs/usecases';

@Injectable()
export class GetAllJobComparisonsUsecase {
  constructor(
    private readonly jobComparisonGetRepository: JobComparisonGetRepository,
    private readonly jobResultUsecase: JobResultUsecase,
  ) {}

  async execute(): Promise<JobComparisonResultDto[]> {
    const records = await this.jobComparisonGetRepository.getAll();

    const items = records.map((r) => ({
      comparisonId: r.comparisonId,
      status: r.status,
      result: (r.result as JobComparisonResultDto['result']) ?? {
        matchPercentage: 0,
        matchedSkills: [],
        missingSkills: [],
        summary: '',
        recommendations: '',
      },
    }));

    const processingItems = items.filter((i) => i.status === 'processing');
    if (processingItems.length > 0) {
      void Promise.allSettled(
        processingItems.map((p) =>
          this.jobResultUsecase
            .execute({ comparisonId: p.comparisonId })
            .catch(() => undefined),
        ),
      );
    }

    return items;
  }
}
