import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CvVectorCreateDataDto {
  @IsString()
  cvId: string;
}

export class CvVectorApiResponseDto {
  @IsBoolean()
  is_success: boolean;

  @IsString()
  message: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CvVectorCreateDataDto)
  data?: CvVectorCreateDataDto;
}
