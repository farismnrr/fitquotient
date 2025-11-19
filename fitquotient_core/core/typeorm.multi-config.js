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

const optionsBase = {
  entities: [path.join(__dirname, 'dist/**/*.entity.js')],
  migrations: [path.join(__dirname, 'migrations/*.js')],
  synchronize: false,
  logging: false, // Disable logging to reduce noise
};

// Create DataSource configurations for each database type
const configs = {
  sqlite: new DataSource({
    type: 'better-sqlite3',
    database: ':memory:', // Use in-memory database for generation
    ...optionsBase,
  }),
  postgres: new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    ...optionsBase,
  }),
  mysql: new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'mysql',
    ...optionsBase,
  }),
};

// Export the config for the specified database type
const dbType = process.env.TARGET_DB_TYPE || 'sqlite';
module.exports = configs[dbType];
