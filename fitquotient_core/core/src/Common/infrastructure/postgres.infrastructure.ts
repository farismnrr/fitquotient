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
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: entitiesRegistry.getAll(),
      synchronize: false,
      logging: false,
    };
  }
}

export { PostgresConnection };
