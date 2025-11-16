import { Injectable, NotFoundException } from '@nestjs/common';
import { UserUpdateRepository } from '@users/repositories';
import { UserGetRepository } from '@users/repositories/users/user-get.repository';
import { UserEntity, UserStatus } from '@users/entities';
import { IUserUsecaseContext } from '@users/context/users/user-usecase.context';

@Injectable()
export class UserSoftDeleteUsecase implements Partial<IUserUsecaseContext> {
  constructor(
    private readonly userUpdateRepository: UserUpdateRepository,
    private readonly userGetRepository: UserGetRepository,
  ) {}

  async userSoftDeleteUsecase(userId: string): Promise<void> {
    const existingUser = await this.userGetRepository.getUserById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const user = new UserEntity();
    user.status = UserStatus.INACTIVE || existingUser.status;

    return await this.userUpdateRepository.updateUser(userId, user);
  }
}
