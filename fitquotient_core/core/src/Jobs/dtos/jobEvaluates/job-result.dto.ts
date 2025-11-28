import { IsUUID, IsString, IsObject, IsOptional } from 'class-validator';

export class JobComparisonResultDto {
  @IsUUID()
  comparisonId: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  cvName?: string | null;

  @IsOptional()
  @IsString()
  jobTitle?: string | null;

  @IsObject()
  result: {
    matchPercentage: number;
    matchedSkills: string[];
    missingSkills: string[];
    summary: string;
    recommendations: string;
  };
}

export class JobResultQueryParamsDto {
  @IsUUID()
  comparisonId: string;
}
