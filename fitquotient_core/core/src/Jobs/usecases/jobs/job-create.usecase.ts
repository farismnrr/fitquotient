import { Injectable, NotFoundException } from '@nestjs/common';
import { IJobUsecaseContext } from '@jobs/context/jobs/job-usecase.context';
import { JobCreateDto } from '@jobs/dtos';
import { JobEntity } from '@jobs/entities';
import { JobCreateRepository } from '@jobs/repositories';
import { JobVectorCreateService } from '@jobs/services/job-vector-create.service';
import { LlmApiKeyGetRepository } from '@llm/repositories';
import { UserGetRepository } from '@users/repositories/users/user-get.repository';
import { UserCvGetRepository } from '@users/repositories/userCVs/user-cv-get.repository';

@Injectable()
export class JobCreateUsecase implements Partial<IJobUsecaseContext> {
  constructor(
    private readonly jobCreateRepository: JobCreateRepository,
    private readonly llmApiKeyGetRepository: LlmApiKeyGetRepository,
    private readonly userGetRepository: UserGetRepository,
    private readonly userCvGetRepository: UserCvGetRepository,
    private readonly jobVectorCreateService: JobVectorCreateService,
  ) {}

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

    // Validate api key exists
    const apiKey = await this.llmApiKeyGetRepository.getById(
      createJobDto.apiKeyId,
    );
    if (!apiKey) {
      throw new NotFoundException('LLM API key not found');
    }

    // Validate user exists
    const user = await this.userGetRepository.getUserById(createJobDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If userCvId is provided ensure it belongs to the same user
    if (createJobDto.userCvId) {
      const userCv = await this.userCvGetRepository.getUserCvById(
        createJobDto.userCvId,
      );
      if (!userCv || userCv.userId !== createJobDto.userId) {
        throw new NotFoundException('CV not found');
      }
    }

    const id = await this.jobCreateRepository.createJob(job);

    const text = `${createJobDto.title} ${createJobDto.description || ''} ${createJobDto.requirements || ''} ${typeof createJobDto.details === 'string' ? createJobDto.details : ''}`;
    await this.jobVectorCreateService.createJobVector({
      jobId: id,
      text: text.trim(),
    });

    return id;
  }
}
