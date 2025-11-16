import { LlmApiKeyCreateDto } from '@llm/dtos';

export interface ILlmApiKeyUsecaseContext {
  create(dto: LlmApiKeyCreateDto): Promise<string>;
  delete(apiKeyId: string): Promise<void>;
}
