import { UserLoginDto, UserAuthResponseDto } from '@users/dtos';

export interface IUserSessionUsecaseContext {
  userLoginUsecase?: (
    userLogin: UserLoginDto,
    userAgent: string,
  ) => Promise<UserAuthResponseDto>;
  userLogoutUsecase?: (userId: string) => Promise<void>;
  userRefreshTokenUsecase?: (
    refreshToken: string,
  ) => Promise<UserAuthResponseDto>;
}
