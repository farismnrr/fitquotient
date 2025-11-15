import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserSessionEntity } from '@users/entities';
import { UserSessionUpdateRepository } from '@users/repositories';
import { UserGetRepository } from '@users/repositories';
import { UserSessionGetRepository } from '@users/repositories';
import { IUserSessionUsecaseContext } from '@users/context/user-sessions';

@Injectable()
export class UserLogoutUsecase implements Partial<IUserSessionUsecaseContext> {
  constructor(
    private readonly userSessionUpdateRepository: UserSessionUpdateRepository,
    private readonly userGetRepository: UserGetRepository,
    private readonly userSessionGetRepository: UserSessionGetRepository,
  ) {}

  async userLogoutUsecase(userId: string): Promise<void> {
    const existingUser = await this.userGetRepository.getUserById(userId);
    if (!existingUser) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    const existingUserSession =
      await this.userSessionGetRepository.getUserSessionByUserId(userId);
    if (!existingUserSession) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    const userSession = new UserSessionEntity();
    userSession.userId = userId;
    userSession.revokedAt = new Date();
    userSession.refreshToken = '';

    await this.userSessionUpdateRepository.updateUserSessionByUserId(
      userId,
      userSession,
    );
  }
}
