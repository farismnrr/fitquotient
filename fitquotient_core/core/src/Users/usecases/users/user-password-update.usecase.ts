import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserUpdateRepository } from '@users/repositories';
import { UserGetRepository } from '@users/repositories/users/user-get.repository';
import { UserPasswordUpdateDto } from '@users/dtos/users/user-update.dto';
import { UserEntity } from '@users/entities';
import { HashUtility } from '@users/utilities';
import { IUserUsecaseContext } from '@users/context/users/user-usecase.context';

@Injectable()
export class UserPasswordUpdateUsecase implements Partial<IUserUsecaseContext> {
  constructor(
    private readonly userUpdateRepository: UserUpdateRepository,
    private readonly userGetRepository: UserGetRepository,
    private readonly hashUtility: HashUtility,
  ) {}

  async userPasswordUpdateUsecase(
    userId: string,
    updateUserDto: UserPasswordUpdateDto,
  ): Promise<void> {
    // Always get fresh data from database (bypass cache) for password operations
    const existingUser = await this.userGetRepository.getUserById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const isValid = await this.hashUtility.verifyPassword(
      updateUserDto.oldPassword,
      existingUser.passwordHash,
    );

    if (!isValid) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const hashedPassword = await this.hashUtility.hashPassword(
      updateUserDto.password,
    );

    const user = new UserEntity();
    user.passwordHash = hashedPassword;

    return await this.userUpdateRepository.updateUser(userId, user);
  }
}
