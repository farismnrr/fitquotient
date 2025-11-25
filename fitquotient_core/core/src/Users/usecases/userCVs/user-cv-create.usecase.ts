import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserCvEntity } from '@users/entities';
import { UserCvCreateRepository } from '@users/repositories';
import { UserGetRepository } from '@users/repositories/users/user-get.repository';
import { CvVectorCreateService } from '@users/services/cv-vector-create.service';
import { StorageUtility } from '@common/utilities/storage.utility';
import { parsePdfBuffer } from '@common/utilities';
import { IUserCvUsecaseContext } from '@users/context/user-cvs';
import type { FastifyRequest } from 'fastify';
import type {
  FastifyRequestWithMultipart,
  FastifyFileData,
  FastifyMultipartPart,
} from '@users/types/fastify-multipart.types';
import { isFilePart, isFieldPart } from '@users/types/fastify-multipart.types';
import { streamToBuffer } from '@common/utilities';

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
    req: FastifyRequest,
  ): Promise<{ id: string; url: string }> {
    const fastifyReq = req as FastifyRequestWithMultipart;

    let buffer: Buffer | undefined;
    let filename: string | undefined;
    let mimetype: string | undefined;
    let nameFromUser: string | undefined;

    // Move parsing logic to a small helper to avoid nested control flow and `any` casts

    const parseMultipartParts = async (): Promise<void> => {
      if (typeof fastifyReq.parts !== 'function') return;
      for await (const part of fastifyReq.parts() as AsyncIterable<FastifyMultipartPart>) {
        if (isFilePart(part)) {
          filename = part.filename;
          mimetype = part.mimetype;
          buffer = await streamToBuffer(part.file);
          continue;
        }
        // non-file part - capture the `name` field if present
        if (isFieldPart(part) && part.fieldname === 'name') {
          nameFromUser = part.value;
        }
      }
    };

    const parseFileFromFileFn = async (): Promise<void> => {
      if (typeof fastifyReq.file !== 'function') return;
      const data = await fastifyReq.file();
      if (!data) return;
      filename = data.filename;
      mimetype = data.mimetype;
      buffer = await streamToBuffer(data.file);
    };

    await parseMultipartParts();
    await parseFileFromFileFn();
    // fallback for body `name` in non-multipart scenarios
    if (!nameFromUser) {
      nameFromUser = fastifyReq.body?.name ?? undefined;
    }

    if (!buffer || !filename || !mimetype) {
      throw new BadRequestException(
        'No file uploaded. Please send multipart/form-data with a file field',
      );
    }
    const user = await this.userGetRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // spread values parsed from request
    const parsedBuffer = buffer as Buffer;
    const parsedFilename = filename as string;
    const parsedMimetype = mimetype as string;
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
    userCv.filename = parsedFilename;
    userCv.name = nameFromUser ?? null;
    userCv.mimeType = parsedMimetype;
    userCv.size = parsedBuffer.length;
    userCv.storageProvider = this.storageUtility.isCloudStorageEnabled()
      ? 'gcs'
      : 'local';
    userCv.isActive = true;

    const id = await this.userCvCreateRepository.createUserCv(userCv);
    await this.cvVectorCreateService.createCvVector({
      cvId: id,
      userId: userId,
      filename: parsedFilename,
      sourceUrl: url,
      text: parsedPdf.text || '',
    });

    return { id, url };
  }
}
