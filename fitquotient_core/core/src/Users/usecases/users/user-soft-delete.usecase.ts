import { Injectable, NotFoundException } from '@nestjs/common';
import { UserUpdateRepository } from '@users/repositories';
import { UserGetRepository } from '@users/repositories/users/user-get.repository';
import { UserEntity, UserStatus } from '@users/entities';

@Injectable()
export class UserSoftDeleteUsecase {
  constructor(
    private readonly userUpdateRepository: UserUpdateRepository,
    private readonly userGetRepository: UserGetRepository,
  ) {}
  async execute(userId: string): Promise<void> {
    const existingUser = await this.userGetRepository.getUserById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const user = new UserEntity();
    user.status = UserStatus.INACTIVE || existingUser.status;

    return await this.userUpdateRepository.updateUser(userId, user);
  }
}
