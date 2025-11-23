import { Inject, Injectable } from '@nestjs/common';
import type { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageUtility {
  constructor(@Inject('GCS_CLIENT') private readonly gcsClient: Storage) {}

  async uploadPdf(
    userId: string,
    buffer: Buffer,
    filename: string,
    contentType: string,
  ): Promise<string> {
    // If GCS is not configured, use local file storage for development
    if (!this.gcsClient) {
      return this.uploadPdfLocal(userId, buffer, filename);
    }

    const key = `users/${userId}/cvs/${uuidv4()}-${filename}`;
    const bucketName = process.env.GCP_BUCKET_NAME as string;

    if (!bucketName) {
      throw new Error('GCS bucket name is not configured');
    }

    const bucket = this.gcsClient.bucket(bucketName);

    const file = bucket.file(key);
    try {
      await file.save(buffer, { contentType, resumable: false, public: true });
    } catch (err: unknown) {
      if (err instanceof Error && err.message) {
        throw new Error(`Failed to upload file: ${err.message}`);
      }
      throw new Error('Failed to upload file');
    }

    // Public URL for Google Cloud Storage
    return `https://storage.googleapis.com/${bucketName}/${key}`;
  }

  private uploadPdfLocal(
    userId: string,
    buffer: Buffer,
    filename: string,
  ): string {
    const uploadDir = path.join(process.cwd(), 'uploads', userId, 'cvs');

    // Create directories if they don't exist
    if (!fs.existsSync(uploadDir)) {
      try {
        fs.mkdirSync(uploadDir, { recursive: true });
      } catch (err: unknown) {
        if (err instanceof Error && err.message) {
          // Rethrow with a clearer message for debugging and to match the API's error structure
          throw new Error(
            `Failed to create upload directory '${uploadDir}': ${err.message}`,
          );
        }
        throw new Error('Failed to create upload directory: Unknown error');
      }
    }

    const fileId = uuidv4();
    const filepath = path.join(uploadDir, `${fileId}-${filename}`);
    const relativePath = path.relative(process.cwd(), filepath);

    try {
      fs.writeFileSync(filepath, buffer);
      // Return a local URL (for development/testing)
      return `file://${relativePath}`;
    } catch (err: unknown) {
      if (err instanceof Error && err.message) {
        throw new Error(`Failed to save file locally: ${err.message}`);
      }
      throw new Error('Failed to save file locally: Unknown error');
    }
  }
}
