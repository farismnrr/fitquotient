import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { JobComparisonEntity } from '@jobs/entities';

@Injectable()
export class JobComparisonSoftDeleteRepository {
  private repo: Repository<JobComparisonEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(JobComparisonEntity);
  }

  async softDeleteComparison(id: string): Promise<void> {
    await this.repo.update(id, {
      isActive: false,
    } as QueryDeepPartialEntity<JobComparisonEntity>);
  }
}
