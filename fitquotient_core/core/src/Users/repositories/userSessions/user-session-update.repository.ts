import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import type { RedisClientType } from 'redis';
import { UserSessionEntity } from '@users/entities';
import { UpdateUserException } from '@users/repositories/repository.error';

@Injectable()
export class UserSessionUpdateRepository {
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

    // Merge data and save
    const updatedUser = this.userSessionRepository.merge(existingUser, data);
    await this.userSessionRepository.save(updatedUser);

    // Invalidate cache
    if (this.redisConnection) {
      const cacheKey = `user-session:${userId}`;
      await this.redisConnection.del(cacheKey);
    }
  }
}
