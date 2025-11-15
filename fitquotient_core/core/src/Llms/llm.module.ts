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
import {
  LlmApiKeyCreateController,
  LlmApiKeyDeleteController,
} from './controllers/llm-api-keys';

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
  ],
  exports: [
    LlmApiKeyCreateRepository,
    LlmApiKeyGetRepository,
    LlmApiKeyDeleteRepository,
  ],
  controllers: [LlmApiKeyCreateController, LlmApiKeyDeleteController],
})
export class LlmModule {}
