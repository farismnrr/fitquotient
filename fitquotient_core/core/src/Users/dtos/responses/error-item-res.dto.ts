import { IsNotEmpty, IsString } from 'class-validator';

export class ErrorItemResponseDto {
  @IsString()
  @IsNotEmpty()
  field: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
