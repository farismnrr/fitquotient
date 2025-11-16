import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class JobGetDto {
  @IsUUID()
  id: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  details?: unknown;

  @IsBoolean()
  isActive: boolean;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;

  @IsUUID()
  apiKeyId: string;

  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  userCvId?: string;
}
