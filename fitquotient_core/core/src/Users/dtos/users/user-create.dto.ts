import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  Validate,
  IsOptional,
} from 'class-validator';
import { UserRole } from '@users/entities';
import { PasswordMatchConstraint } from '@users/utilities';

export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  password: string;

  @Validate(PasswordMatchConstraint)
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @IsString()
  @IsOptional()
  role?: UserRole;
}
