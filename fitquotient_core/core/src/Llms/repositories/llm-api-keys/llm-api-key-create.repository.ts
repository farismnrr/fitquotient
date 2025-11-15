import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LlmApiKeyEntity } from 'src/Llms/entities';
import { CreateLlmApiKeyException } from '../repository.error';

@Injectable()
export class LlmApiKeyCreateRepository {
  private repo: Repository<LlmApiKeyEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(LlmApiKeyEntity);
  }

  async create(apiKey: LlmApiKeyEntity): Promise<string> {
    const created = this.repo.create(apiKey);
    const result = await this.repo.save(created);
    if (!result?.id) {
      throw new CreateLlmApiKeyException();
    }
    return result.id;
  }
}
