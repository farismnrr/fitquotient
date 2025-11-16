import { Injectable } from '@nestjs/common';
import { IJobUsecaseContext } from '@jobs/context/jobs/job-usecase.context';
import { JobSoftDeleteRepository } from '@jobs/repositories';

@Injectable()
export class JobSoftDeleteUsecase implements Partial<IJobUsecaseContext> {
  constructor(
    private readonly jobSoftDeleteRepository: JobSoftDeleteRepository,
  ) {}

  async jobSoftDeleteUsecase(jobId: string): Promise<void> {
    await this.jobSoftDeleteRepository.softDeleteJob(jobId);
  }
}
