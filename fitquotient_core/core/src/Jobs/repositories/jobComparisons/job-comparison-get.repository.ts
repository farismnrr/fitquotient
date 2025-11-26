import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { JobComparisonEntity } from '@jobs/entities';

@Injectable()
export class JobComparisonGetRepository {
  private repo: Repository<JobComparisonEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(JobComparisonEntity);
  }

  async getByComparisonId(
    comparisonId: string,
  ): Promise<JobComparisonEntity | null> {
    return this.repo.findOne({ where: { comparisonId, isActive: true } });
  }

  async getByCvAndJob(
    cvId: string,
    jobId: string,
  ): Promise<JobComparisonEntity | null> {
    // Return the latest active comparison (ordered by createdAt DESC) so callers
    // that rely on a single canonical record will receive the most recently
    // created comparison for a CV+Job pair.
    return this.repo.findOne({
      where: { cvId, jobId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getAll(): Promise<JobComparisonEntity[]> {
    return this.repo.find({ where: { isActive: true } });
  }
}
