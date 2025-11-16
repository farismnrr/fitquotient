import { IsString, IsOptional, IsUUID, IsBoolean } from 'class-validator';

export class JobUpdateDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  requirements?: string;

  @IsOptional()
  details?: unknown;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsUUID()
  @IsOptional()
  apiKeyId?: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  @IsOptional()
  userCvId?: string;
}
