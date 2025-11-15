import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserAuthResponseDto } from '@users/dtos';
import { jwtUtility, cookieUtility } from '@common/utilities';
import { IUserSessionUsecaseContext } from '@users/context/user-sessions';

@Injectable()
export class UserRefreshTokenUsecase
  implements Partial<IUserSessionUsecaseContext>
{
  userRefreshTokenUsecase(cookieHeader: string): Promise<UserAuthResponseDto> {
    const refreshToken = cookieUtility.extractCookieValue(
      cookieHeader,
      'refreshToken',
    );
    if (!refreshToken) {
      throw new ForbiddenException('Refresh token not found in cookie');
    }

    const decoded = jwtUtility.verify(refreshToken) as {
      sub: string;
      username: string;
    } | null;
    if (!decoded || !decoded.sub) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }

    const newAccessToken = jwtUtility.generate(
      {
        sub: decoded.sub,
        username: decoded.username,
        type: 'access',
      },
      {
        expiresIn: process.env.JWT_EXPIRATION
          ? parseInt(process.env.JWT_EXPIRATION, 10)
          : 3600,
      },
    );

    return Promise.resolve({
      accessToken: newAccessToken,
      refreshToken: refreshToken,
    });
  }
}
