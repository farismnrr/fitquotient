import { Injectable, NotFoundException } from '@nestjs/common';
import { UserCvSoftDeleteRepository } from '@users/repositories';

@Injectable()
export class UserCvSoftDeleteUsecase {
  constructor(
    private readonly userCvSoftDeleteRepository: UserCvSoftDeleteRepository,
  ) {}

  async execute(cvId: string): Promise<void> {
    const success =
      await this.userCvSoftDeleteRepository.softDeleteUserCv(cvId);

    if (!success) {
      throw new NotFoundException('CV not found or already deleted');
    }
  }
}
