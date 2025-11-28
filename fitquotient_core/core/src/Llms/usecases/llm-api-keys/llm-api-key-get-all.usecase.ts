import { Injectable } from '@nestjs/common';
import { LlmApiKeyGetRepository } from '@llm/repositories';
import { LlmApiKeyEntity } from '@llm/entities';

@Injectable()
export class LlmApiKeyGetAllUsecase {
  constructor(
    private readonly llmApiKeyGetRepository: LlmApiKeyGetRepository,
  ) {}

  async execute(): Promise<LlmApiKeyEntity[]> {
    return await this.llmApiKeyGetRepository.getAll();
  }
}
