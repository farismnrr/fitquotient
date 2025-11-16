import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserCvEntity } from '@users/entities';
import { UserCvCreateRepository } from '@users/repositories';
import { UserGetRepository } from '@users/repositories/users/user-get.repository';
import { CvVectorCreateService } from '@users/services/cv-vector-create.service';
import { StorageUtility } from '@common/utilities/storage.utility';
import { parsePdfBuffer, log } from '@common/utilities';
import { IUserCvUsecaseContext } from '@users/context/user-cvs';

@Injectable()
export class UserCvCreateUsecase implements Partial<IUserCvUsecaseContext> {
  constructor(
    private readonly userCvCreateRepository: UserCvCreateRepository,
    private readonly userGetRepository: UserGetRepository,
    private readonly storageUtility: StorageUtility,
    private readonly cvVectorCreateService: CvVectorCreateService,
  ) {}

  async userCvCreateUsecase(
    userId: string,
    uploadData: { buffer: Buffer; filename: string; mimetype: string },
  ): Promise<{ id: string; url: string }> {
    const user = await this.userGetRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { buffer, filename, mimetype } = uploadData;
    const url = await this.storageUtility.uploadPdf(
      userId,
      buffer,
      filename,
      mimetype,
    );

    const parsedPdf = await parsePdfBuffer(buffer);
    if (parsedPdf === null) {
      throw new InternalServerErrorException('PDF parse failed');
    }

    const userCv = new UserCvEntity();
    userCv.userId = userId;
    userCv.url = url;
    userCv.filename = filename;
    userCv.mimeType = mimetype;
    userCv.size = buffer.length;
    userCv.storageProvider = 'gcs';
    userCv.isActive = true;

    const id = await this.userCvCreateRepository.createUserCv(userCv);
    await this.cvVectorCreateService.createCvVector({
      cvId: id,
      userId: userId,
      filename: filename,
      sourceUrl: url,
      text: parsedPdf.text || '',
    });

    return { id, url };
  }
}
