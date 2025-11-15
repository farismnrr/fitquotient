import type { FastifyReply, FastifyRequest } from 'fastify';
import { log } from './logger.utility';

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Lax' | 'Strict' | 'None';
  maxAge?: number;
  path?: string;
  domain?: string;
}

export class CookieUtility {
  private readonly isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  /**
   * Set HTTP-only cookie with domain support
   * @param reply - FastifyReply instance
   * @param name - Cookie name
   * @param value - Cookie value
   * @param options - Cookie options
   */
  setCookie(
    reply: FastifyReply,
    name: string,
    value: string,
    options?: CookieOptions,
  ): void {
    try {
      const cookieOptions = this.buildCookieOptions(options);
      const cookieHeader = this.buildCookieHeader(name, value, cookieOptions);
      reply.header('Set-Cookie', cookieHeader);
    } catch (error) {
      log.error(
        `Failed to set cookie ${name}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new Error(`Cookie setting failed: ${name}`);
    }
  }

  /**
   * Set refresh token cookie with HTTP-only flag
   * Auto extract domain from request hostname
   * @param reply - FastifyReply instance
   * @param request - FastifyRequest instance
   * @param refreshToken - Refresh token value
   * @param maxAge - Token expiration in seconds (optional)
   */
  setRefreshTokenCookie(
    reply: FastifyReply,
    request: FastifyRequest,
    refreshToken: string,
    maxAge?: number,
  ): void {
    const domain = this.extractDomainFromHost(request.hostname);
    this.setCookie(reply, 'refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'Strict' : 'Lax',
      maxAge: maxAge ?? 7 * 24 * 60 * 60, // 7 days default (in seconds)
      path: '/',
      domain: domain || undefined,
    });
  }

  /**
   * Clear cookie (set with maxAge 0)
   * @param reply - FastifyReply instance
   * @param name - Cookie name
   * @param request - FastifyRequest instance (to auto-detect domain)
   */
  clearCookie(
    reply: FastifyReply,
    name: string,
    request?: FastifyRequest,
  ): void {
    try {
      const domain = request
        ? this.extractDomainFromHost(request.hostname)
        : undefined;
      const cookieOptions = {
        path: '/',
        domain: domain || undefined,
        maxAge: 0,
      };
      const cookieHeader = this.buildCookieHeader(name, '', cookieOptions);
      reply.header('Set-Cookie', cookieHeader);
      log.debug(`Cookie cleared: ${name} with domain: ${domain || 'default'}`);
    } catch (error) {
      log.error(
        `Failed to clear cookie ${name}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Clear refresh token cookie
   * @param reply - FastifyReply instance
   * @param request - FastifyRequest instance (to auto-detect domain)
   */
  clearRefreshTokenCookie(reply: FastifyReply, request: FastifyRequest): void {
    this.clearCookie(reply, 'refreshToken', request);
  }

  /**
   * Build cookie options with defaults
   * @param options - Partial cookie options
   * @returns Complete cookie options object
   */
  private buildCookieOptions(options?: CookieOptions): Record<string, any> {
    const cookieOptions: Record<string, any> = {
      httpOnly: options?.httpOnly ?? true,
      secure: options?.secure ?? this.isProduction,
      sameSite: options?.sameSite ?? (this.isProduction ? 'Strict' : 'Lax'),
      path: options?.path ?? '/',
    };

    if (options?.maxAge) {
      cookieOptions.maxAge = options.maxAge;
    }

    if (options?.domain) {
      cookieOptions.domain = options.domain;
    }

    return cookieOptions;
  }

  /**
   * Build Set-Cookie header value from name, value and options
   * @param name - Cookie name
   * @param value - Cookie value
   * @param options - Cookie options
   * @returns Set-Cookie header string
   */
  private buildCookieHeader(
    name: string,
    value: string,
    options: Record<string, any>,
  ): string {
    let header = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.path) {
      header += `; Path=${options.path}`;
    }

    if (options.domain) {
      header += `; Domain=${options.domain}`;
    }

    if (options.maxAge !== undefined && options.maxAge !== null) {
      header += `; Max-Age=${Math.floor(options.maxAge as number)}`;
    }

    if (options.httpOnly) {
      header += '; HttpOnly';
    }

    if (options.secure) {
      header += '; Secure';
    }

    if (options.sameSite) {
      header += `; SameSite=${options.sameSite}`;
    }

    return header;
  }

  /**
   * Get cookie domain configuration
   * @returns Empty string (domain is auto-detected from host)
   */
  getDefaultDomain(): string {
    return ''; // Domain is now auto-detected from request hostname
  }

  /**
   * Extract domain from hostname
   * Removes port number and returns the domain
   * Examples:
   * - "localhost:3000" -> "localhost"
   * - "api.example.com" -> "api.example.com"
   * - "192.168.1.1:3000" -> "192.168.1.1"
   * @param hostname - Request hostname
   * @returns Domain without port
   */
  private extractDomainFromHost(hostname: string): string {
    if (!hostname) return '';

    // Remove port if exists
    const domain = hostname.split(':')[0];
    return domain;
  }

  /**
   * Check if running in production
   * @returns true if production environment
   */
  isProductionMode(): boolean {
    return this.isProduction;
  }

  /**
   * Extract cookie value by name from cookie header
   * @param cookieHeader - Cookie header string from request
   * @param name - Cookie name to extract
   * @returns Cookie value or null if not found
   */
  extractCookieValue(cookieHeader: string, name: string): string | null {
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(';');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }
}

export const cookieUtility = new CookieUtility();
