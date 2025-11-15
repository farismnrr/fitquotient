import { UserSessionEntity } from '../../entities/user-session.entity';

export interface IUserSessionRepositoryContext {
  createUserSession(userSession: UserSessionEntity): Promise<void>;
  getUserSessionByUserId(userId: string): Promise<UserSessionEntity | null>;
  updateUserSessionByUserId(
    userId: string,
    data: Partial<UserSessionEntity>,
  ): Promise<void>;
}
