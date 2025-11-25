import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LlmApiKeyEntity } from '@llm/entities';
import { CreateLlmApiKeyException } from '../repository.error';

@Injectable()
export class LlmApiKeyCreateRepository {
  private repo: Repository<LlmApiKeyEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(LlmApiKeyEntity);
  }

  async create(apiKey: LlmApiKeyEntity): Promise<string> {
    // Remove all previous API keys before saving the new one
    await this.deleteAll();

    const created = this.repo.create(apiKey);
    const result = await this.repo.save(created);
    if (!result?.id) {
      throw new CreateLlmApiKeyException();
    }
    return result.id;
  }

  async deleteAll(): Promise<void> {
    // Use queryBuilder to ensure deletion is executed at DB level
    await this.repo.createQueryBuilder().delete().execute();
  }
}
