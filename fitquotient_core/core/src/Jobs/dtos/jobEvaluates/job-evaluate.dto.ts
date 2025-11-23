import { IsUUID, IsString, IsEnum } from 'class-validator';
import { LlmProvider } from '@llm/entities';

export class JobEvaluateDto {
  @IsUUID()
  jobId: string;

  @IsUUID()
  apiKeyId: string;

  @IsUUID()
  userCvId: string;

  @IsUUID()
  userId: string;

  @IsString()
  model: string;

  @IsEnum(LlmProvider)
  provider: LlmProvider;
}
