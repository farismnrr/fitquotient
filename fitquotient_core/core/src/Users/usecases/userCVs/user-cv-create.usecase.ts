import { Injectable, NotFoundException } from '@nestjs/common';
import { UserCvEntity } from '@users/entities';
import { UserCvCreateRepository } from '@users/repositories';
import { UserGetRepository } from '@users/repositories/users/user-get.repository';
import { StorageUtility } from '@common/utilities/storage.utility';

@Injectable()
export class UserCvCreateUsecase {
  constructor(
    private readonly userCvCreateRepository: UserCvCreateRepository,
    private readonly userGetRepository: UserGetRepository,
    private readonly storageUtility: StorageUtility,
  ) {}

  async execute(
    userId: string,
    uploadData: { buffer: Buffer; filename: string; mimetype: string },
  ): Promise<{ id: string; url: string }> {
    // Verify user exists
    const user = await this.userGetRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Handle upload
    const { buffer, filename, mimetype } = uploadData;
    const url = await this.storageUtility.uploadPdf(
      userId,
      buffer,
      filename,
      mimetype,
    );

    // Create CV entity
    const userCv = new UserCvEntity();
    userCv.userId = userId;
    userCv.url = url;
    userCv.filename = filename;
    userCv.mimeType = mimetype;
    userCv.size = buffer.length;
    userCv.storageProvider = 'gcs';
    userCv.isActive = true;

    const id = await this.userCvCreateRepository.createUserCv(userCv);

    return { id, url };
  }
}
