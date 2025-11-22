import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class JobVectorEvaluateDataDto {
  @IsString()
  id: string;

  @IsString()
  status: string;
}

export class JobVectorEvaluateApiResponseDto {
  @IsBoolean()
  is_success: boolean;

  @IsString()
  message: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => JobVectorEvaluateDataDto)
  data?: JobVectorEvaluateDataDto;
}
