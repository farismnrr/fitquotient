import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ErrorItemResponseDto } from './error-item-res.dto';

export class ErrorValidationResponseDto {
  @IsBoolean()
  readonly is_success: false = false as const;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ErrorItemResponseDto)
  details: ErrorItemResponseDto[];
}
