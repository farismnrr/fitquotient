import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

interface PasswordMatchArgs {
  password?: string;
}

@ValidatorConstraint({ name: 'passwordMatch', async: false })
export class PasswordMatchConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments): boolean {
    const { password } = args.object as PasswordMatchArgs;
    return password === confirmPassword;
  }

  defaultMessage(): string {
    return 'Password and confirm password do not match';
  }
}
