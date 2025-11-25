import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class UserCvCreateDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsString()
  @IsOptional()
  filename?: string;

  @IsString()
  @IsOptional()
  mimeType?: string;

  @IsOptional()
  size?: number;

  @IsString()
  @IsOptional()
  storageProvider?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
