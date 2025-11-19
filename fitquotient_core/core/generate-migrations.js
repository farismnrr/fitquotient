#!/usr/bin/env node

/**
 * Generate TypeORM migrations for multiple databases without requiring database connections.
 * This script reads entity files dynamically from the dist folder and generates migration files.
 */

const fs = require('fs');
const path = require('path');
const { DataSource } = require('typeorm');

// Setup paths
require('reflect-metadata');
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

// Type mapping for different databases
const typeMapping = {
  sqlite: {
    uuid: 'varchar',
    varchar: 'varchar',
    text: 'text',
    datetime: 'datetime',
    timestamp: 'datetime',
    boolean: 'boolean',
    bigint: 'bigint',
    int: 'integer',
    float: 'real',
    'double precision': 'real',
    json: 'text',
    jsonb: 'text',
  },
  postgres: {
    uuid: 'uuid',
    varchar: 'varchar',
    text: 'text',
    datetime: 'timestamp',
    timestamp: 'timestamp',
    boolean: 'boolean',
    bigint: 'bigint',
    int: 'integer',
    integer: 'integer',
    float: 'double precision',
    real: 'double precision',
    json: 'jsonb',
    jsonb: 'jsonb',
  },
  mysql: {
    uuid: 'char(36)',
    varchar: 'varchar(255)',
    text: 'text',
    datetime: 'datetime',
    timestamp: 'datetime',
    boolean: 'tinyint',
    bigint: 'bigint',
    int: 'int',
    integer: 'int',
    float: 'float',
    real: 'float',
    'double precision': 'double',
    json: 'json',
    jsonb: 'json',
  },
};

function mapType(type, dbType) {
  // TypeORM may provide the column type as:
  // - a string (e.g. 'varchar')
  // - a constructor function (e.g. Boolean, Number, Date)
  // - an alias (e.g. 'int')
  let typeStr = 'varchar';

  if (typeof type === 'string') {
    typeStr = type.toLowerCase();
  } else if (typeof type === 'function') {
    const ctor = type && type.name ? type.name.toLowerCase() : 'varchar';
    // Map common JavaScript constructors to SQL types
    if (ctor === 'boolean') typeStr = 'boolean';
    else if (ctor === 'number') typeStr = 'int';
    else if (ctor === 'date') typeStr = 'timestamp';
    else if (ctor === 'string') typeStr = 'varchar';
    else typeStr = 'varchar';
  }

  return typeMapping[dbType][typeStr] || typeStr;
}

function formatDefault(value, col, dbType) {
  if (value === undefined || value === null) return null;

  // If TypeORM exposed a function, it often wraps database-specific defaults
  // like options.connection.driver.mappedDataTypes.createDateDefault
  if (typeof value === 'function') {
    const fn = value.toString();
    if (fn.includes('createDateDefault') || fn.includes('updateDateDefault')) {
      if (dbType === 'sqlite') return "(datetime('now'))";
      if (dbType === 'postgres') return 'now()';
      if (dbType === 'mysql') return 'CURRENT_TIMESTAMP';
    }
    // As a fallback try to stringify and handle the known tokens below
  }

  const valueStr = String(value);

  // Handle explicit timestamp-like defaults
  if (
    valueStr === 'CURRENT_TIMESTAMP' ||
    valueStr.includes('now()') ||
    valueStr.includes('datetime')
  ) {
    if (dbType === 'sqlite') return "(datetime('now'))";
    if (dbType === 'postgres') return 'now()';
    if (dbType === 'mysql') return 'CURRENT_TIMESTAMP';
  }

  // Booleans and numeric-like values
  if (value === true || value === 'true' || value === 1 || valueStr === '1') {
    if (dbType === 'sqlite' || dbType === 'mysql') return '1';
    if (dbType === 'postgres') return 'true';
  }

  if (value === false || value === 'false' || value === 0 || valueStr === '0') {
    if (dbType === 'sqlite' || dbType === 'mysql') return '0';
    if (dbType === 'postgres') return 'false';
  }

  // If the column is an enum or is string-like, wrap the default in quotes
  const isStringLike =
    (col && col.enum) ||
    (col &&
      typeof col.type === 'string' &&
      /(char|text|varchar|uuid)/i.test(col.type)) ||
    (col &&
      typeof col.type !== 'string' &&
      col.type &&
      col.type.name &&
      col.type.name.toLowerCase() === 'string');

  // If already quoted, just return it
  if (valueStr.startsWith("'") && valueStr.endsWith("'")) return valueStr;

  if (isStringLike) {
    // Escape existing single quotes
    const escaped = valueStr.replace(/'/g, "''");
    return `'${escaped}'`;
  }

  // Fallback: return raw string (numbers or unrecognized tokens)
  return valueStr;
}

async function getSchemaFromEntities(dbType) {
  const entities = [];
  const entitiesDir = path.join(__dirname, 'dist');

  // Find all entity files
  function findEntityFiles(dir) {
    const files = fs.readdirSync(dir);
    const result = [];

    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        result.push(...findEntityFiles(fullPath));
      } else if (file.endsWith('.entity.js')) {
        result.push(fullPath);
      }
    });

    return result;
  }

  const entityFiles = findEntityFiles(entitiesDir);
  console.log(`Found ${entityFiles.length} entity files for ${dbType}`);

  // Load entity classes
  entityFiles.forEach((file) => {
    try {
      const module = require(file);
      Object.keys(module).forEach((key) => {
        const exported = module[key];
        if (typeof exported === 'function') {
          const tableName = Reflect.getMetadata('typeorm:table_name', exported);
          if (tableName || exported.name.includes('Entity')) {
            entities.push(exported);
            console.log(`  - Loaded: ${exported.name}`);
          }
        }
      });
    } catch (err) {
      console.warn(`  ! Could not load ${file}: ${err.message}`);
    }
  });

  // Create temporary DataSource to get metadata
  const dataSource = new DataSource({
    type: dbType === 'sqlite' ? 'better-sqlite3' : dbType,
    database: dbType === 'sqlite' ? ':memory:' : 'temp_db',
    host: dbType !== 'sqlite' ? 'localhost' : undefined,
    port: dbType === 'postgres' ? 5432 : dbType === 'mysql' ? 3306 : undefined,
    username: dbType !== 'sqlite' ? 'temp' : undefined,
    password: dbType !== 'sqlite' ? 'temp' : undefined,
    entities: entities,
    synchronize: false,
    logging: false,
  });

  // We don't need to actually connect, just build metadata
  try {
    await dataSource.buildMetadatas();
  } catch (err) {
    console.log(`  Building metadata (connection not required)`);
  }

  return dataSource.entityMetadatas;
}

function generateCreateTableSQL(entity, dbType) {
  const lines = [];

  entity.columns.forEach((col) => {
    const parts = [`"${col.databaseName}"`];

    // Type
    let colType = mapType(col.type, dbType);
    parts.push(colType);

    // Nullable
    if (!col.isNullable) {
      parts.push('NOT NULL');
    }

    // Default
    if (col.default !== undefined && col.default !== null) {
      const defaultVal = formatDefault(col.default, col, dbType);
      if (defaultVal) {
        parts.push(`DEFAULT ${defaultVal}`);
      }
    }

    // If column is generated uuid in TypeORM metadata, add Postgres default
    if (
      dbType === 'postgres' &&
      col.isGenerated &&
      col.generationStrategy === 'uuid'
    ) {
      // prefer uuid_generate_v4() from uuid-ossp
      parts.push('DEFAULT uuid_generate_v4()');
      needsUuidExtension = true;
    }

    // Primary key
    if (col.isPrimary) {
      parts.push('PRIMARY KEY');
    }

    // Unique
    if (col.isUnique && !col.isPrimary) {
      parts.push('UNIQUE');
    }

    lines.push('            ' + parts.join(' '));
  });

  return lines.join(',\n');
}

function generateCreateIndexSQL(tableName, index, dbType) {
  const uniqueStr = index.isUnique ? 'UNIQUE ' : '';
  const columns = index.columns.map((c) => `"${c.databaseName}"`).join(', ');
  const indexName =
    index.name ||
    `IDX_${tableName}_${index.columns.map((c) => c.databaseName).join('_')}`;
  return `        await queryRunner.query(\`CREATE ${uniqueStr}INDEX IF NOT EXISTS "${indexName}" ON "${tableName}" (${columns})\`);`;
}

function generateForeignKeySQL(tableName, fk, dbType) {
  if (dbType === 'sqlite') {
    return null; // SQLite handles FKs in CREATE TABLE
  }

  const columnNames = fk.columnNames.map((c) => `"${c}"`).join(', ');
  const refColumns = fk.referencedColumnNames.map((c) => `"${c}"`).join(', ');
  // referencedTableName may be undefined when metadata lacks resolved table names
  // (buildMetadatas may be run without an active connection). Use referenced
  // entity metadata when available as a fallback.
  const refTable =
    fk.referencedTableName ||
    (fk.referencedEntityMetadata && fk.referencedEntityMetadata.tableName) ||
    fk.referencedTableName;
  const onDelete = fk.onDelete ? ` ON DELETE ${fk.onDelete}` : '';
  const onUpdate = fk.onUpdate ? ` ON UPDATE ${fk.onUpdate}` : '';

  return `        await queryRunner.query(\`ALTER TABLE "${tableName}" ADD CONSTRAINT "${fk.name}" FOREIGN KEY (${columnNames}) REFERENCES "${refTable}" (${refColumns})${onDelete}${onUpdate}\`);`;
}

async function generateMigration(dbType) {
  console.log(`\nGenerating migration for ${dbType}...`);

  const entityMetadatas = await getSchemaFromEntities(dbType);
  const timestamp = Date.now();
  const className = `Init${timestamp}`;

  const upQueries = [];
  const downQueries = [];
  let needsUuidExtension = false;

  // Sort entities to handle dependencies (FK constraints)
  const sortedEntities = [...entityMetadatas].sort((a, b) => {
    const aHasFk = a.foreignKeys.length > 0;
    const bHasFk = b.foreignKeys.length > 0;
    if (aHasFk && !bHasFk) return 1;
    if (!aHasFk && bHasFk) return -1;
    return 0;
  });

  // Create tables
  sortedEntities.forEach((entity) => {
    const tableName = entity.tableName;
    const createTableSQL = generateCreateTableSQL(entity, dbType);
    const createQuery = `        await queryRunner.query(\`CREATE TABLE IF NOT EXISTS "${tableName}" (\n${createTableSQL}\n        )\`);`;
    upQueries.push(createQuery);

    // Create indexes
    entity.indices.forEach((index) => {
      const indexSQL = generateCreateIndexSQL(tableName, index, dbType);
      if (indexSQL) upQueries.push(indexSQL);
    });

    // Create foreign keys
    if (dbType !== 'sqlite') {
      entity.foreignKeys.forEach((fk) => {
        const fkSQL = generateForeignKeySQL(tableName, fk, dbType);
        if (fkSQL) upQueries.push(fkSQL);
      });
    }

    // Drop for down migration
    downQueries.unshift(
      `        await queryRunner.query(\`DROP TABLE IF EXISTS "${tableName}"\`);`,
    );
  });

  // If any column required uuid extension for Postgres, add it before table creation
  if (dbType === 'postgres' && needsUuidExtension) {
    upQueries.unshift(
      `        await queryRunner.query(\`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"\`);`,
    );
  }

  const migrationContent = `const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class ${className} {
    name = '${className}'

    async up(queryRunner) {
${upQueries.join('\n')}
    }

    async down(queryRunner) {
${downQueries.join('\n')}
    }
}
`;

  return migrationContent;
}

// Main execution
async function main() {
  const migrationsDir = path.join(__dirname, 'migrations');

  // Ensure migrations directory exists
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }

  // Generate migrations for each database type
  const dbTypes = [
    { type: 'sqlite', filename: 'init_sqlite.js' },
    { type: 'postgres', filename: 'init_postgres.js' },
    { type: 'mysql', filename: 'init_mysql.js' },
  ];

  for (const { type, filename } of dbTypes) {
    try {
      const content = await generateMigration(type);
      const filepath = path.join(migrationsDir, filename);
      fs.writeFileSync(filepath, content);
      console.log(`✓ Created ${filepath}`);
    } catch (err) {
      console.error(`Error generating migration for ${type}:`, err.message);
    }
  }

  console.log('\n✓ All migrations generated successfully!');
  console.log('  - migrations/init_sqlite.js');
  console.log('  - migrations/init_postgres.js');
  console.log('  - migrations/init_mysql.js');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
