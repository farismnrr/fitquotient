import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import type { RedisClientType } from 'redis';
import { UserEntity, UserStatus } from '@users/entities';
import { IUserRepositoryContext } from '@users/context/users/user-repository.context';

@Injectable()
export class UserGetRepository implements Partial<IUserRepositoryContext> {
  private userRepository: Repository<UserEntity>;

  constructor(
    private readonly dataSource: DataSource,
    @Inject('REDIS_CLIENT')
    private readonly redisConnection: RedisClientType | null,
  ) {
    this.userRepository = this.dataSource.getRepository(UserEntity);
  }

  async getUserById(id: string): Promise<UserEntity | null> {
    if (!this.redisConnection) {
      const user = await this.userRepository.findOne({
        where: { id, status: UserStatus.ACTIVE },
      });
      return user || null;
    }

    const cacheKey = `user:${id}`;
    const cached = await this.redisConnection.get(cacheKey);

    if (cached) {
      return JSON.parse(cached) as UserEntity;
    }

    const user = await this.userRepository.findOne({
      where: { id, status: UserStatus.ACTIVE },
    });
    if (!user) {
      return null;
    }

    await this.redisConnection.setEx(cacheKey, 60, JSON.stringify(user));
    return user;
  }

  async getUserByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<UserEntity | null> {
    let query = this.userRepository
      .createQueryBuilder('user')
      .where('user.status = :status', { status: UserStatus.ACTIVE });

    if (username) {
      query = query.andWhere('user.username = :username', { username });
    }

    if (email && email !== 'undefined') {
      query = query.orWhere('(user.status = :status AND user.email = :email)', {
        status: UserStatus.ACTIVE,
        email,
      });
    }

    return await query.getOne();
  }

  async findByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<boolean> {
    return await this.userRepository.exists({
      where: [
        { username, status: UserStatus.ACTIVE },
        { email, status: UserStatus.ACTIVE },
      ],
    });
  }
}
