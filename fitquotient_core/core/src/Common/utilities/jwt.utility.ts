import { Injectable } from '@nestjs/common';
import {
  sign,
  verify,
  decode,
  SignOptions,
  VerifyOptions,
  DecodeOptions,
} from 'jsonwebtoken';
import { log } from './logger.utility';

export interface JwtPayload {
  sub: string | number;
  iat?: number;
  exp?: number;
  iss?: string;
  type?: 'access' | 'refresh';
  [key: string]: any;
}

// Use SignOptions/VerifyOptions from jsonwebtoken for stricter typing

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class JwtUtility {
  private readonly secret: string;
  private readonly defaultExpiration: string | number;
  private readonly defaultIssuer: string = 'FitQuotient';

  constructor() {
    const envSecret = process.env.JWT_SECRET;
    // Ensure secret is always a string to satisfy the declared type; use empty string if not set
    this.secret = envSecret ?? '';
    this.defaultExpiration = process.env.JWT_EXPIRATION
      ? parseInt(process.env.JWT_EXPIRATION, 10)
      : 3600;

    if (!envSecret) {
      log.warn(
        'JWT_SECRET is not properly configured. Using default secret. This is not recommended for production.',
      );
    }
  }

  /**
   * Generate access token and refresh token pair
   * @param payload - The payload to encode in tokens
   * @param options - JWT options for access token (refreshToken will have no expiration)
   * @returns Object with accessToken and refreshToken
   */
  generateTokenPair(payload: JwtPayload, options?: SignOptions): TokenPair {
    try {
      const accessToken = this.generate(
        { ...payload, type: 'access' },
        {
          ...options,
          expiresIn: (options?.expiresIn ??
            this.defaultExpiration) as SignOptions['expiresIn'],
        },
      );

      // For refresh token, explicitly avoid setting expiresIn to produce a token without `exp`
      const refreshOptions: SignOptions = {
        issuer: options?.issuer,
        subject: options?.subject,
        audience: options?.audience,
        jwtid: options?.jwtid,
        algorithm: options?.algorithm,
        // do not set expiresIn
      };

      const refreshToken = this.generate(
        { ...payload, type: 'refresh' },
        refreshOptions,
      );

      //   log.debug(`Token pair generated for subject: ${payload.sub}`);
      return { accessToken, refreshToken };
    } catch (error) {
      log.error(
        `Failed to generate token pair: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new Error('Token pair generation failed');
    }
  }

  /**
   * Generate JWT token
   * @param payload - The payload to encode in the token
   * @param options - JWT options (expiresIn, issuer, etc.)
   * @returns Signed JWT token
   */
  generate(payload: JwtPayload, options?: SignOptions): string {
    try {
      const signOptions: SignOptions = {
        issuer: options?.issuer || this.defaultIssuer,
        algorithm: options?.algorithm || 'HS256',
      };

      // Only set expiresIn if explicitly provided (and not null). If undefined => use default
      if (options?.expiresIn !== undefined && options?.expiresIn !== null) {
        signOptions.expiresIn = options.expiresIn as SignOptions['expiresIn'];
      } else if (options?.expiresIn !== null) {
        signOptions.expiresIn = this
          .defaultExpiration as SignOptions['expiresIn'];
      }

      if (options?.subject) {
        signOptions.subject = options.subject;
      }

      if (options?.audience) {
        signOptions.audience = options.audience;
      }

      if (options?.jwtid) {
        signOptions.jwtid = options.jwtid;
      }

      const token = sign(
        payload as Record<string, unknown>,
        this.secret,
        signOptions,
      );
      //   log.debug(`JWT token generated for subject: ${payload.sub}`);
      return token;
    } catch (error) {
      log.error(
        `Failed to generate JWT token: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new Error('JWT token generation failed');
    }
  }

  /**
   * Verify and decode JWT token
   * @param token - The token to verify
   * @param options - JWT verify options
   * @returns Decoded payload if valid
   */
  verify(token: string, options?: VerifyOptions): JwtPayload | null {
    try {
      const verifyOptions: VerifyOptions = {
        algorithms: ['HS256'],
        issuer: this.defaultIssuer,
        ...options,
      };

      const decodedRaw = verify(token, this.secret, verifyOptions);
      if (typeof decodedRaw !== 'object' || decodedRaw === null) {
        return null;
      }
      const decoded = decodedRaw as JwtPayload;
      //   log.debug(`JWT token verified for subject: ${decoded.sub}`);
      return decoded;
    } catch {
      //   log.debug(`JWT token verification failed`);
      return null;
    }
  }

  /**
   * Decode JWT token without verification (for inspection)
   * @param token - The token to decode
   * @returns Decoded payload or null if invalid
   */
  decode(token: string): JwtPayload | null {
    try {
      const decodedRaw = decode(token, { complete: false } as DecodeOptions);
      if (typeof decodedRaw !== 'object' || decodedRaw === null) {
        return null;
      }
      return decodedRaw as JwtPayload;
    } catch (error) {
      log.error(
        `Failed to decode JWT token: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  }

  /**
   * Get token expiration time in milliseconds from now
   * @param token - The token to check
   * @returns Milliseconds until expiration or null if token is invalid
   */
  getExpirationTime(token: string): number | null {
    try {
      const decoded = this.decode(token);
      if (!decoded || !decoded.exp) {
        return null;
      }

      const expirationMs = decoded.exp * 1000 - Date.now();
      return expirationMs > 0 ? expirationMs : 0;
    } catch (error) {
      log.error(
        `Failed to get expiration time: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  }

  /**
   * Check if token is expired
   * @param token - The token to check
   * @returns true if expired, false otherwise
   */
  isExpired(token: string): boolean {
    const expirationTime = this.getExpirationTime(token);
    return expirationTime === null || expirationTime <= 0;
  }

  /**
   * Refresh JWT token with new expiration
   * @param token - The token to refresh
   * @param options - JWT options for new token
   * @returns New signed JWT token or null if refresh fails
   */
  refresh(token: string, options?: SignOptions): string | null {
    try {
      const decoded = this.verify(token);
      if (!decoded) {
        log.warn('Cannot refresh invalid or expired token');
        return null;
      }

      // Remove iat and exp from decoded payload as we'll set new ones
      const payloadObj = { ...decoded } as Record<string, unknown>;
      delete payloadObj.iat;
      delete payloadObj.exp;

      return this.generate(payloadObj as JwtPayload, options);
    } catch (error) {
      log.error(
        `Failed to refresh JWT token: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  }
}

export const jwtUtility = new JwtUtility();
