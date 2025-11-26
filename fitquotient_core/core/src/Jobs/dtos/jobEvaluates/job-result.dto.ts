import { IsUUID, IsString, IsObject } from 'class-validator';

export class JobComparisonResultDto {
  @IsUUID()
  comparisonId: string;

  @IsString()
  status: string;

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
