import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { JobComparisonEntity } from '@jobs/entities';

@Injectable()
export class JobComparisonSoftDeleteRepository {
  private repo: Repository<JobComparisonEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(JobComparisonEntity);
  }

  async softDeleteComparison(id: string): Promise<void> {
    await this.repo.save({
      id,
      isActive: false,
    } as Partial<JobComparisonEntity>);
  }
}
