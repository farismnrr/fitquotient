import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

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

}
