import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { JobComparisonEntity } from '@jobs/entities';

@Injectable()
export class JobComparisonCreateRepository {
  private repo: Repository<JobComparisonEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(JobComparisonEntity);
  }

  async createComparison(
    comparison: Partial<JobComparisonEntity>,
  ): Promise<JobComparisonEntity> {
    const entity = this.repo.create(comparison);
    return this.repo.save(entity);
  }
}
