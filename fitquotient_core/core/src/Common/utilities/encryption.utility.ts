import * as crypto from 'crypto';
import { log } from './logger.utility';

export class EncryptionUtility {
  /**
   * Generate encryption key from combined secret via environment variables
   * @returns Generated key for decryption
   */
  private generateKey(): Buffer {
    const apiKey = process.env.API_KEY || '';
    const jwtSecret = process.env.JWT_SECRET || '';
    const jwtExpiration = process.env.JWT_EXPIRATION || '';

    const combined = `${apiKey}${jwtSecret}${jwtExpiration}`;
    // Use SHA-256 hash to generate a consistent 32-byte key
    return crypto.createHash('sha256').update(combined).digest();
  }

  /**
   * Decrypt encrypted text using AES-256-CBC
   * Key is automatically generated from environment variables (API_KEY + JWT_SECRET + JWT_EXPIRATION)
   * @param encryptedText - Encrypted text in format: iv:encryptedText (both base64 encoded)
   * @returns Decrypted text
   */
  decrypt(encryptedText: string): string {
    try {
      const key = this.generateKey();

      // Split IV and encrypted data
      const parts = encryptedText.split(':');
      if (parts.length !== 2) {
        throw new Error('Invalid encrypted format');
      }

      const iv = Buffer.from(parts[0], 'base64');
      const encrypted = parts[1];

      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(encrypted, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      log.error(
        `Decryption failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new Error('Decryption failed');
    }
  }
}

export const encryptionUtility = new EncryptionUtility();
