import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { getPostgresConnection } from '../providers/postgres.provider';
import { getMysqlConnection } from '../providers/mysql.provider';
import { getSqliteConnection } from '../providers/sqlite.provider';
import { redisConnection } from '../providers/redis.provider';
import { log } from '../utilities';

@Injectable()
export class InfrastructureService implements OnModuleInit, OnModuleDestroy {
  private isRedisConfigured(): boolean {
    return (
      process.env.REDIS_HOST !== undefined &&
      process.env.REDIS_PORT !== undefined &&
      process.env.REDIS_PASS !== undefined
    );
  }

  private getDatabaseConnection() {
    const dbType = process.env.CORE_DB_TYPE?.toLowerCase();
    if (dbType === 'postgres') {
      return getPostgresConnection();
    } else if (dbType === 'mysql') {
      return getMysqlConnection();
    } else {
      return getSqliteConnection();
    }
  }

  private async initializeDatabase(): Promise<void> {
    const dbConnection = this.getDatabaseConnection();
    if (!dbConnection.dataSource || !dbConnection.dataSource.isInitialized) {
      await dbConnection.init();
    }
  }

  private async closeDatabase(): Promise<void> {
    const dbConnection = this.getDatabaseConnection();
    if (dbConnection.dataSource && dbConnection.dataSource.isInitialized) {
      await dbConnection.close();
    }
  }

  async onModuleInit(): Promise<void> {
    log.info('Initializing infrastructure...');

    // Initialize database
    await this.initializeDatabase();

    // Initialize Redis only if configured
    if (this.isRedisConfigured()) {
      if (!redisConnection.isInitialized()) {
        await redisConnection.init();
      }
    } else {
      log.warn('Redis not configured, skipping initialization');
    }

    log.info('Infrastructure initialized successfully.');
  }

  async onModuleDestroy(): Promise<void> {
    log.info('Closing infrastructure connections...');

    // Close database
    await this.closeDatabase();

    // Close Redis only if it was initialized
    if (redisConnection.isInitialized()) {
      await redisConnection.close();
    }

    log.info('Infrastructure shutdown complete.');
  }
}
