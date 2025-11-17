import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import 'tsconfig-paths/register';
dotenv.config();

// Determine which database to use
const usePostgres = process.env.CORE_DB_TYPE === 'postgres';

let options: DataSourceOptions;

if (usePostgres) {
  // PostgreSQL configuration
  options = {
    type: 'postgres',
    host: process.env.CORE_DB_HOST,
    port: Number(process.env.CORE_DB_PORT),
    username: process.env.CORE_DB_USER,
    password: process.env.CORE_DB_PASS,
    database: process.env.CORE_DB_NAME,
    entities: [path.join(__dirname, 'src/**/*.entity.ts')],
    migrations: ['migrations/*.ts'],
    synchronize: false,
    logging: true,
  };
} else {
  // SQLite configuration (default)
  options = {
    type: 'better-sqlite3',
    database: process.env.CORE_DB_PATH || 'database.sqlite',
    entities: [path.join(__dirname, 'src/**/*.entity.ts')],
    migrations: ['migrations/*.ts'],
    synchronize: false,
    logging: true,
  };
}

export default new DataSource(options);
