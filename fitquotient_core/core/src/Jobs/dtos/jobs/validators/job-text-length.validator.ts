import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { JobCreateDto } from '../job-create.dto';

@ValidatorConstraint({ name: 'JobTextLength', async: false })
export class JobTextLengthConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const dto = args.object as JobCreateDto;
    
    // Combine all text fields
    const text = `${dto.title || ''} ${dto.description || ''} ${dto.requirements || ''} ${typeof dto.details === 'string' ? dto.details : ''}`.trim();
    
    // CV Assessor API requires minimum 10 characters
    return text.length >= 10;
  }

  defaultMessage(): string {
    return 'Combined job information (title, description, requirements) must be at least 10 characters. Please provide more details.';
  }
}
