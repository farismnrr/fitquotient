import { Injectable } from '@nestjs/common';
import { IJobUsecaseContext } from '@jobs/context/jobs/job-usecase.context';
import { JobCreateDto } from '@jobs/dtos';
import { JobEntity } from '@jobs/entities';
import { JobCreateRepository } from '@jobs/repositories';

@Injectable()
export class JobCreateUsecase implements Partial<IJobUsecaseContext> {
  constructor(private readonly jobCreateRepository: JobCreateRepository) {}

  async jobCreateUsecase(createJobDto: JobCreateDto): Promise<string> {
    // Create job entity
    const job = new JobEntity();
    job.title = createJobDto.title;
    job.description = createJobDto.description || null;
    job.requirements = createJobDto.requirements || null;
    job.details = createJobDto.details;
    job.isActive = true;
    job.apiKeyId = createJobDto.apiKeyId;
    job.userId = createJobDto.userId;
    job.userCvId = createJobDto.userCvId || null;

    // Save job to repository
    return await this.jobCreateRepository.createJob(job);
  }
}
