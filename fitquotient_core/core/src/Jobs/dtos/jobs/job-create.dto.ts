import { IsString, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { JobTextLengthConstraint } from './validators/job-text-length.validator';

export class JobCreateDto {
  @IsString()
  @IsNotEmpty()
  @Validate(JobTextLengthConstraint)
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
