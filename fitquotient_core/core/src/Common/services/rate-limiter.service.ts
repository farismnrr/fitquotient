import { Injectable, Inject, Optional } from '@nestjs/common';
import { log } from '@common/utilities';

@Injectable()
export class RateLimiterService {
  constructor(@Optional() @Inject('REDIS_CLIENT') private client: any) {}

  async isAllowed(
    key: string,
    limit: number = 100,
    windowMs: number = 60000, // 1 minute
  ): Promise<boolean> {
    // If Redis client is not available, allow the request
    if (!this.client) {
      return true;
    }

    try {
      const current = await this.client.incr(key);

      if (current === 1) {
        await this.client.expire(key, Math.ceil(windowMs / 1000));
      }

      return current <= limit;
    } catch (error) {
      // If Redis is down, allow the request (fail open)
      log.error('Rate limiter error:', error);
      return true;
    }
  }

  async getRemainingRequests(
    key: string,
    limit: number = 100,
  ): Promise<number> {
    // If Redis client is not available, return limit
    if (!this.client) {
      return limit;
    }

    try {
      const current = await this.client.get(key);
      const currentCount = current ? parseInt(current, 10) : 0;
      return Math.max(0, limit - currentCount);
    } catch (error) {
      log.error('Rate limiter error:', error);
      return limit;
    }
  }

  async reset(key: string): Promise<void> {
    // If Redis client is not available, skip
    if (!this.client) {
      return;
    }

    try {
      await this.client.del(key);
    } catch (error) {
      log.error('Rate limiter error:', error);
    }
  }
}
