import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
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
    // Save using primary key id so repository doesn't need to fetch the entity
    await this.repo.save({
      id,
      ...payload,
    } as Partial<JobComparisonEntity>);
    return;
  }
}
