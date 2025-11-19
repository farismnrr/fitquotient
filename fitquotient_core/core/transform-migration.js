/**
 * Transform SQLite migration to PostgreSQL and MySQL migrations
 * 
 * This script reads the generated SQLite migration and transforms it
 * to be compatible with PostgreSQL and MySQL databases.
 */

const fs = require('fs');
const path = require('path');

/**
 * Transform SQLite SQL to PostgreSQL SQL
 */
function transformToPostgres(sql) {
  let transformed = sql;
  
  // Transform datetime to TIMESTAMP
  transformed = transformed.replace(/\s+datetime\s+/gi, ' TIMESTAMP ');
  transformed = transformed.replace(/\s+datetime,/gi, ' TIMESTAMP,');
  transformed = transformed.replace(/\s+datetime\)/gi, ' TIMESTAMP)');
  transformed = transformed.replace(/datetime\('now'\)/g, "now()");
  transformed = transformed.replace(/DEFAULT \(now\(\)\)/g, "DEFAULT now()");
  
  // Transform boolean defaults - handle parentheses
  transformed = transformed.replace(/DEFAULT \(1\)/g, "DEFAULT true");
  transformed = transformed.replace(/DEFAULT \(0\)/g, "DEFAULT false");
  transformed = transformed.replace(/DEFAULT 1/g, "DEFAULT true");
  transformed = transformed.replace(/DEFAULT 0/g, "DEFAULT false");
  
  // Transform json to jsonb for better performance
  transformed = transformed.replace(/\s+json\s+/gi, ' jsonb ');
  transformed = transformed.replace(/\s+json,/gi, ' jsonb,');
  transformed = transformed.replace(/\s+json\)/gi, ' jsonb)');
  
  // Transform bigint to BIGINT
  transformed = transformed.replace(/\s+bigint\s+/gi, ' BIGINT ');
  transformed = transformed.replace(/\s+bigint,/gi, ' BIGINT,');
  
  // Transform float to FLOAT
  transformed = transformed.replace(/\s+float\s+/gi, ' FLOAT ');
  transformed = transformed.replace(/\s+float,/gi, ' FLOAT,');
  
  // Remove SQLite-specific temporary table operations (these are not needed for Postgres)
  // Keep foreign key constraints but remove the temporary table dance
  
  return transformed;
}

/**
 * Transform SQLite SQL to MySQL SQL
 */
function transformToMySQL(sql) {
  let transformed = sql;
  
  // Transform datetime to DATETIME
  transformed = transformed.replace(/\s+datetime\s+/gi, ' DATETIME ');
  transformed = transformed.replace(/\s+datetime,/gi, ' DATETIME,');
  transformed = transformed.replace(/\s+datetime\)/gi, ' DATETIME)');
  transformed = transformed.replace(/datetime\('now'\)/g, "CURRENT_TIMESTAMP");
  transformed = transformed.replace(/DEFAULT \(CURRENT_TIMESTAMP\)/g, "DEFAULT CURRENT_TIMESTAMP");
  
  // Boolean defaults remain as 1 and 0 for MySQL (with parentheses)
  // Keep the parentheses for consistency with TypeORM
  
  // Transform jsonb back to json for MySQL
  transformed = transformed.replace(/\s+jsonb\s+/gi, ' json ');
  transformed = transformed.replace(/\s+jsonb,/gi, ' json,');
  transformed = transformed.replace(/\s+jsonb\)/gi, ' json)');
  
  // Transform bigint to BIGINT for MySQL
  transformed = transformed.replace(/\s+bigint\s+/gi, ' BIGINT ');
  transformed = transformed.replace(/\s+bigint,/gi, ' BIGINT,');
  
  // Transform float to FLOAT for MySQL
  transformed = transformed.replace(/\s+float\s+/gi, ' FLOAT ');
  transformed = transformed.replace(/\s+float,/gi, ' FLOAT,');
  
  // Remove SQLite-specific temporary table operations (not needed for MySQL)
  
  return transformed;
}

/**
 * Parse migration file and extract queries
 */
function parseMigrationFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract up queries
  const upMatch = content.match(/async up\([^)]+\)\s*{([^}]+(?:{[^}]+}[^}]+)*?)}/s);
  const downMatch = content.match(/async down\([^)]+\)\s*{([^}]+(?:{[^}]+}[^}]+)*?)}/s);
  
  if (!upMatch || !downMatch) {
    throw new Error('Could not parse migration file');
  }
  
  const upBody = upMatch[1];
  const downBody = downMatch[1];
  
  // Extract query strings
  const queryRegex = /await queryRunner\.query\(`([^`]+)`\)/g;
  
  const upQueries = [];
  let match;
  while ((match = queryRegex.exec(upBody)) !== null) {
    upQueries.push(match[1]);
  }
  
  queryRegex.lastIndex = 0;
  const downQueries = [];
  while ((match = queryRegex.exec(downBody)) !== null) {
    downQueries.push(match[1]);
  }
  
  return { upQueries, downQueries };
}

/**
 * Generate migration file for a specific database type
 */
function generateMigrationFile(dbType, timestamp, queries, transformer) {
  const { upQueries, downQueries } = queries;
  
  // Transform queries
  const transformedUpQueries = upQueries.map(transformer);
  const transformedDownQueries = downQueries.map(transformer);
  
  const className = `Init${timestamp}`;
  const fileName = `migrations/${timestamp}-init_${dbType}.js`;
  
  // Format queries for the migration file
  const formattedUpQueries = transformedUpQueries
    .map(q => `        await queryRunner.query(\`${q}\`);`)
    .join('\n');
  
  const formattedDownQueries = transformedDownQueries
    .map(q => `        await queryRunner.query(\`${q}\`);`)
    .join('\n');
  
  const content = `/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Init${dbType.charAt(0).toUpperCase() + dbType.slice(1)}${timestamp} {
    name = 'Init${dbType.charAt(0).toUpperCase() + dbType.slice(1)}${timestamp}'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
${formattedUpQueries}
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
${formattedDownQueries}
    }
}
`;
  
  fs.writeFileSync(fileName, content);
  console.log(`✓ Created ${fileName}`);
  
  return fileName;
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const sqliteFile = args[0] || 'migrations/init_sqlite.js';
  const timestamp = args[1] || Date.now().toString();
  
  if (!fs.existsSync(sqliteFile)) {
    console.error(`SQLite migration file not found: ${sqliteFile}`);
    process.exit(1);
  }
  
  console.log(`Reading SQLite migration from ${sqliteFile}...`);
  const queries = parseMigrationFile(sqliteFile);
  
  console.log(`Found ${queries.upQueries.length} up queries and ${queries.downQueries.length} down queries`);
  
  // Generate PostgreSQL migration
  console.log('\nGenerating PostgreSQL migration...');
  const postgresFile = generateMigrationFile('postgres', timestamp, queries, transformToPostgres);
  fs.copyFileSync(postgresFile, 'migrations/init_postgres.js');
  console.log('✓ Copied to migrations/init_postgres.js');
  
  // Generate MySQL migration
  console.log('\nGenerating MySQL migration...');
  const mysqlFile = generateMigrationFile('mysql', timestamp, queries, transformToMySQL);
  fs.copyFileSync(mysqlFile, 'migrations/init_mysql.js');
  console.log('✓ Copied to migrations/init_mysql.js');
  
  console.log('\n✓ All migrations generated successfully');
}

main();
