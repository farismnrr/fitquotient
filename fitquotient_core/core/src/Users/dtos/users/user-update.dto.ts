import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { UserRole, UserStatus } from '@users/entities';
import { PasswordMatchConstraint } from '@users/utilities';

export class UserUpdateDto {
  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsEmail()
  @IsOptional()
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
  @IsOptional()
  confirmPassword: string;

  @IsString()
  @IsOptional()
  role?: UserRole;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
}

export class UserPasswordUpdateDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  password: string;

  @Validate(PasswordMatchConstraint)
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
