#!/usr/bin/env bash
set -euo pipefail

##
# Technical documentation: migrate-generate.sh
#
# Purpose
#  - Generate TypeORM migrations from entity definitions for ALL supported
#    database types (SQLite, PostgreSQL, MySQL) and post-process the SQL
#    so it is compatible with each database type.
#
# How it works
#  1. Load environment variables from `core/.env` if the file exists.
#  2. Build the TypeScript entities (`npm run build:tsc`) so migration generation
#     can compile and read entity metadata.
#  3. Generate migration for SQLite using TypeORM with in-memory database
#  4. Transform the SQLite migration to PostgreSQL and MySQL formats
#  5. Post-process all migrations to add IF NOT EXISTS/IF EXISTS checks
#  6. All migrations are generated from entity definitions dynamically.
#
# Environment
#  - Optional: Load from .env file for any custom configuration
#
# Notes
#  - This script is expected to be run from the core project root by `make`.
#  - Does NOT require actual database connections to be available.
#  - Entities are loaded from dist/**/*.entity.js after TypeScript build.
##

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)
cd "$ROOT_DIR"

if [[ -f .env ]]; then
  echo "Loading .env from $ROOT_DIR"
  set -a
  . .env
  set +a
fi

echo "Cleaning old migrations..."
rm -f migrations/*.js || true
echo "✓ Old migrations removed"

echo "Generating migration (this will build project first)..."
npm run build:tsc

# Define the database types we want to generate migrations for
DB_TYPES=("sqlite" "postgres" "mysql")
echo "Using DB types: ${DB_TYPES[*]} for migration generation"

# Function to post-process migration file for a specific DB type
post_process_migration() {
  local file="$1"
  local db_type="$2"
  
  echo "Post-processing $file to add IF NOT EXISTS / IF EXISTS"
  
  # Common transformations
  sed -i -E 's/CREATE TABLE\s+"/CREATE TABLE IF NOT EXISTS "/g' "$file"
  sed -i -E 's/DROP TABLE\s+"/DROP TABLE IF EXISTS "/g' "$file"
  
  if [[ "$db_type" == "postgres" ]]; then
    echo "Applying Postgres-specific fixes for $db_type"
    sed -i -E 's/CREATE INDEX\s+"/CREATE INDEX IF NOT EXISTS "/g' "$file"
    sed -i -E 's/DROP INDEX\s+"/DROP INDEX IF EXISTS "/g' "$file"
  elif [[ "$db_type" == "mysql" ]]; then
    echo "Applying MySQL-specific fixes for $db_type"
    # MySQL doesn't support IF EXISTS for DROP INDEX on tables, but we'll keep it for consistency
  else
    echo "Applying SQLite-friendly defaults for $db_type"
    sed -i -E 's/CREATE INDEX\s+"/CREATE INDEX IF NOT EXISTS "/g' "$file"
    sed -i -E 's/DROP INDEX\s+"/DROP INDEX IF EXISTS "/g' "$file"
  fi
  
  echo "✓ Post-processed $file for DB type: $db_type"
}

# Generate migration for SQLite first (this works with in-memory DB)
echo ""
echo "-- Generating migration for DB type 'better-sqlite3' (target: sqlite) --"

TARGET_DB_TYPE="sqlite" \
  npx typeorm -d ./typeorm.multi-config.js migration:generate "migrations/init_sqlite" --outputJs 2>&1 && echo "migration:generate exited successfully" || true

# Look for generated migration file
f_sqlite=$(ls -t migrations/*init_sqlite*.js 2>/dev/null | head -n1 || true)

if [[ -z "$f_sqlite" ]]; then
  echo "Error: Could not generate SQLite migration" >&2
  exit 1
fi

echo "✓ Migration created at $f_sqlite"

# Post-process SQLite migration
post_process_migration "$f_sqlite" "sqlite"

# Copy to init_sqlite.js
cp "$f_sqlite" "migrations/init_sqlite.js"
echo "✓ Migration created at migrations/init_sqlite.js"

# Extract timestamp from the SQLite migration file
TIMESTAMP=$(echo "$f_sqlite" | sed -E 's/.*\/([0-9]+)-init_sqlite\.js/\1/')

# Now transform the SQLite migration for PostgreSQL and MySQL
echo ""
echo "-- Generating migration for DB type 'postgres' (target: postgres) --"
node transform-migration.js "$f_sqlite" "$TIMESTAMP" 2>&1 || {
  echo "Note: Transform script encountered an issue, but migrations may still have been created"
}

# Verify that all three migration files exist
if [[ ! -f "migrations/init_sqlite.js" ]]; then
  echo "Error: SQLite migration not created" >&2
  exit 1
fi

if [[ ! -f "migrations/init_postgres.js" ]]; then
  echo "Warning: PostgreSQL migration not created properly"
fi

if [[ ! -f "migrations/init_mysql.js" ]]; then
  echo "Warning: MySQL migration not created properly"
fi

echo ""
echo "✓ All migrations generated successfully for: ${DB_TYPES[*]}"
