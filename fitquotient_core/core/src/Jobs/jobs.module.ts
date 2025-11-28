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
import {
  JobComparisonCreateRepository,
  JobComparisonGetRepository,
  JobComparisonUpdateRepository,
  JobComparisonSoftDeleteRepository,
} from './repositories/jobComparisons';
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
  CreateJobComparisonUsecase,
  GetJobComparisonUsecase,
  UpdateJobComparisonUsecase,
  JobComparisonSoftDeleteUsecase,
  GetAllJobComparisonsUsecase,
} from './usecases';
import {
  JobCreateController,
  JobGetByIdController,
  JobGetAllController,
  JobUpdateController,
  JobSoftDeleteController,
  JobEvaluateController,
  JobResultController,
  JobComparisonCreateController,
  JobComparisonGetController,
  JobComparisonUpdateController,
  JobComparisonSoftDeleteController,
  JobComparisonGetAllController,
} from './controllers';
import { JobEntity, JobComparisonEntity } from './entities';
const jobEntities = [
  JobEntity,
  JobComparisonEntity,
] as unknown as (new () => unknown)[];
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
    JobComparisonCreateController,
    JobComparisonGetController,
    JobComparisonUpdateController,
    JobComparisonSoftDeleteController,
    JobComparisonGetAllController,
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
    CreateJobComparisonUsecase,
    GetJobComparisonUsecase,
    UpdateJobComparisonUsecase,
    JobComparisonSoftDeleteUsecase,
    GetAllJobComparisonsUsecase,
    JobVectorCreateService,
    JobVectorEvaluateService,
    JobVectorResultService,
    // removed duplicate GetAllJobComparisonsUsecase
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
    CreateJobComparisonUsecase,
    GetJobComparisonUsecase,
    UpdateJobComparisonUsecase,
    JobComparisonSoftDeleteUsecase,
    GetAllJobComparisonsUsecase,
    JobVectorCreateService,
    JobVectorEvaluateService,
    JobVectorResultService,
    JobComparisonCreateRepository,
    JobComparisonGetRepository,
    JobComparisonUpdateRepository,
    JobComparisonSoftDeleteRepository,
  ],
})
export class JobsModule {}
