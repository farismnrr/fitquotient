import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsBoolean,
} from 'class-validator';

export class UserCvResponseDto {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  filename?: string;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsNumber()
  size?: number | null;

  @IsOptional()
  @IsString()
  storageProvider?: string;

  @IsBoolean()
  isActive: boolean;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
