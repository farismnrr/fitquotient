import { Injectable, NotFoundException } from '@nestjs/common';
import { IJobUsecaseContext } from '@jobs/context/jobs/job-usecase.context';
import { JobGetDto } from '@jobs/dtos';
import { JobGetRepository } from '@jobs/repositories';

@Injectable()
export class JobGetByIdUsecase implements Partial<IJobUsecaseContext> {
  constructor(private readonly jobGetRepository: JobGetRepository) {}

  async jobGetByIdUsecase(jobId: string): Promise<JobGetDto> {
    const job = await this.jobGetRepository.getJobById(jobId);
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return {
      id: job.id,
      title: job.title,
      description: job.description || undefined,
      requirements: job.requirements || undefined,
      details: job.details,
      isActive: job.isActive,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}
