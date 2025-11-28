import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserLoginDto, UserAuthResponseDto } from '@users/dtos';
import { UserSessionCreateRepository } from '@users/repositories';
import { UserGetRepository } from '@users/repositories';
import { HashUtility } from '@users/utilities';
import { jwtUtility } from '@common/utilities';
import { UserSessionEntity } from '@users/entities';
import { IUserSessionUsecaseContext } from '@users/context/user-sessions';

@Injectable()
export class UserLoginUsecase implements Partial<IUserSessionUsecaseContext> {
  constructor(
    private readonly userSessionCreateRepository: UserSessionCreateRepository,
    private readonly userGetRepository: UserGetRepository,
    private readonly hashUtility: HashUtility,
  ) {}

  async userLoginUsecase(
    UserLogin: UserLoginDto,
    userAgent: string,
  ): Promise<UserAuthResponseDto> {
    const user = await this.userGetRepository.getUserByUsernameOrEmail(
      UserLogin.username,
      UserLogin.email,
    );
    if (!user) {
      throw new ForbiddenException('username or password is invalid');
    }

    const isValid = await this.hashUtility.verifyPassword(
      UserLogin.password,
      user.passwordHash,
    );

    if (!isValid) {
      throw new ForbiddenException('username or password is invalid');
    }

    const tokenPair = jwtUtility.generateTokenPair({
      sub: user.id,
      username: user.username,
    });

    // User session expiration should follow refresh token lifetime (defaults to 7 days)
    const jwtRefreshExpirationMs = jwtUtility.getDefaultRefreshExpirationMs();
    const userSession = new UserSessionEntity();
    userSession.userId = user.id;
    userSession.refreshToken = tokenPair.refreshToken;
    userSession.userAgent = userAgent;
    userSession.expiresAt = new Date(Date.now() + jwtRefreshExpirationMs);

    await this.userSessionCreateRepository.createUserSession(userSession);

    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }
}
