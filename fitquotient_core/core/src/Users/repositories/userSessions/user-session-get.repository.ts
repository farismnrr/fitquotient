import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import type { RedisClientType } from 'redis';
import { UserSessionEntity } from '@users/entities';
import { IUserSessionRepositoryContext } from '@users/context/user-sessions';

@Injectable()
export class UserSessionGetRepository
  implements Partial<IUserSessionRepositoryContext>
{
  private userSessionRepository: Repository<UserSessionEntity>;

  constructor(
    private readonly dataSource: DataSource,
    @Inject('REDIS_CLIENT')
    private readonly redisConnection: RedisClientType | null,
  ) {
    this.userSessionRepository =
      this.dataSource.getRepository(UserSessionEntity);
  }

  async getUserSessionByUserId(
    userId: string,
  ): Promise<UserSessionEntity | null> {
    if (!this.redisConnection) {
      const userSession = await this.userSessionRepository.findOne({
        where: { userId },
      });
      return userSession || null;
    }

    const cacheKey = `user-session:${userId}`;
    const cached = await this.redisConnection.get(cacheKey);

    if (cached) {
      return JSON.parse(cached) as UserSessionEntity;
    }

    const userSession = await this.userSessionRepository.findOne({
      where: { userId },
    });
    if (!userSession) {
      return null;
    }

    await this.redisConnection.setEx(cacheKey, 60, JSON.stringify(userSession));
    return userSession;
  }
}
