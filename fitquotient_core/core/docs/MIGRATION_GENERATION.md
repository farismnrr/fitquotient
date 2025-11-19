# Multi-Database Migration Generation

## Overview

The `migrate-generate.sh` script automatically generates TypeORM migrations for all three supported database types (SQLite, PostgreSQL, MySQL) in a single run, **without requiring actual database connections**.

## How It Works

### 1. Build TypeScript Entities
First, the script builds the TypeScript entity files to JavaScript:
```bash
npm run build:tsc
```

This compiles all entity files from `src/**/*.entity.ts` to `dist/**/*.entity.js`.

### 2. Generate SQLite Migration
The script generates a migration for SQLite using TypeORM's built-in migration generator with an in-memory database:

```bash
TARGET_DB_TYPE=sqlite npx typeorm -d ./typeorm.multi-config.js migration:generate
```

- Uses `:memory:` database (no file or server connection needed)
- TypeORM can introspect entities and generate CREATE TABLE statements
- This works because SQLite is embedded and doesn't require a server

### 3. Transform to Other Database Types
The generated SQLite migration is then transformed to PostgreSQL and MySQL formats using `transform-migration.js`:

- **PostgreSQL transformations**:
  - `datetime` → `TIMESTAMP`
  - `datetime('now')` → `now()`
  - `DEFAULT (1)` → `DEFAULT true` (for booleans)
  - `json` → `jsonb` (for better performance)
  - `bigint` → `BIGINT`

- **MySQL transformations**:
  - `datetime` → `DATETIME`
  - `datetime('now')` → `CURRENT_TIMESTAMP`
  - `bigint` → `BIGINT`
  - `float` → `FLOAT`
  - Keeps `DEFAULT (1)/(0)` for booleans

### 4. Post-Processing
Each migration file is post-processed to add safety checks:
- `CREATE TABLE` → `CREATE TABLE IF NOT EXISTS`
- `DROP TABLE` → `DROP TABLE IF EXISTS`
- `CREATE INDEX` → `CREATE INDEX IF NOT EXISTS`
- `DROP INDEX` → `DROP INDEX IF EXISTS`

## Usage

### Generate Migrations
```bash
# Using Make
make migrate-generate

# Or directly
bash migrate-generate.sh
```

### Generated Files
The script creates the following files in the `migrations/` directory:
- `<timestamp>-init_sqlite.js` - Timestamped SQLite migration
- `<timestamp>-init_postgres.js` - Timestamped PostgreSQL migration
- `<timestamp>-init_mysql.js` - Timestamped MySQL migration
- `init_sqlite.js` - Current SQLite migration
- `init_postgres.js` - Current PostgreSQL migration
- `init_mysql.js` - Current MySQL migration

### Run Migrations
```bash
# Using Make
make migrate-run

# Or directly
npm run migration:run
```

## Key Benefits

1. **No Database Connection Required**: Generate migrations without running database servers
2. **Single Command**: Generate for all database types at once
3. **Entity-Driven**: Migrations are automatically generated from TypeORM entity definitions
4. **Database-Specific SQL**: Each migration is optimized for its target database
5. **Safe Operations**: All DDL statements include IF EXISTS/IF NOT EXISTS checks

## Files Involved

- `migrate-generate.sh` - Main migration generation script
- `typeorm.multi-config.js` - TypeORM configuration for multiple database types
- `transform-migration.js` - SQL transformation utility for different databases
- `src/**/*.entity.ts` - Entity definitions (source of truth for schema)

## Entity to Migration Flow

```
┌─────────────────────────┐
│   Entity Files (.ts)    │
│  - user.entity.ts       │
│  - job.entity.ts        │
│  - llm-api-key.entity.ts│
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Build TypeScript      │
│   npm run build:tsc     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Generate SQLite        │
│  (in-memory DB)         │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Transform to           │
│  - PostgreSQL           │
│  - MySQL                │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Post-process           │
│  (add IF EXISTS, etc)   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Migration Files        │
│  - init_sqlite.js       │
│  - init_postgres.js     │
│  - init_mysql.js        │
└─────────────────────────┘
```

## Troubleshooting

### Build Errors
If you encounter TypeScript build errors:
```bash
npm run build:tsc
```
Fix any compilation errors in entity files before generating migrations.

### Migration Not Generated
If no migration file is created:
1. Check that entity files are in `src/**/*.entity.ts`
2. Verify entities are properly exported
3. Ensure entities have proper TypeORM decorators

### SQL Syntax Errors
If you encounter SQL syntax errors when running migrations:
1. Check the database-specific migration file
2. Verify the SQL transformations are appropriate for your database version
3. Test manually with a small subset of the SQL

## Advanced Usage

### Custom Transformations
To add custom SQL transformations, edit `transform-migration.js`:

```javascript
function transformToPostgres(sql) {
  let transformed = sql;
  // Add your custom transformations here
  return transformed;
}
```

### Different Database Configurations
To use different database connection settings, edit `typeorm.multi-config.js`:

```javascript
const configs = {
  postgres: new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    // ... your custom config
  }),
};
```

## Notes

- The `migrations/` directory is in `.gitignore` because migrations are generated from entities
- Each run generates new timestamped files plus copies to `init_<dbtype>.js`
- The script uses bash and requires Node.js to be installed
- Compatible with TypeORM 0.3.x
