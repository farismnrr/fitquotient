import { PostgresConnection } from '../infrastructure';
import { log } from '../utilities';

let postgresConnection: PostgresConnection | null = null;

const getPostgresConnection = (): PostgresConnection => {
  if (!postgresConnection) {
    postgresConnection = new PostgresConnection();
  }
  return postgresConnection;
};

export const postgresProvider = {
  provide: 'POSTGRES_CONNECTION',
  useFactory: async () => {
    const dbType = process.env.CORE_DB_TYPE?.toLowerCase();

    // Only initialize Postgres if it's the selected database
    if (dbType === 'postgres') {
      const connection = getPostgresConnection();

      if (!connection.dataSource || !connection.dataSource.isInitialized) {
        log.info('Initializing PostgreSQL connection...');
        await connection.init();
      }
      return connection.dataSource;
    }

    return null;
  },
};

export { getPostgresConnection };
