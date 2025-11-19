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

const usePostgres = process.env.CORE_DB_TYPE === 'postgres';
const optionsBase = {
  entities: [path.join(__dirname, 'dist/**/*.entity.js')],
  migrations: [path.join(__dirname, 'migrations/*.js')],
  synchronize: false,
  logging: true,
};

let options;

if (usePostgres) {
  options = {
    type: 'postgres',
    host: process.env.CORE_DB_HOST,
    port: Number(process.env.CORE_DB_PORT),
    username: process.env.CORE_DB_USER,
    password: process.env.CORE_DB_PASS,
    database: process.env.CORE_DB_NAME,
    ...optionsBase,
  };
} else {
  options = {
    type: 'better-sqlite3',
    database: process.env.CORE_DB_PATH || 'database.sqlite',
    ...optionsBase,
  };
}

module.exports = new DataSource(options);
