import { ConflictException, Injectable } from '@nestjs/common';
import { UserCreateDto } from '@users/dtos';
import { UserEntity, UserRole, UserStatus } from '@users/entities';
import { UserCreateRepository } from '@users/repositories';
import { UserGetRepository } from '@users/repositories/users/user-get.repository';
import { HashUtility } from '@users/utilities/hash.utility';

@Injectable()
export class UserCreateUsecase {
  constructor(
    private readonly userCreateRepository: UserCreateRepository,
    private readonly UserGetRepository: UserGetRepository,
    private readonly hashUtility: HashUtility,
  ) {}

  async execute(createUserDto: UserCreateDto): Promise<string> {
    // Hash password using HashUtility
    const passwordHash = await this.hashUtility.hashPassword(
      createUserDto.password,
    );

    // Create user entity
    const user = new UserEntity();
    user.fullName = createUserDto.fullName;
    user.username = createUserDto.username;
    user.email = createUserDto.email || '';
    user.phone = createUserDto.phone || '';
    user.passwordHash = passwordHash;
    user.role = createUserDto.role || UserRole.USER;
    user.status = UserStatus.ACTIVE;

    // Check if user already exists
    const isUserExists = await this.UserGetRepository.findByUsernameOrEmail(
      user.username,
      user.email,
    );
    if (isUserExists) {
      throw new ConflictException('User already exists');
    }

    // Save user to repository
    return await this.userCreateRepository.createUser(user);
  }
}
