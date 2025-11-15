import { Module } from '@nestjs/common';
import { entitiesRegistry } from '@common/utilities';
import { CommonModule } from '@common/common.module';
import {
  UserGetRepository,
  UserCreateRepository,
  UserUpdateRepository,
  UserSessionGetRepository,
  UserSessionCreateRepository,
  UserSessionUpdateRepository,
} from './repositories';
import {
  UserCreateUsecase,
  UserGetByIdUsecase,
  UserPasswordUpdateUsecase,
  UserSoftDeleteUsecase,
  UserLoginUsecase,
  UserLogoutUsecase,
  UserRefreshTokenUsecase,
} from './usecases';
import {
  UserCreateController,
  UserGetByIdController,
  UserUpdateController,
  UserSoftDeleteController,
  UserLoginController,
  UserLogoutController,
  UserRefreshTokenController,
} from './controllers';
import { HashUtility } from './utilities';
import { UserEntity, UserProfileEntity, UserSessionEntity } from './entities';

// Register entities
entitiesRegistry.register([UserEntity, UserProfileEntity, UserSessionEntity]);

@Module({
  controllers: [
    UserCreateController,
    UserGetByIdController,
    UserUpdateController,
    UserSoftDeleteController,
    UserLoginController,
    UserLogoutController,
    UserRefreshTokenController,
  ],
  exports: [
    HashUtility,
    UserGetRepository,
    UserCreateRepository,
    UserUpdateRepository,
    UserSessionGetRepository,
    UserSessionCreateRepository,
    UserSessionUpdateRepository,
    UserCreateUsecase,
    UserGetByIdUsecase,
    UserPasswordUpdateUsecase,
    UserSoftDeleteUsecase,
    UserLoginUsecase,
    UserLogoutUsecase,
    UserRefreshTokenUsecase,
  ],
  imports: [CommonModule],
  providers: [
    HashUtility,
    UserGetRepository,
    UserCreateRepository,
    UserUpdateRepository,
    UserSessionGetRepository,
    UserSessionCreateRepository,
    UserSessionUpdateRepository,
    UserCreateUsecase,
    UserGetByIdUsecase,
    UserPasswordUpdateUsecase,
    UserSoftDeleteUsecase,
    UserLoginUsecase,
    UserLogoutUsecase,
    UserRefreshTokenUsecase,
  ],
})
export class UsersModule {}
