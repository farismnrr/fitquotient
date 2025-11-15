import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserSessionEntity } from '@users/entities';
import { CreateUserException } from '../repository.error';

@Injectable()
export class UserSessionCreateRepository {
  private userSessionRepository: Repository<UserSessionEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.userSessionRepository =
      this.dataSource.getRepository(UserSessionEntity);
  }

  async createUserSession(userSession: UserSessionEntity): Promise<void> {
    const userSessionQuery = this.userSessionRepository.create(userSession);
    const result = await this.userSessionRepository.save(userSessionQuery);

    if (!result?.id) {
      throw new CreateUserException();
    }
  }
}
