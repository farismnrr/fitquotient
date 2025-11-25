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
  UserCvCreateRepository,
  UserCvGetRepository,
  UserCvSoftDeleteRepository,
} from './repositories';
import {
  UserCreateUsecase,
  UserGetByIdUsecase,
  UserPasswordUpdateUsecase,
  UserSoftDeleteUsecase,
  UserLoginUsecase,
  UserLogoutUsecase,
  UserRefreshTokenUsecase,
  UserCvCreateUsecase,
  UserCvGetByIdUsecase,
  UserCvGetAllUsecase,
  UserCvSoftDeleteUsecase,
} from './usecases';
import {
  UserCreateController,
  UserGetByIdController,
  UserUpdateController,
  UserSoftDeleteController,
  UserLoginController,
  UserLogoutController,
  UserRefreshTokenController,
  UserCvCreateController,
  UserCvGetByIdController,
  UserCvGetAllController,
  UserCvSoftDeleteController,
} from './controllers';
import { HashUtility } from './utilities';
import { CvVectorCreateService } from './services/cv-vector-create.service';
import { UserEntity, UserSessionEntity, UserCvEntity } from './entities';

const userEntities = [
  UserEntity,
  UserSessionEntity,
  UserCvEntity,
] as unknown as (new () => unknown)[];
entitiesRegistry.register(userEntities);

@Module({
  controllers: [
    UserCreateController,
    UserGetByIdController,
    UserUpdateController,
    UserSoftDeleteController,
    UserLoginController,
    UserLogoutController,
    UserRefreshTokenController,
    UserCvCreateController,
    UserCvGetByIdController,
    UserCvGetAllController,
    UserCvSoftDeleteController,
  ],
  exports: [
    HashUtility,
    UserGetRepository,
    UserCreateRepository,
    UserUpdateRepository,
    UserSessionGetRepository,
    UserSessionCreateRepository,
    UserSessionUpdateRepository,
    UserCvCreateRepository,
    UserCvGetRepository,
    UserCvSoftDeleteRepository,
    UserCreateUsecase,
    UserGetByIdUsecase,
    UserPasswordUpdateUsecase,
    UserSoftDeleteUsecase,
    UserLoginUsecase,
    UserLogoutUsecase,
    UserRefreshTokenUsecase,
    UserCvCreateUsecase,
    UserCvGetByIdUsecase,
    UserCvGetAllUsecase,
    UserCvSoftDeleteUsecase,
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
    UserCvCreateRepository,
    UserCvGetRepository,
    UserCvSoftDeleteRepository,
    // Service that forwards CVs to the external vector service
    CvVectorCreateService,
    UserCreateUsecase,
    UserGetByIdUsecase,
    UserPasswordUpdateUsecase,
    UserSoftDeleteUsecase,
    UserLoginUsecase,
    UserLogoutUsecase,
    UserRefreshTokenUsecase,
    UserCvCreateUsecase,
    UserCvGetByIdUsecase,
    UserCvGetAllUsecase,
    UserCvSoftDeleteUsecase,
  ],
})
export class UsersModule {}
