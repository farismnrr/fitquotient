require('reflect-metadata');
const { DataSource } = require('typeorm');
const dotenv = require('dotenv');
const path = require('path');

const tsconfigPaths = require('tsconfig-paths');
const baseUrl = path.join(__dirname, '.');
tsconfigPaths.register({
  baseUrl,
  paths: {
    '@common/*': ['dist/Common/*', 'src/Common/*'],
    '@users/*': ['dist/Users/*', 'src/Users/*'],
    '@llm/*': ['dist/Llms/*', 'src/Llms/*'],
    '@jobs/*': ['dist/Jobs/*', 'src/Jobs/*'],
  },
});
dotenv.config();

const dbType = process.env.CORE_DB_TYPE || 'better-sqlite3';
// Map DataSource `type` to migration file suffix (sqlite migrations are named init_sqlite.js)
const migrationSuffix =
  dbType === 'postgres' ? 'postgres' : dbType === 'mysql' ? 'mysql' : 'sqlite';

const optionsBase = {
  entities: [path.join(__dirname, 'dist/**/*.entity.js')],
  // NOTE: Only include the migration file that matches CORE_DB_TYPE so the
  // runtime won't attempt to execute migrations for other DB engines (e.g.,
  // sqlite SQL in Postgres). The generator still creates all three files.
  migrations: [path.join(__dirname, `migrations/init_${migrationSuffix}.js`)],
  synchronize: false,
  logging: true,
  // For migration generation without active connection
  migrationsRun: false,
};

let options;

if (dbType === 'postgres') {
  options = {
    type: 'postgres',
    host: process.env.CORE_DB_HOST || 'localhost',
    port: Number(process.env.CORE_DB_PORT) || 5432,
    username: process.env.CORE_DB_USER || 'postgres',
    password: process.env.CORE_DB_PASS || '',
    database: process.env.CORE_DB_NAME || 'fitquotient',
    ...optionsBase,
  };
} else if (dbType === 'mysql') {
  options = {
    type: 'mysql',
    host: process.env.CORE_DB_HOST || 'localhost',
    port: Number(process.env.CORE_DB_PORT) || 3306,
    username: process.env.CORE_DB_USER || 'root',
    password: process.env.CORE_DB_PASS || '',
    database: process.env.CORE_DB_NAME || 'fitquotient',
    ...optionsBase,
  };
} else {
  // Default to SQLite (better-sqlite3)
  options = {
    type: 'better-sqlite3',
    database: process.env.CORE_DB_PATH || ':memory:',
    ...optionsBase,
  };
}

module.exports = new DataSource(options);
