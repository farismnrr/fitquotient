import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { LlmProvider } from 'src/Llms/entities';

export class LlmApiKeyCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(LlmProvider)
  provider: LlmProvider;

  @IsString()
  @IsNotEmpty()
  secret: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  isActive?: boolean;
}
