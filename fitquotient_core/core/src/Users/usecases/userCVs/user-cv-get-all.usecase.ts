import { Injectable } from '@nestjs/common';
import { UserCvGetRepository } from '@users/repositories';
import { UserCvResponseDto } from '@users/dtos';
import { UserCvEntity } from '@users/entities';

@Injectable()
export class UserCvGetAllUsecase {
  constructor(private readonly userCvGetRepository: UserCvGetRepository) {}

  async userCvGetAllUsecase(userId: string): Promise<UserCvResponseDto[]> {
    const cvs: UserCvEntity[] =
      await this.userCvGetRepository.getUserCvsByUserId(userId);
    const dtos: UserCvResponseDto[] = cvs.map((c) => ({
      id: c.id,
      userId: c.userId,
      url: c.url,
      filename: c.filename,
      mimeType: c.mimeType,
      size: c.size,
      storageProvider: c.storageProvider,
      isActive: c.isActive,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return dtos;
  }
}
