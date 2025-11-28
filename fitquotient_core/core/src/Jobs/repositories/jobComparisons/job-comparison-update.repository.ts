import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { JobComparisonEntity } from '@jobs/entities';

@Injectable()
export class JobComparisonUpdateRepository {
  private repo: Repository<JobComparisonEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(JobComparisonEntity);
  }

  async updateComparisonResult(
    id: string,
    payload: Partial<JobComparisonEntity>,
  ): Promise<void> {
    // Use update so TypeORM doesn't try to persist relation graphs
    await this.repo.update(
      id,
      payload as QueryDeepPartialEntity<JobComparisonEntity>,
    );
    return;
  }
}
