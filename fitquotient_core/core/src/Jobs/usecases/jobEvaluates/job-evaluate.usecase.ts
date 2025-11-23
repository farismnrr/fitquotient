import { Injectable, NotFoundException } from '@nestjs/common';
import { JobGetRepository } from '@jobs/repositories';
import { UserGetRepository } from '@users/repositories';
import { UserCvGetRepository } from '@users/repositories';
import { LlmApiKeyGetRepository } from '@llm/repositories';
import { encryptionUtility } from '@common/utilities';
import { JobEvaluateDto, JobVectorEvaluateDataDto } from '@jobs/dtos';
import { JobVectorEvaluateService } from '@jobs/services';

@Injectable()
export class JobEvaluateUsecase {
  constructor(
    private readonly jobGetRepository: JobGetRepository,
    private readonly userGetRepository: UserGetRepository,
    private readonly userCvGetRepository: UserCvGetRepository,
    private readonly llmApiKeyGetRepository: LlmApiKeyGetRepository,
    private readonly jobVectorEvaluateService: JobVectorEvaluateService,
  ) {}

  async execute(params: JobEvaluateDto): Promise<JobVectorEvaluateDataDto> {
    const job = await this.jobGetRepository.getJobById(params.jobId);
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const user = await this.userGetRepository.getUserById(params.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const apiKey = await this.llmApiKeyGetRepository.getById(params.apiKeyId);
    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }

    const decryptedSecret = encryptionUtility.decrypt(apiKey.secret);
    const jobId = params.jobId;
    const model = params.model;
    const provider = params.provider;

    const userCv = await this.userCvGetRepository.getUserCvById(
      params.userCvId,
    );
    if (!userCv) {
      throw new NotFoundException('User CV not found');
    }

    const result = await this.jobVectorEvaluateService.evaluateJobVector({
      cvId: userCv.id,
      jobId,
      apiKey: decryptedSecret,
      model,
      provider,
    });

    if (!result.data) {
      throw new NotFoundException('Evaluation data not found');
    }

    return result.data;
  }
}
