import { Injectable } from '@nestjs/common';
import { LlmApiKeyCreateDto } from 'src/Llms/dtos';
import { LlmApiKeyEntity } from 'src/Llms/entities';
import { LlmApiKeyCreateRepository } from 'src/Llms/repositories';
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
