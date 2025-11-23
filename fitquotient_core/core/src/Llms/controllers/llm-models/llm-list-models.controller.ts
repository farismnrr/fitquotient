import { Controller, Get, Param } from '@nestjs/common';
import { LlmListModelsService } from '@llm/services';
import { LlmListModelsResponseDto } from '@llm/dtos';

@Controller('llms')
export class LlmListModelsController {
  constructor(private readonly listModelsService: LlmListModelsService) {}

  @Get(':id/models')
  async listModels(@Param('id') id: string): Promise<LlmListModelsResponseDto> {
    return this.listModelsService.execute({ apiKeyId: id });
  }
}
