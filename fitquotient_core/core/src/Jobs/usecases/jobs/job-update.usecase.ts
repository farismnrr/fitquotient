import { Injectable, NotFoundException } from '@nestjs/common';
import { IJobUsecaseContext } from '@jobs/context/jobs/job-usecase.context';
import { JobUpdateDto } from '@jobs/dtos';
import { JobEntity } from '@jobs/entities';
import { JobUpdateRepository } from '@jobs/repositories';
import { JobGetRepository } from '@jobs/repositories/jobs/job-get.repository';
import { LlmApiKeyGetRepository } from '@llm/repositories';
import { UserGetRepository } from '@users/repositories/users/user-get.repository';
import { UserCvGetRepository } from '@users/repositories/userCVs/user-cv-get.repository';

@Injectable()
export class JobUpdateUsecase implements Partial<IJobUsecaseContext> {
  constructor(
    private readonly jobUpdateRepository: JobUpdateRepository,
    private readonly jobGetRepository: JobGetRepository,
    private readonly llmApiKeyGetRepository: LlmApiKeyGetRepository,
    private readonly userGetRepository: UserGetRepository,
    private readonly userCvGetRepository: UserCvGetRepository,
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
    if (updateJobDto.apiKeyId !== undefined)
      data.apiKeyId = updateJobDto.apiKeyId;
    if (updateJobDto.userId !== undefined) data.userId = updateJobDto.userId;
    if (updateJobDto.userCvId !== undefined)
      data.userCvId = updateJobDto.userCvId;

    // Ensure job exists first
    const existing = await this.jobGetRepository.getJobById(jobId);
    if (!existing) {
      throw new NotFoundException('Job not found');
    }

    // Validate if apiKeyId is updated
    if (updateJobDto.apiKeyId) {
      const apiKey = await this.llmApiKeyGetRepository.getById(
        updateJobDto.apiKeyId,
      );
      if (!apiKey) {
        throw new NotFoundException('LLM API key not found');
      }
    }

    // Validate user if updated
    if (updateJobDto.userId) {
      const user = await this.userGetRepository.getUserById(
        updateJobDto.userId,
      );
      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    // Validate CV if updated (ensure it belongs to updated user or existing user)
    if (updateJobDto.userCvId) {
      const userCv = await this.userCvGetRepository.getUserCvById(
        updateJobDto.userCvId,
      );
      const userIdToCheck = updateJobDto.userId || existing.userId;
      if (!userCv || userCv.userId !== userIdToCheck) {
        throw new NotFoundException('CV not found');
      }
    }

    await this.jobUpdateRepository.updateJob(jobId, data);
  }
}
