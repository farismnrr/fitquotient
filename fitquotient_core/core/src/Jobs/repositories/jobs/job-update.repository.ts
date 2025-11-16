import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { JobEntity } from '@jobs/entities';
import { UpdateJobException } from '../repository.error';
import type { RedisClientType } from 'redis';
import { IJobRepositoryContext } from '@jobs/context/jobs/job-repository.context';

@Injectable()
export class JobUpdateRepository implements Partial<IJobRepositoryContext> {
  private jobRepository: Repository<JobEntity>;

  constructor(
    private readonly dataSource: DataSource,
    @Inject('REDIS_CLIENT')
    private readonly redisConnection: RedisClientType | null,
  ) {
    this.jobRepository = this.dataSource.getRepository(JobEntity);
  }

  async updateJob(id: string, data: Partial<JobEntity>): Promise<void> {
    // Get existing job first
    const existingJob = await this.jobRepository.findOne({
      where: { id },
    });

    if (!existingJob) {
      throw new UpdateJobException();
    }

    // Merge data and save
    const updatedJob = this.jobRepository.merge(existingJob, data);
    await this.jobRepository.save(updatedJob);

    // Invalidate cache
    if (this.redisConnection) {
      const cacheKey = `job:${id}`;
      await this.redisConnection.del(cacheKey);
    }
  }
}
