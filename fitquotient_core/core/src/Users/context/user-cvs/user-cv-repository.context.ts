import { UserCvEntity } from '../../entities/user-cv.entity';

export interface IUserCvRepositoryContext {
  createUserCv(userCv: UserCvEntity): Promise<string>;
  getUserCvById(cvId: string): Promise<UserCvEntity | null>;
  softDeleteUserCv(cvId: string): Promise<boolean>;
}
