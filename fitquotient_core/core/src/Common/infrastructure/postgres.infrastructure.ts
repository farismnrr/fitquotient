import { DataSource } from 'typeorm';
import { BaseDatabaseConnection } from './base.database.infrastructure';
import { entitiesRegistry } from '../utilities/entities-registry.utility';

class PostgresConnection extends BaseDatabaseConnection {
  protected databaseName = 'Postgres Database';

  protected createDataSource(): DataSource {
    return new DataSource(this.getConfig());
  }

  private getConfig() {
    return {
      type: 'postgres' as const,
      host: process.env.CORE_DB_HOST,
      port: Number(process.env.CORE_DB_PORT),
      username: process.env.CORE_DB_USER,
      password: process.env.CORE_DB_PASS,
      database: process.env.CORE_DB_NAME,
      entities: entitiesRegistry.getAll(),
      synchronize: false,
      logging: false,
    };
  }
}

export { PostgresConnection };
