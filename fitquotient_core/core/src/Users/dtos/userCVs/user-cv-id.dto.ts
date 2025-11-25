import { IsUUID } from 'class-validator';

export class UserCvGetByIdParamsDto {
  @IsUUID('4')
  cvId: string;
}
