import {
  Controller,
  Get,
  Param,
  UseFilters,
  UseInterceptors,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LlmListModelsService } from '@llm/services';
import { LlmListModelsResponseDto } from '@llm/dtos';
import { BaseResponseDto } from '@common/dtos';
import { GlobalExceptionFilter } from '@common/filters';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { JwtGuard } from '@common/guards';

@Controller('llms')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class LlmListModelsController {
  constructor(private readonly listModelsService: LlmListModelsService) {}

  @Get(':id/models')
  @HttpCode(HttpStatus.OK)
  async listModels(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<LlmListModelsResponseDto>> {
    const result = await this.listModelsService.execute({ apiKeyId: id });

    return {
      is_success: true,
      message: 'LLM models retrieved successfully',
      data: result,
    };
  }
}
