import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class JobCreateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  requirements?: string;

  @IsOptional()
  details?: unknown;

  @IsUUID()
  @IsNotEmpty()
  apiKeyId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsOptional()
  userCvId?: string;
}
