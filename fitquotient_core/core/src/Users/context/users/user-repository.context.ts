import { UserEntity } from '../../entities/user.entity';

export interface IUserRepositoryContext {
  createUser(user: UserEntity): Promise<string>;
  getUserById(id: string): Promise<UserEntity | null>;
  getUserByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<UserEntity | null>;
  findByUsernameOrEmail(username: string, email: string): Promise<boolean>;
  updateUser(id: string, data: Partial<UserEntity>): Promise<void>;
}
