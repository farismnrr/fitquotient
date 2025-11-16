import { Global, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InfrastructureService } from './infrastructure';
import { StorageUtility } from './utilities/storage.utility';
import { RateLimiterService } from './services/rate-limiter.service';
import {
  redisProvider,
  getPostgresConnection,
  getMysqlConnection,
  getSqliteConnection,
  storageProvider,
} from './providers';

// Create a unified DataSource provider that returns the active database connection
const createUnifiedDatabaseProvider = () => {
  return {
    provide: DataSource,
    useFactory: async () => {
      const dbType = process.env.DB_TYPE?.toLowerCase();
      let dataSource: DataSource | null = null;

      if (dbType === 'postgres') {
        const connection = getPostgresConnection();
        if (!connection.dataSource?.isInitialized) {
          await connection.init();
        }
        dataSource = connection.dataSource;
      } else if (dbType === 'mysql') {
        const connection = getMysqlConnection();
        if (!connection.dataSource?.isInitialized) {
          await connection.init();
        }
        dataSource = connection.dataSource;
      } else {
        const connection = getSqliteConnection();
        if (!connection.dataSource?.isInitialized) {
          await connection.init();
        }
        dataSource = connection.dataSource;
      }

      return dataSource;
    },
  };
};

@Global()
@Module({
  providers: [
    InfrastructureService,
    createUnifiedDatabaseProvider(),
    redisProvider,
    storageProvider,
    StorageUtility,
    RateLimiterService,
  ],
  exports: [
    DataSource,
    redisProvider,
    storageProvider,
    StorageUtility,
    RateLimiterService,
  ],
})
export class CommonModule {}
