import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LlmApiKeyEntity } from 'src/Llms/entities';

@Injectable()
export class LlmApiKeyGetRepository {
  private repo: Repository<LlmApiKeyEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(LlmApiKeyEntity);
  }

  async getById(id: string): Promise<LlmApiKeyEntity | null> {
    return (await this.repo.findOne({ where: { id } })) || null;
  }
}
