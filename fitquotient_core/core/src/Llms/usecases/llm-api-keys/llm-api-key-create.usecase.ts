import { Injectable } from '@nestjs/common';
import { LlmApiKeyCreateDto } from '@llm/dtos';
import { LlmApiKeyEntity } from '@llm/entities';
import { LlmApiKeyCreateRepository } from '@llm/repositories';
import { encryptionUtility } from '@common/utilities';

@Injectable()
export class LlmApiKeyCreateUsecase {
  constructor(
    private readonly llmApiKeyCreateRepository: LlmApiKeyCreateRepository,
  ) {}

  async execute(dto: LlmApiKeyCreateDto): Promise<string> {
    const entity = new LlmApiKeyEntity();
    entity.name = dto.name;
    entity.provider = dto.provider;
    entity.secret = encryptionUtility.encrypt(dto.secret);

    return await this.llmApiKeyCreateRepository.create(entity);
  }
}
