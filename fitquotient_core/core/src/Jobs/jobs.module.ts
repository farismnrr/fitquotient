import { Module } from '@nestjs/common';
import { entitiesRegistry } from '@common/utilities';
import { CommonModule } from '@common/common.module';
import {
  JobGetRepository,
  JobCreateRepository,
  JobUpdateRepository,
  JobSoftDeleteRepository,
} from './repositories';
import {
  JobCreateUsecase,
  JobGetByIdUsecase,
  JobUpdateUsecase,
  JobSoftDeleteUsecase,
} from './usecases';
import {
  JobCreateController,
  JobGetByIdController,
  JobUpdateController,
  JobSoftDeleteController,
} from './controllers';
import { JobEntity } from './entities';

const jobEntities = [JobEntity] as unknown as (new () => unknown)[];
entitiesRegistry.register(jobEntities);

@Module({
  controllers: [
    JobCreateController,
    JobGetByIdController,
    JobUpdateController,
    JobSoftDeleteController,
  ],
  exports: [
    JobGetRepository,
    JobCreateRepository,
    JobUpdateRepository,
    JobSoftDeleteRepository,
    JobCreateUsecase,
    JobGetByIdUsecase,
    JobUpdateUsecase,
    JobSoftDeleteUsecase,
  ],
  imports: [CommonModule],
  providers: [
    JobGetRepository,
    JobCreateRepository,
    JobUpdateRepository,
    JobSoftDeleteRepository,
    JobCreateUsecase,
    JobGetByIdUsecase,
    JobUpdateUsecase,
    JobSoftDeleteUsecase,
  ],
})
export class JobsModule {}
