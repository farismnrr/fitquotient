import { UserCvEntity } from '@users/entities';

export interface IUserCvRepositoryContext {
  createUserCv(userCv: UserCvEntity): Promise<string>;
  getUserCvById(cvId: string): Promise<UserCvEntity | null>;
  softDeleteUserCv(cvId: string): Promise<void>;
}
