import { Injectable } from '@nestjs/common';
import { IJobUsecaseContext } from '@jobs/context/jobs/job-usecase.context';
import { JobCreateDto } from '@jobs/dtos';
import { JobEntity } from '@jobs/entities';
import { JobCreateRepository } from '@jobs/repositories';
import { JobVectorCreateService } from '@jobs/services/job-vector-create.service';

@Injectable()
export class JobCreateUsecase implements Partial<IJobUsecaseContext> {
  constructor(
    private readonly jobCreateRepository: JobCreateRepository,
    private readonly jobVectorCreateService: JobVectorCreateService,
  ) {}

  async jobCreateUsecase(createJobDto: JobCreateDto): Promise<string> {
    // Create job entity
    const job = new JobEntity();
    job.title = createJobDto.title;
    job.description = createJobDto.description || null;
    job.requirements = createJobDto.requirements || null;
    job.details = createJobDto.details;
    job.isActive = true;

    const id = await this.jobCreateRepository.createJob(job);

    const text = `${createJobDto.title} ${createJobDto.description || ''} ${createJobDto.requirements || ''} ${typeof createJobDto.details === 'string' ? createJobDto.details : ''}`;
    await this.jobVectorCreateService.createJobVector({
      jobId: id,
      text: text.trim(),
    });

    return id;
  }
}
