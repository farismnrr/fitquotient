import {
  Controller,
  UseFilters,
  UseInterceptors,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtGuard } from '@common/guards';
import { GlobalExceptionFilter } from '@common/filters';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { LlmApiKeyGetAllUsecase } from '@llm/usecases';
import { BaseResponseDto } from '@common/dtos';
import { LlmApiKeyEntity } from '@llm/entities';

@Controller('llms')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class LlmApiKeyGetController {
  constructor(
    private readonly llmApiKeyGetAllUsecase: LlmApiKeyGetAllUsecase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(): Promise<
    BaseResponseDto<{ api_keys: Partial<LlmApiKeyEntity>[] }>
  > {
    const keys = await this.llmApiKeyGetAllUsecase.execute();

    // For security reasons, never return the secret value
    const sanitized = keys.map((k) => ({
      id: k.id,
      name: k.name,
      provider: k.provider,
      createdAt: k.createdAt,
      updatedAt: k.updatedAt,
    }));

    return {
      is_success: true,
      message: 'LLM API keys retrieved successfully',
      data: { api_keys: sanitized },
    };
  }
}
