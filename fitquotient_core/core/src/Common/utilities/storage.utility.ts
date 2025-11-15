import { Inject, Injectable } from '@nestjs/common';
import type { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { log } from './logger.utility';

@Injectable()
export class StorageUtility {
  constructor(@Inject('GCS_CLIENT') private readonly gcsClient: Storage) {}

  async uploadPdf(
    userId: string,
    buffer: Buffer,
    filename: string,
    contentType: string,
  ): Promise<string> {
    if (!this.gcsClient) {
      throw new Error('S3 client not configured');
    }
    const key = `users/${userId}/cvs/${uuidv4()}-${filename}`;
    const bucketName = process.env.GCP_BUCKET_NAME as string;

    if (!bucketName) {
      throw new Error('GCS bucket name is not configured');
    }

    const bucket = this.gcsClient.bucket(bucketName);

    try {
      const file = bucket.file(key);
      await file.save(buffer, { contentType, resumable: false, public: true });

      // Public URL for Google Cloud Storage
      return `https://storage.googleapis.com/${bucketName}/${key}`;
    } catch (err: unknown) {
      log.error('Failed to upload file to S3: ' + String(err));
      throw err;
    }
  }
}
