import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import type { RedisClientType } from 'redis';
import { UserEntity } from '@users/entities';
import { UpdateUserException } from '@users/repositories/repository.error';

@Injectable()
export class UserUpdateRepository {
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

    // Merge data and save
    const updatedUser = this.userRepository.merge(existingUser, data);
    await this.userRepository.save(updatedUser);

    // Invalidate cache
    if (this.redisConnection) {
      const cacheKey = `user:${id}`;
      await this.redisConnection.del(cacheKey);
    }
  }
}
