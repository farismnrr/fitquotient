import { Module } from '@nestjs/common';
import { entitiesRegistry } from '@common/utilities';
import { CommonModule } from '@common/common.module';
import { LlmModule } from '@llm/llm.module';
import { UsersModule } from '@users/users.module';
import {
  JobGetRepository,
  JobCreateRepository,
  JobUpdateRepository,
  JobSoftDeleteRepository,
} from './repositories';
import { JobVectorCreateService } from './services/job-vector-create.service';
import { JobVectorEvaluateService } from './services/job-vector-evaluate.service';
import { JobVectorResultService } from './services/job-vector-result.service';
import {
  JobCreateUsecase,
  JobGetByIdUsecase,
  JobGetAllUsecase,
  JobUpdateUsecase,
  JobSoftDeleteUsecase,
  JobEvaluateUsecase,
  JobResultUsecase,
} from './usecases';
import {
  JobCreateController,
  JobGetByIdController,
  JobGetAllController,
  JobUpdateController,
  JobSoftDeleteController,
  JobEvaluateController,
  JobResultController,
} from './controllers';
import { JobEntity } from './entities';

const jobEntities = [JobEntity] as unknown as (new () => unknown)[];
entitiesRegistry.register(jobEntities);

@Module({
  controllers: [
    JobCreateController,
    JobGetByIdController,
    JobGetAllController,
    JobUpdateController,
    JobSoftDeleteController,
    JobEvaluateController,
    JobResultController,
  ],
  exports: [
    JobGetRepository,
    JobCreateRepository,
    JobUpdateRepository,
    JobSoftDeleteRepository,
    JobCreateUsecase,
    JobGetByIdUsecase,
    JobGetAllUsecase,
    JobUpdateUsecase,
    JobSoftDeleteUsecase,
    JobEvaluateUsecase,
    JobResultUsecase,
    JobVectorCreateService,
    JobVectorEvaluateService,
    JobVectorResultService,
    JobEvaluateUsecase,
    JobResultUsecase,
  ],
  imports: [CommonModule, UsersModule, LlmModule],
  providers: [
    JobGetRepository,
    JobCreateRepository,
    JobUpdateRepository,
    JobSoftDeleteRepository,
    JobCreateUsecase,
    JobGetByIdUsecase,
    JobGetAllUsecase,
    JobUpdateUsecase,
    JobSoftDeleteUsecase,
    JobEvaluateUsecase,
    JobResultUsecase,
    JobVectorCreateService,
    JobVectorEvaluateService,
    JobVectorResultService,
    JobEvaluateUsecase,
    JobResultUsecase,
  ],
})
export class JobsModule {}
