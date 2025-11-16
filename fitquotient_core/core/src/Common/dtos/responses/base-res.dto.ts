import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BaseResponseDto<T = any> {
  @IsBoolean()
  isSuccess: boolean;

  @IsString()
  message: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  data?: T;
}
