import { LlmApiKeyEntity } from '@llm/entities';

export interface ILlmApiKeyRepositoryContext {
  create(apiKey: LlmApiKeyEntity): Promise<string>;
  getById(id: string): Promise<LlmApiKeyEntity | null>;
  delete(id: string): Promise<void>;
}
