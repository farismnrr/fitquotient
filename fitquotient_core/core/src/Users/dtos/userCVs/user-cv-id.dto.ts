import { IsUUID } from 'class-validator';

export class UserCvGetByIdParamsDto {
  @IsUUID('4')
  userId: string;

  @IsUUID('4')
  cvId: string;
}
