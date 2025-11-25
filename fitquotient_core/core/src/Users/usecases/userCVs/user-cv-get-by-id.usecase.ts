import { Injectable, NotFoundException } from '@nestjs/common';
import { UserCvResponseDto } from '@users/dtos';
import { UserCvGetRepository } from '@users/repositories';
import { IUserCvUsecaseContext } from '@users/context/user-cvs';

@Injectable()
export class UserCvGetByIdUsecase implements Partial<IUserCvUsecaseContext> {
  constructor(private readonly userCvGetRepository: UserCvGetRepository) {}

  async userCvGetByIdUsecase(cvId: string): Promise<UserCvResponseDto> {
    const userCv = await this.userCvGetRepository.getUserCvById(cvId);
    if (!userCv) {
      throw new NotFoundException('CV not found');
    }

    // Map entity to DTO
    const cvDto: UserCvResponseDto = {
      id: userCv.id,
      userId: userCv.userId,
      url: userCv.url,
      filename: userCv.filename,
      name: userCv.name ?? undefined,
      mimeType: userCv.mimeType,
      size: userCv.size,
      storageProvider: userCv.storageProvider,
      isActive: userCv.isActive,
      createdAt: userCv.createdAt,
      updatedAt: userCv.updatedAt,
    };

    return cvDto;
  }
}
