import { MysqlConnection } from '../infrastructure';
import { log } from '../utilities';

let mysqlConnection: MysqlConnection | null = null;

const getMysqlConnection = (): MysqlConnection => {
  if (!mysqlConnection) {
    mysqlConnection = new MysqlConnection();
  }
  return mysqlConnection;
};

export const mysqlProvider = {
  provide: 'MYSQL_CONNECTION',
  useFactory: async () => {
    const dbType = process.env.CORE_DB_TYPE?.toLowerCase();

    // Only initialize MySQL if it's the selected database
    if (dbType === 'mysql') {
      const connection = getMysqlConnection();

      if (!connection.dataSource || !connection.dataSource.isInitialized) {
        log.info('Initializing MySQL connection...');
        await connection.init();
      }
      return connection.dataSource;
    }

    return null;
  },
};

export { getMysqlConnection };
