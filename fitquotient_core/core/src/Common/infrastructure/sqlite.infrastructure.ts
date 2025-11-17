import { DataSource } from 'typeorm';
import { BaseDatabaseConnection } from './base.database.infrastructure';
import { entitiesRegistry } from '../utilities/entities-registry.utility';

class SqliteConnection extends BaseDatabaseConnection {
  protected databaseName = 'SQLite Database';

  protected createDataSource(): DataSource {
    return new DataSource(this.getConfig());
  }

  private getConfig() {
    return {
      type: 'better-sqlite3' as const,
      database: process.env.CORE_DB_PATH as string,
      entities: entitiesRegistry.getAll(),
      synchronize: false,
      logging: false,
    };
  }
}

export { SqliteConnection };
