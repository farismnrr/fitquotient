import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';

@ValidatorConstraint({ name: 'UsernameOrEmailRequired', async: false })
export class UsernameOrEmailRequired implements ValidatorConstraintInterface {
  validate(_value: unknown, args: ValidationArguments) {
    const obj = args.object as Record<string, unknown>;
    const username = obj['username'];
    const email = obj['email'];
    return Boolean(username || email);
  }

  defaultMessage() {
    return 'Either username or email must be provided';
  }
}

export class UserLoginDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @Validate(UsernameOrEmailRequired)
  checkUsernameOrEmail: boolean;
}
