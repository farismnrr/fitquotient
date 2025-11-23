import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import axios from 'axios';
import { LlmApiKeyGetRepository } from '@llm/repositories/llm-api-keys';
import { LlmProvider } from '@llm/entities';
import { encryptionUtility } from '@common/utilities';
import { LlmListModelsRequestDto, LlmListModelsResponseDto } from '@llm/dtos';

interface OpenAiResponse {
  data: { id: string }[];
}

interface GoogleResponse {
  models: { name: string }[];
}

interface AnthropicResponse {
  data: { id: string }[];
}

/**
 * Service to list available models from LLM providers.
 * - Fetches models dynamically from OpenAI, Google, and Anthropic APIs.
 * - Requires a valid API Key stored in the database.
 */
@Injectable()
export class LlmListModelsService {
  constructor(private readonly apiKeyGetRepository: LlmApiKeyGetRepository) {}

  /**
   * Execute the model listing process.
   * @param dto Request DTO containing the API Key ID.
   * @returns List of model names.
   */
  async execute(
    dto: LlmListModelsRequestDto,
  ): Promise<LlmListModelsResponseDto> {
    const apiKeyEntity = await this.apiKeyGetRepository.getById(dto.apiKeyId);

    if (!apiKeyEntity) {
      throw new NotFoundException('API Key not found');
    }

    const secretKey = encryptionUtility.decrypt(apiKeyEntity.secret);
    let models: string[] = [];

    switch (apiKeyEntity.provider) {
      case LlmProvider.OPENAI:
        models = await this.getOpenAIModels(secretKey);
        break;
      case LlmProvider.GOOGLE:
        models = await this.getGoogleModels(secretKey);
        break;
      case LlmProvider.ANTHROPIC:
        models = await this.getAnthropicModels(secretKey);
        break;
      default:
        throw new BadRequestException('Unsupported provider');
    }

    return { models };
  }

  private async getOpenAIModels(apiKey: string): Promise<string[]> {
    try {
      const response = await axios.get<OpenAiResponse>(
        'https://api.openai.com/v1/models',
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          timeout: 10_000,
        },
      );
      return response.data.data.map((model) => model.id);
    } catch {
      throw new BadRequestException('Failed to fetch OpenAI models');
    }
  }

  private async getGoogleModels(apiKey: string): Promise<string[]> {
    try {
      const response = await axios.get<GoogleResponse>(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
        { timeout: 10_000 },
      );
      return response.data.models.map((model) =>
        model.name.replace('models/', ''),
      );
    } catch {
      throw new BadRequestException('Failed to fetch Google models');
    }
  }

  private async getAnthropicModels(apiKey: string): Promise<string[]> {
    try {
      const response = await axios.get<AnthropicResponse>(
        'https://api.anthropic.com/v1/models',
        {
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          timeout: 10_000,
        },
      );
      return response.data.data.map((model) => model.id);
    } catch {
      throw new BadRequestException('Failed to fetch Anthropic models');
    }
  }
}
