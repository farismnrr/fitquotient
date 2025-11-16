import { IsUUID } from 'class-validator';

export class LlmApiKeyGetByIdParamsDto {
  @IsUUID('4')
  apiKeyId: string;
}
