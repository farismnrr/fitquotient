import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { JobEntity } from '@jobs/entities';
import { IJobRepositoryContext } from '@jobs/context/jobs/job-repository.context';
import { CreateJobException } from '../repository.error';

@Injectable()
export class JobCreateRepository implements Partial<IJobRepositoryContext> {
  private jobRepository: Repository<JobEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.jobRepository = this.dataSource.getRepository(JobEntity);
  }

  async createJob(job: JobEntity): Promise<string> {
    const jobQuery = this.jobRepository.create(job);
    const result = await this.jobRepository.save(jobQuery);

    if (!result?.id) {
      throw new CreateJobException();
    }

    return result.id;
  }
}
