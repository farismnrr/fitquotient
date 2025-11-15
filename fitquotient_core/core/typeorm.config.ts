import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

// Determine which database to use
const usePostgres = process.env.DB_TYPE === 'postgres';

let options: DataSourceOptions;

if (usePostgres) {
  // PostgreSQL configuration
  options = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: ['src/**/*.entity.ts'],
    migrations: ['migrations/*.ts'],
    synchronize: false,
    logging: true,
  };
} else {
  // SQLite configuration (default)
  options = {
    type: 'better-sqlite3',
    database: process.env.DB_PATH || 'database.sqlite',
    entities: ['src/**/*.entity.ts'],
    migrations: ['migrations/*.ts'],
    synchronize: false,
    logging: true,
  };
}

export default new DataSource(options);
