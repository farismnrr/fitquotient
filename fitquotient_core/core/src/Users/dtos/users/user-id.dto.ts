import { IsUUID } from 'class-validator';

export class UserGetByIdParamsDto {
  @IsUUID('4')
  userId: string;
}
