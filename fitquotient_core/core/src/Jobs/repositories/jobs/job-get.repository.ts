import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { JobEntity } from '@jobs/entities';
import { IJobRepositoryContext } from '@jobs/context/jobs/job-repository.context';

@Injectable()
export class JobGetRepository implements Partial<IJobRepositoryContext> {
  private jobRepository: Repository<JobEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.jobRepository = this.dataSource.getRepository(JobEntity);
  }

  async getJobById(id: string): Promise<JobEntity | null> {
    const job = await this.jobRepository.findOne({
      where: { id, isActive: true },
      relations: ['apiKey', 'user', 'userCv'],
    });
    return job || null;
  }
}
