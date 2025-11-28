import { Inject, Injectable } from '@nestjs/common';
import type { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageUtility {
  constructor(@Inject('GCS_CLIENT') private readonly gcsClient: Storage) {}

  isCloudStorageEnabled(): boolean {
    return !!this.gcsClient;
  }

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
    // Note: We intentionally do not use a relative path here —
    // the file path is returned as a public URL below.

    try {
      fs.writeFileSync(filepath, buffer);
      // Return a local http URL (for development/testing)
      const publicUrl =
        process.env.CORE_PUBLIC_URL ||
        `http://${process.env.CORE_HOST || 'localhost'}:${
          process.env.CORE_PORT || 5400
        }`;
      const publicPath = `/uploads/${userId}/cvs/${fileId}-${filename}`;
      return `${publicUrl}${publicPath}`;
    } catch (err: unknown) {
      if (err instanceof Error && err.message) {
        throw new Error(`Failed to save file locally: ${err.message}`);
      }
      throw new Error('Failed to save file locally: Unknown error');
    }
  }
}
