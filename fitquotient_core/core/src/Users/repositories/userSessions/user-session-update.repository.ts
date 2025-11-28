import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import type { RedisClientType } from 'redis';
import { UserSessionEntity } from '@users/entities';
import { UpdateUserException } from '@users/repositories/repository.error';
import { IUserSessionRepositoryContext } from '@users/context/user-sessions';

@Injectable()
export class UserSessionUpdateRepository
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

  async updateUserSessionByUserId(
    userId: string,
    data: Partial<UserSessionEntity>,
  ): Promise<void> {
    // Get existing user first
    const existingUser = await this.userSessionRepository.findOne({
      where: { userId },
    });

    if (!existingUser) {
      throw new UpdateUserException();
    }

    // Update the session using direct update to avoid cascades
    await this.userSessionRepository.update(
      { userId },
      data as QueryDeepPartialEntity<UserSessionEntity>,
    );

    // Invalidate cache
    if (this.redisConnection) {
      const cacheKey = `user-session:${userId}`;
      await this.redisConnection.del(cacheKey);
    }
  }
}
