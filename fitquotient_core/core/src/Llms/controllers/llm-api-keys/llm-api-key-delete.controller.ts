import {
  Controller,
  UseFilters,
  UseInterceptors,
  UseGuards,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtGuard } from '@common/guards';
import { GlobalExceptionFilter } from '@common/filters';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { LlmApiKeyDeleteUsecase } from '@llm/usecases';
import { BaseResponseDto } from '@common/dtos';
import { LlmApiKeyGetByIdParamsDto } from '@llm/dtos';

@Controller('llms')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class LlmApiKeyDeleteController {
  constructor(
    private readonly llmApiKeyDeleteUsecase: LlmApiKeyDeleteUsecase,
  ) {}

  @Delete(':apiKeyId')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param() params: LlmApiKeyGetByIdParamsDto,
  ): Promise<BaseResponseDto<void>> {
    await this.llmApiKeyDeleteUsecase.execute(params.apiKeyId);

    return {
      isSuccess: true,
      message: 'LLM API key deleted successfully',
    };
  }
}
