import { Injectable, NotFoundException } from '@nestjs/common';
import { LlmApiKeyGetRepository } from 'src/Llms/repositories';
import { LlmApiKeyDeleteRepository } from 'src/Llms/repositories/llm-api-keys/llm-api-key-delete.repository';

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
