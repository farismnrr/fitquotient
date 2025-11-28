import { Injectable } from '@nestjs/common';
import { JobGetRepository } from '@jobs/repositories';
import { JobGetDto } from '@jobs/dtos';
import { JobEntity } from '@jobs/entities';

@Injectable()
export class JobGetAllUsecase {
  constructor(private readonly jobGetRepository: JobGetRepository) {}

  async execute(): Promise<JobGetDto[]> {
    const jobs: JobEntity[] = await this.jobGetRepository.getAll();
    const dtos: JobGetDto[] = jobs.map((j) => ({
      id: j.id,
      title: j.title,
      description: j.description ?? undefined,
      requirements: j.requirements ?? undefined,
      details: j.details ?? undefined,
      isActive: j.isActive,
      createdAt: j.createdAt,
      updatedAt: j.updatedAt,
    }));
    return dtos;
  }
}
