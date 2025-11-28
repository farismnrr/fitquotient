import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import type { RedisClientType } from 'redis';
import { JobEntity } from '@jobs/entities';
import { IJobRepositoryContext } from '@jobs/context/jobs/job-repository.context';

@Injectable()
export class JobGetRepository implements Partial<IJobRepositoryContext> {
  private jobRepository: Repository<JobEntity>;

  constructor(
    private readonly dataSource: DataSource,
    @Inject('REDIS_CLIENT')
    private readonly redisConnection: RedisClientType | null,
  ) {
    this.jobRepository = this.dataSource.getRepository(JobEntity);
  }

  async getJobById(id: string): Promise<JobEntity | null> {
    if (!this.redisConnection) {
      const job = await this.jobRepository.findOne({
        where: { id, isActive: true },
      });
      return job || null;
    }

    const cacheKey = `job:${id}`;
    const cached = await this.redisConnection.get(cacheKey);

    if (cached) {
      return JSON.parse(cached) as JobEntity;
    }

    const job = await this.jobRepository.findOne({
      where: { id, isActive: true },
    });
    if (!job) return null;

    await this.redisConnection.setEx(cacheKey, 60, JSON.stringify(job));
    return job;
  }

  async getAll(): Promise<JobEntity[]> {
    const jobs = await this.jobRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
    return jobs || [];
  }
}
