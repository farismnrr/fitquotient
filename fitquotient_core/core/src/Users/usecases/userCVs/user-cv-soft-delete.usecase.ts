import { Injectable, NotFoundException } from '@nestjs/common';
import {
  UserCvGetRepository,
  UserCvSoftDeleteRepository,
} from '@users/repositories';
import { IUserCvUsecaseContext } from '@users/context/user-cvs';

@Injectable()
export class UserCvSoftDeleteUsecase implements Partial<IUserCvUsecaseContext> {
  constructor(
    private readonly userCvSoftDeleteRepository: UserCvSoftDeleteRepository,
    private readonly userCvGetRepository: UserCvGetRepository,
  ) {}

  async userCvSoftDeleteUsecase(cvId: string): Promise<void> {
    const existingCvs = await this.userCvGetRepository.getUserCvById(cvId);
    if (!existingCvs) {
      throw new NotFoundException('CV not found');
    }
    await this.userCvSoftDeleteRepository.softDeleteUserCv(cvId);
  }
}
