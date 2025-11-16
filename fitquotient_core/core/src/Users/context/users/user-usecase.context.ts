import { UserCreateDto, UserGetDto, UserPasswordUpdateDto } from '@users/dtos';

export interface IUserUsecaseContext {
  userCreateUsecase?: (createUserDto: UserCreateDto) => Promise<string>;
  userGetByIdUsecase?: (userId: string) => Promise<UserGetDto>;
  userPasswordUpdateUsecase?: (
    userId: string,
    data: UserPasswordUpdateDto,
  ) => Promise<void>;
  userSoftDeleteUsecase?: (userId: string) => Promise<void>;
}
