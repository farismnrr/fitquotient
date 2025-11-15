import { Injectable, NotFoundException } from '@nestjs/common';
import { UserCvSoftDeleteRepository } from '@users/repositories';
import { IUserCvUsecaseContext } from '@users/context/user-cvs';

@Injectable()
export class UserCvSoftDeleteUsecase implements Partial<IUserCvUsecaseContext> {
  constructor(
    private readonly userCvSoftDeleteRepository: UserCvSoftDeleteRepository,
  ) {}

  async userCvSoftDeleteUsecase(cvId: string): Promise<void> {
    const success =
      await this.userCvSoftDeleteRepository.softDeleteUserCv(cvId);

    if (!success) {
      throw new NotFoundException('CV not found or already deleted');
    }
  }
}
