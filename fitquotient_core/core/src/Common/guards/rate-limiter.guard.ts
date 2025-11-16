import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { RateLimiterService } from '../services/rate-limiter.service';

@Injectable()
export class RateLimiterGuard implements CanActivate {
  constructor(private readonly rateLimiterService: RateLimiterService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const response = context.switchToHttp().getResponse<FastifyReply>();

    // Get client IP (considering proxy headers)
    const headers = request.headers as Record<string, unknown>;
    const forwardedIp = (headers['x-forwarded-for'] as string)?.split(',')[0];
    const realIp = headers['x-real-ip'] as string;
    const remoteAddress = request.socket?.remoteAddress as string;

    const clientIp = forwardedIp || realIp || remoteAddress || 'unknown';

    // Create rate limit key (IP + endpoint)
    const key = `rate-limit:${clientIp}:${request.method}:${request.url}`;

    // Check if request is allowed (100 requests per minute)
    const isAllowed = await this.rateLimiterService.isAllowed(key, 100, 60000);

    if (!isAllowed) {
      response.header('Retry-After', '60');
      throw new HttpException(
        'Too many requests, please try again later',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Add remaining requests to response header
    const remaining = await this.rateLimiterService.getRemainingRequests(
      key,
      100,
    );
    response.header('X-RateLimit-Remaining', remaining.toString());
    response.header('X-RateLimit-Limit', '100');

    return true;
  }
}
