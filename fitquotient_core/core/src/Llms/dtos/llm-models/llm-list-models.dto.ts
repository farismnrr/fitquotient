import { IsString, IsNotEmpty } from 'class-validator';

export class LlmListModelsRequestDto {
  @IsString()
  @IsNotEmpty()
  apiKeyId: string;
}

export class LlmListModelsResponseDto {
  models: string[];
}
