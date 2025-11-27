import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { JobComparisonEntity } from '@jobs/entities';
import { InsertResult } from 'typeorm';

@Injectable()
export class JobComparisonCreateRepository {
  private repo: Repository<JobComparisonEntity>;
  private readonly logger = new Logger(JobComparisonCreateRepository.name);

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(JobComparisonEntity);
  }

  async createComparison(
    comparison: Partial<JobComparisonEntity>,
  ): Promise<JobComparisonEntity> {
    const entity = this.repo.create(comparison);
      if ((comparison as any).cv || (comparison as any).job) {
      this.logger.warn(
        'createComparison received nested relation objects (cv or job). Using insert to avoid cascade persistence. Remove nested objects to avoid unexpected behavior.',
      );
      (entity as any).cv = undefined;
      (entity as any).job = undefined;
    }
    const insertResult: InsertResult = await this.repo.insert(entity as any);
    const newId = insertResult.identifiers && insertResult.identifiers[0]?.id;
    if (!newId) {
      const saved = await this.repo.save(entity);
      return saved;
    }
    const savedEntity = await this.repo.findOne({ where: { id: newId } });
    return savedEntity || (entity as JobComparisonEntity);
  }
}
