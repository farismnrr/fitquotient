import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateJobComparisonDto {
  @IsString()
  cvId: string;

  @IsString()
  jobId: string;
}

export class UpdateJobComparisonDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsObject()
  result?: unknown;

  @IsOptional()
  @IsString()
  errorMessage?: string;
}
