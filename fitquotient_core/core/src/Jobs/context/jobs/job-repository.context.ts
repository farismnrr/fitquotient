import { JobEntity } from '../../entities/job.entity';

export interface IJobRepositoryContext {
  createJob(job: JobEntity): Promise<string>;
  getJobById(id: string): Promise<JobEntity | null>;
  updateJob(id: string, data: Partial<JobEntity>): Promise<void>;
  softDeleteJob(id: string): Promise<void>;
}
