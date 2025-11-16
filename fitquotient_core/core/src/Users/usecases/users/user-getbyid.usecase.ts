import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserUsecaseContext } from '@users/context/users/user-usecase.context';
import { UserGetDto } from '@users/dtos';
import { UserGetRepository } from '@users/repositories';

@Injectable()
export class UserGetByIdUsecase implements Partial<IUserUsecaseContext> {
  constructor(private readonly userGetRepository: UserGetRepository) {}

  async userGetByIdUsecase(userId: string): Promise<UserGetDto> {
    const user = await this.userGetRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Map entity to DTO
    const userDto: UserGetDto = {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phone: user.phone || undefined,
      role: user.role,
      status: user.status,
      organization: user.organization,
    };

    return userDto;
  }
}
