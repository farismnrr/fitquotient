import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { JobEntity } from '@jobs/entities';
import { IJobRepositoryContext } from '@jobs/context/jobs/job-repository.context';

@Injectable()
export class JobUpdateRepository implements Partial<IJobRepositoryContext> {
  private jobRepository: Repository<JobEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.jobRepository = this.dataSource.getRepository(JobEntity);
  }

  async updateJob(id: string, data: Partial<JobEntity>): Promise<void> {
    // Get existing job first
    const existingJob = await this.jobRepository.findOne({
      where: { id },
    });

    if (!existingJob) {
      throw new Error('Job not found');
    }

    // Merge data and save
    const updatedJob = this.jobRepository.merge(existingJob, data);
    await this.jobRepository.save(updatedJob);
  }
}
