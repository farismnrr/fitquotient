import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { UserRole, UserStatus } from '@users/entities';

export class UserGetDto {
  @IsString()
  id: string;

  @IsString()
  fullName: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsEnum(UserStatus)
  status: UserStatus;

  @IsString()
  organization: string;
}
