import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '@users/entities';
import { CreateUserException } from '../repository.error';
import { IUserRepositoryContext } from '@users/context/users/user-repository.context';

@Injectable()
export class UserCreateRepository implements Partial<IUserRepositoryContext> {
  private userRepository: Repository<UserEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(UserEntity);
  }

  async createUser(user: UserEntity): Promise<string> {
    const userQuery = this.userRepository.create(user);
    const result = await this.userRepository.save(userQuery);

    if (!result?.id) {
      throw new CreateUserException();
    }

    return result.id;
  }
}
