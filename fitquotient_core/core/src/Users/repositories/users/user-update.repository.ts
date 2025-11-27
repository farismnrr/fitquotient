import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import type { RedisClientType } from 'redis';
import { UserEntity } from '@users/entities';
import { UpdateUserException } from '@users/repositories/repository.error';
import { IUserRepositoryContext } from '@users/context/users/user-repository.context';

@Injectable()
export class UserUpdateRepository implements Partial<IUserRepositoryContext> {
  private userRepository: Repository<UserEntity>;

  constructor(
    private readonly dataSource: DataSource,
    @Inject('REDIS_CLIENT')
    private readonly redisConnection: RedisClientType | null,
  ) {
    this.userRepository = this.dataSource.getRepository(UserEntity);
  }

  async updateUser(id: string, data: Partial<UserEntity>): Promise<void> {
    // Get existing user first
    const existingUser = await this.userRepository.findOne({
      where: { id },
    });

    if (!existingUser) {
      throw new UpdateUserException();
    }

    // Update the user object using repository.update to prevent cascades and nested saves
    await this.userRepository.update(
      id,
      data as QueryDeepPartialEntity<UserEntity>,
    );

    // Invalidate cache
    if (this.redisConnection) {
      const cacheKey = `user:${id}`;
      await this.redisConnection.del(cacheKey);
    }
  }
}
