import { JobCreateDto, JobGetDto, JobUpdateDto } from '@jobs/dtos';

export interface IJobUsecaseContext {
  jobCreateUsecase?: (createJobDto: JobCreateDto) => Promise<string>;
  jobGetByIdUsecase?: (jobId: string) => Promise<JobGetDto>;
  jobUpdateUsecase?: (jobId: string, data: JobUpdateDto) => Promise<void>;
  jobSoftDeleteUsecase?: (jobId: string) => Promise<void>;
}
