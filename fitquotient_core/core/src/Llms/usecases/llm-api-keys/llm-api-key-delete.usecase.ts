import { Injectable, NotFoundException } from '@nestjs/common';
import { LlmApiKeyGetRepository } from '@llm/repositories';
import { LlmApiKeyDeleteRepository } from '@llm/repositories/llm-api-keys/llm-api-key-delete.repository';

@Injectable()
export class LlmApiKeyDeleteUsecase {
  constructor(
    private readonly llmApiKeyGetRepository: LlmApiKeyGetRepository,
    private readonly llmApiKeyDeleteRepository: LlmApiKeyDeleteRepository,
  ) {}

  async execute(apiKeyId: string): Promise<void> {
    const existing = await this.llmApiKeyGetRepository.getById(apiKeyId);
    if (!existing) {
      throw new NotFoundException('LLM API key not found');
    }

    return await this.llmApiKeyDeleteRepository.deleteById(apiKeyId);
  }
}
