import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashUtility {
  /**
   * Hash password using argon2
   * @param password - Plain text password to be hashed
   * @returns Hashed password
   */
  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  /**
   * Verify password with stored hash
   * @param password - Plain text password to verify
   * @param hash - Hashed password from database
   * @returns True if password matches, false otherwise
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, password);
  }
}
