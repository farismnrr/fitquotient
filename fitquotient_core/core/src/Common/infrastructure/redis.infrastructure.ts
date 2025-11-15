import { createClient, RedisClientType } from 'redis';
import { log } from '../utilities';
import { InfrastructureError } from './infrastructure.error';

class RedisConnection {
  private client: RedisClientType | null = null;
  private reconnecting = false;
  private hasLoggedInitialError = false;
  private isShuttingDown = false;

  constructor() {
    // Client will be created and connected in init()
  }

  /** Check if Redis is configured in environment variables */
  private isRedisConfigured(): boolean {
    return (
      process.env.REDIS_HOST !== undefined &&
      process.env.REDIS_PORT !== undefined &&
      process.env.REDIS_PASS !== undefined
    );
  }

  /** Public method to check if Redis is configured */
  isConfigured(): boolean {
    return this.isRedisConfigured();
  }

  /** Public init function to start async processes safely */
  async init(): Promise<void> {
    if (!this.isRedisConfigured()) {
      log.warn('Redis not configured, skipping initialization');
      return;
    }

    if (this.client === null) {
      this.client = createClient({
        socket: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),

          reconnectStrategy: (retries) => Math.min(retries * 200, 3000),
        },
        password: process.env.REDIS_PASS,
      });

      this.setupClientListeners();
    }

    await this.connectWithRetry();
  }

  private setupClientListeners(): void {
    if (!this.client) return;

    this.client.on('socketError', (err) => {
      if (!this.reconnecting) {
        log.error(`Runtime error: ${InfrastructureError(err)}`);
        log.warn('Redis disconnected, attempting to reconnect...');
        this.reconnecting = true;
      }
    });

    this.client.on('error', (err) => {
      if (!this.reconnecting) {
        log.error(`Runtime error: ${InfrastructureError(err)}`);
        log.warn('Redis disconnected, attempting to reconnect...');
        this.reconnecting = true;
      }
    });

    this.client.on('end', () => {
      if (!this.reconnecting) {
        this.reconnecting = true;
        log.warn('Redis disconnected, attempting to reconnect...');
      }
    });

    this.client.on('connect', () => {
      if (this.reconnecting) {
        log.info('Redis reconnected successfully');
        this.reconnecting = false;
        this.hasLoggedInitialError = false;
      }
    });
  }

  private async connectWithRetry(): Promise<void> {
    if (this.isShuttingDown || !this.client) return;

    try {
      await this.client.connect();
      this.reconnecting = false;
      this.hasLoggedInitialError = false;
      log.info('Redis connected successfully');
    } catch (err) {
      const message = InfrastructureError(err);

      if (!this.hasLoggedInitialError) {
        this.hasLoggedInitialError = true;
        log.error(`Connection failed: ${message}`);
      }

      if (!this.reconnecting) {
        this.reconnecting = true;
        log.warn('Redis disconnected, attempting to reconnect...');
      }

      // Retry after delay
      setTimeout(() => void this.connectWithRetry(), 3000);
    }
  }

  async close(): Promise<void> {
    this.isShuttingDown = true;

    if (!this.client || !this.client.isOpen) {
      log.warn('Redis connection not initialized');
      return;
    }

    await this.client
      .quit()
      .then(() => log.info('Redis connection closed'))
      .catch((err) =>
        log.error(`Failed to close connection: ${InfrastructureError(err)}`),
      );
  }

  async get(key: string): Promise<string | null> {
    if (!this.client) {
      log.error(`Failed to get key ${key}: Client not initialized`);
      return null;
    }

    try {
      return await this.client.get(key);
    } catch (err) {
      log.error(`Failed to get key ${key}: ${InfrastructureError(err)}`);
      return null;
    }
  }

  async setEx(key: string, seconds: number, value: string): Promise<void> {
    if (!this.client) {
      log.error(`Failed to set key ${key}: Client not initialized`);
      return;
    }

    try {
      await this.client.setEx(key, seconds, value);
    } catch (err) {
      log.error(`Failed to set key ${key}: ${InfrastructureError(err)}`);
    }
  }

  getClient(): RedisClientType | null {
    return this.client;
  }

  isInitialized(): boolean {
    return this.client !== null && this.client.isOpen;
  }
}

export { RedisConnection };
