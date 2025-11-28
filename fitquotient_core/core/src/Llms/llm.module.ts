import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { entitiesRegistry } from '@common/utilities';
import { LlmApiKeyEntity, LlmMatchRateEntity } from './entities';
import {
  LlmApiKeyCreateRepository,
  LlmApiKeyGetRepository,
  LlmApiKeyDeleteRepository,
} from './repositories/llm-api-keys';
import {
  LlmApiKeyCreateUsecase,
  LlmApiKeyDeleteUsecase,
  LlmApiKeyGetAllUsecase,
} from './usecases/llm-api-keys';
import { LlmListModelsService } from './services/llm-list-models.service';
import {
  LlmApiKeyCreateController,
  LlmApiKeyDeleteController,
  LlmApiKeyGetController,
} from './controllers/llm-api-keys';
import { LlmListModelsController } from './controllers/llm-models/llm-list-models.controller';

// Register entities
entitiesRegistry.register([LlmApiKeyEntity, LlmMatchRateEntity]);

@Module({
  imports: [CommonModule],
  providers: [
    LlmApiKeyCreateRepository,
    LlmApiKeyGetRepository,
    LlmApiKeyDeleteRepository,
    LlmApiKeyCreateUsecase,
    LlmApiKeyDeleteUsecase,
    LlmApiKeyGetAllUsecase,
    LlmListModelsService,
  ],
  exports: [
    LlmApiKeyCreateRepository,
    LlmApiKeyGetRepository,
    LlmApiKeyDeleteRepository,
    LlmApiKeyCreateUsecase,
    LlmApiKeyDeleteUsecase,
    LlmApiKeyGetAllUsecase,
    LlmListModelsService,
  ],
  controllers: [
    LlmApiKeyCreateController,
    LlmApiKeyDeleteController,
    LlmApiKeyGetController,
    LlmListModelsController,
  ],
})
export class LlmModule {}
