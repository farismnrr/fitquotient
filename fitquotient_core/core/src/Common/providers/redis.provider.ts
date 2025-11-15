import { RedisConnection } from '../infrastructure';
import { log } from '../utilities';

export const redisConnection = new RedisConnection();

export const redisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: async () => {
    if (!redisConnection.isConfigured()) {
      log.warn('Redis not configured, returning null client');
      return null;
    }

    log.debug(
      `Redis Config - Host: ${process.env.REDIS_HOST}, Port: ${process.env.REDIS_PORT}`,
    );

    if (!redisConnection.isInitialized()) {
      log.info('Initializing Redis connection...');
      await redisConnection.init();
    }
    return redisConnection.getClient();
  },
};
