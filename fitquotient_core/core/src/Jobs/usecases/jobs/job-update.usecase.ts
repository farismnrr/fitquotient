import { Injectable } from '@nestjs/common';
import { IJobUsecaseContext } from '@jobs/context/jobs/job-usecase.context';
import { JobUpdateDto } from '@jobs/dtos';
import { JobEntity } from '@jobs/entities';
import { JobUpdateRepository } from '@jobs/repositories';

@Injectable()
export class JobUpdateUsecase implements Partial<IJobUsecaseContext> {
  constructor(private readonly jobUpdateRepository: JobUpdateRepository) {}

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
    if (updateJobDto.apiKeyId !== undefined)
      data.apiKeyId = updateJobDto.apiKeyId;
    if (updateJobDto.userId !== undefined) data.userId = updateJobDto.userId;
    if (updateJobDto.userCvId !== undefined)
      data.userCvId = updateJobDto.userCvId;

    await this.jobUpdateRepository.updateJob(jobId, data);
  }
}
