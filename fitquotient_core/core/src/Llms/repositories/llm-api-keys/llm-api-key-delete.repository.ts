import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LlmApiKeyEntity } from 'src/Llms/entities';
import { DeleteLlmApiKeyException } from '../repository.error';

@Injectable()
export class LlmApiKeyDeleteRepository {
  private repo: Repository<LlmApiKeyEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(LlmApiKeyEntity);
  }

  async deleteById(id: string): Promise<void> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) {
      throw new DeleteLlmApiKeyException();
    }

    const result = await this.repo.delete(id);
    if (!result || result.affected === 0) {
      throw new DeleteLlmApiKeyException();
    }
  }
}
