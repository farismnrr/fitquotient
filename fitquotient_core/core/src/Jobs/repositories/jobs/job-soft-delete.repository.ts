import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { JobEntity } from '@jobs/entities';
import { IJobRepositoryContext } from '@jobs/context/jobs/job-repository.context';

@Injectable()
export class JobSoftDeleteRepository implements Partial<IJobRepositoryContext> {
  private jobRepository: Repository<JobEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.jobRepository = this.dataSource.getRepository(JobEntity);
  }

  async softDeleteJob(id: string): Promise<void> {
    const result = await this.jobRepository.update(id, { isActive: false });
    if (result.affected === 0) {
      throw new Error('Job not found');
    }
  }
}
