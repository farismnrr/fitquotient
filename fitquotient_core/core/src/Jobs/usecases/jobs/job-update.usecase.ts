import { Injectable, NotFoundException } from '@nestjs/common';
import { IJobUsecaseContext } from '@jobs/context/jobs/job-usecase.context';
import { JobUpdateDto } from '@jobs/dtos';
import { JobEntity } from '@jobs/entities';
import { JobUpdateRepository } from '@jobs/repositories';
import { JobGetRepository } from '@jobs/repositories/jobs/job-get.repository';

@Injectable()
export class JobUpdateUsecase implements Partial<IJobUsecaseContext> {
  constructor(
    private readonly jobUpdateRepository: JobUpdateRepository,
    private readonly jobGetRepository: JobGetRepository,
  ) {}

  async jobUpdateUsecase(
    jobId: string,
    updateJobDto: JobUpdateDto,
  ): Promise<void> {
    const data: Partial<JobEntity> = {};

    if (updateJobDto.title !== undefined) data.title = updateJobDto.title;
    if (updateJobDto.description !== undefined)
      data.description = updateJobDto.description;
    if (updateJobDto.requirements !== undefined)
      data.requirements = updateJobDto.requirements;
    if (updateJobDto.details !== undefined) data.details = updateJobDto.details;
    if (updateJobDto.isActive !== undefined)
      data.isActive = updateJobDto.isActive;

    // Ensure job exists first
    const existing = await this.jobGetRepository.getJobById(jobId);
    if (!existing) {
      throw new NotFoundException('Job not found');
    }

    await this.jobUpdateRepository.updateJob(jobId, data);
  }
}
