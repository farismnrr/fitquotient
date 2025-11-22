import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class JobVectorCreateDataDto {
  @IsString()
  jobId: string;
}

export class JobVectorApiResponseDto {
  @IsBoolean()
  is_success: boolean;

  @IsString()
  message: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => JobVectorCreateDataDto)
  data?: JobVectorCreateDataDto;
}
