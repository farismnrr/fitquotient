import { SqliteConnection } from '../infrastructure';
import { log } from '../utilities';

let sqliteConnection: SqliteConnection | null = null;

const getSqliteConnection = (): SqliteConnection => {
  if (!sqliteConnection) {
    sqliteConnection = new SqliteConnection();
  }
  return sqliteConnection;
};

export const sqliteProvider = {
  provide: 'SQLITE_CONNECTION',
  useFactory: async () => {
    const dbType = process.env.CORE_DB_TYPE?.toLowerCase();

    // Only initialize SQLite if it's the selected database
    if (dbType === 'sqlite' || !dbType) {
      const connection = getSqliteConnection();

      const config = {
        type: 'better-sqlite3' as const,
        database: process.env.CORE_DB_PATH as string,
        synchronize: false,
        logging: false,
      };

      log.debug(`SQLite Config - Database: ${config.database}`);

      if (!connection.dataSource || !connection.dataSource.isInitialized) {
        log.info('Initializing SQLite connection...');
        await connection.init();
      }
      return connection.dataSource;
    }

    return null;
  },
};

export { getSqliteConnection };
