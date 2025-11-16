import { Injectable, NotFoundException } from '@nestjs/common';
import { IJobUsecaseContext } from '@jobs/context/jobs/job-usecase.context';
import { JobSoftDeleteRepository } from '@jobs/repositories';
import { JobGetRepository } from '@jobs/repositories/jobs/job-get.repository';

@Injectable()
export class JobSoftDeleteUsecase implements Partial<IJobUsecaseContext> {
  constructor(
    private readonly jobSoftDeleteRepository: JobSoftDeleteRepository,
    private readonly jobGetRepository: JobGetRepository,
  ) {}

  async jobSoftDeleteUsecase(jobId: string): Promise<void> {
    const existing = await this.jobGetRepository.getJobById(jobId);
    if (!existing) {
      throw new NotFoundException('Job not found');
    }

    await this.jobSoftDeleteRepository.softDeleteJob(jobId);
  }
}
