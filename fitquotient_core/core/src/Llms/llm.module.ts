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
} from './usecases/llm-api-keys';
import { LlmListModelsService } from './services/llm-list-models.service';
import {
  LlmApiKeyCreateController,
  LlmApiKeyDeleteController,
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
    LlmListModelsService,
  ],
  exports: [
    LlmApiKeyCreateRepository,
    LlmApiKeyGetRepository,
    LlmApiKeyDeleteRepository,
    LlmApiKeyCreateUsecase,
    LlmApiKeyDeleteUsecase,
    LlmListModelsService,
  ],
  controllers: [
    LlmApiKeyCreateController,
    LlmApiKeyDeleteController,
    LlmListModelsController,
  ],
})
export class LlmModule {}
