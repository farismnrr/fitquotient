import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { LlmApiKeyCreateUsecase } from '@llm/usecases';
import { LlmApiKeyCreateDto } from '@llm/dtos';
import { BaseResponseDto } from '@common/dtos';
import { GlobalExceptionFilter } from '@common/filters';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { JwtGuard } from '@common/guards';

@Controller('llms')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class LlmApiKeyCreateController {
  constructor(
    private readonly llmApiKeyCreateUsecase: LlmApiKeyCreateUsecase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async create(
    @Body() dto: LlmApiKeyCreateDto,
  ): Promise<BaseResponseDto<{ api_key_id: string }>> {
    const apiKeyId = await this.llmApiKeyCreateUsecase.execute(dto);

    return {
      is_success: true,
      message: 'LLM API Key created successfully',
      data: { api_key_id: apiKeyId },
    };
  }
}
