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

    // Check for nested relations that should not be persisted
    const hasNestedRelations = 'cv' in comparison || 'job' in comparison;

    if (hasNestedRelations) {
      this.logger.warn(
        'createComparison received nested relation objects (cv or job). Using insert to avoid cascade persistence. Remove nested objects to avoid unexpected behavior.',
      );
      // Remove nested relations before insert
      delete (entity as unknown as Record<string, unknown>).cv;
      delete (entity as unknown as Record<string, unknown>).job;
    }

    // TypeORM insert requires partial entity, use type assertion
    const insertResult: InsertResult = await this.repo.insert(
      entity as Parameters<typeof this.repo.insert>[0],
    );
    const newId = insertResult.identifiers?.[0]?.id as string | undefined;

    if (!newId) {
      const saved = await this.repo.save(entity);
      return saved;
    }

    const savedEntity = await this.repo.findOne({ where: { id: newId } });
    return savedEntity || entity;
  }
}
