#!/usr/bin/env bash
set -euo pipefail

##
# Technical documentation: migrate-generate.sh
#
# Purpose
#  - Generate TypeORM migrations from entity definitions and post-process the
#    SQL so it is compatible with the configured database type.
#
# How it works
#  1. Load environment variables from `core/.env` if the file exists. This
#     ensures `CORE_DB_TYPE` and all DB connection variables are available to
#     TypeORM and the script.
#  2. If `migrations/init.js` already exists, post-process it for the configured
#     DB type and exit. Otherwise, generate a new migration.
#  3. Build the TypeScript entities (`npm run build:tsc`) so migration generation
#     can compile and read entity metadata.
#  4. Use `npx typeorm migration:generate` with `CORE_DB_TYPE` to produce a
#     migration file. The script will not create temporary DB instances here —
#     it relies on the configured database connection being available.
#  5. Post-process the generated SQL in `migrations/init.js` to add `IF NOT
#     EXISTS` checks and to adapt SQL to Postgres/MySQL/SQLite as needed.
#
# Environment
#  - CORE_DB_TYPE: 'postgres' | 'mysql' | 'mariadb' | 'better-sqlite3'
#  - For postgres: CORE_DB_HOST, CORE_DB_PORT, CORE_DB_USER, CORE_DB_PASS,
#    CORE_DB_NAME
#  - For sqlite: CORE_DB_PATH
#
# Notes
#  - This script is expected to be run from the core project root by `make`.
#  - The `core/typeorm.config.js` file determines how env values map to
#    TypeORM options; ensure they match your environment variables.
##

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)
cd "$ROOT_DIR"

if [[ -f .env ]]; then
  echo "Loading .env from $ROOT_DIR"
  set -a
  . .env
  set +a
fi

if [[ -f migrations/init.js ]]; then
  echo "Found external migrations/init.js — post-processing only"
  file="migrations/init.js"

  DB_TYPE="${CORE_DB_TYPE:-better-sqlite3}"
  DB_TYPE_LOWER=$(echo "$DB_TYPE" | tr '[:upper:]' '[:lower:]')

  sed -i -E 's/CREATE TABLE\s+"/CREATE TABLE IF NOT EXISTS "/g' "$file"
  sed -i -E 's/DROP TABLE\s+"/DROP TABLE IF EXISTS "/g' "$file"

  if [[ "$DB_TYPE_LOWER" == "postgres" ]]; then
    echo "Applying Postgres-specific fixes"
    sed -i -E 's/CREATE INDEX\s+"/CREATE INDEX IF NOT EXISTS "/g' "$file"
    sed -i -E "s/DEFAULT \(datetime\('now'\)\)/DEFAULT now()/g" "$file"
    sed -i -E "s/ datetime NOT NULL DEFAULT \(datetime\('now'\)\)/ TIMESTAMP NOT NULL DEFAULT now()/g" "$file"
    sed -i -E "s/ datetime NOT NULL/ TIMESTAMP NOT NULL/g" "$file"
    sed -i -E "s/ datetime/ TIMESTAMP/g" "$file"
    sed -i -E "s/boolean NOT NULL DEFAULT \(1\)/boolean NOT NULL DEFAULT true/g" "$file"
    sed -i -E "s/boolean NOT NULL DEFAULT \(0\)/boolean NOT NULL DEFAULT false/g" "$file"
    sed -i -E "s/DEFAULT \(([0-9]+)\)/DEFAULT \1/g" "$file"
    sed -i -E "s/\bjson\b/jsonb/g" "$file"

  elif [[ "$DB_TYPE_LOWER" == "mysql" || "$DB_TYPE_LOWER" == "mariadb" ]]; then
    echo "Applying MySQL-specific fixes"
    sed -i -E "s/DEFAULT \(datetime\('now'\)\)/DEFAULT CURRENT_TIMESTAMP/g" "$file"
    sed -i -E "s/DEFAULT \(datetime\('now'\)\)/DEFAULT CURRENT_TIMESTAMP/g" "$file"
    sed -i -E "s/ datetime NOT NULL DEFAULT \(datetime\('now'\)\)/ DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP/g" "$file"
    sed -i -E "s/ datetime NOT NULL/ DATETIME NOT NULL/g" "$file"
    sed -i -E "s/ datetime/ DATETIME/g" "$file"
    sed -i -E "s/boolean NOT NULL DEFAULT \(1\)/boolean NOT NULL DEFAULT 1/g" "$file"
    sed -i -E "s/boolean NOT NULL DEFAULT \(0\)/boolean NOT NULL DEFAULT 0/g" "$file"
    sed -i -E "s/DEFAULT \(([0-9]+)\)/DEFAULT \1/g" "$file"
    sed -i -E "s/\bjsonb\b/json/g" "$file"

  else
    echo "Applying SQLite-friendly defaults"
    sed -i -E 's/CREATE INDEX\s+"/CREATE INDEX IF NOT EXISTS "/g' "$file"
    sed -i -E "s/DEFAULT \(datetime\('now'\)\)/DEFAULT (datetime('now'))/g" "$file"
    sed -i -E "s/ datetime NOT NULL DEFAULT \(datetime\('now'\)\)/ datetime NOT NULL DEFAULT (datetime('now'))/g" "$file"
    sed -i -E "s/boolean NOT NULL DEFAULT \(1\)/boolean NOT NULL DEFAULT 1/g" "$file"
    sed -i -E "s/boolean NOT NULL DEFAULT \(0\)/boolean NOT NULL DEFAULT 0/g" "$file"
    sed -i -E "s/\bjsonb\b/json/g" "$file"
  fi

  echo "✓ Post-processed $file for DB type: $DB_TYPE_LOWER"
  exit 0
fi

echo "Cleaning old migrations..."
rm -f migrations/*.js || true
echo "✓ Old migrations removed"

echo "Generating migration (this will build project first)..."
npm run build:tsc

declare -A GEN_DB_MAP=( [postgres]=postgres [mysql]=mysql [sqlite]=better-sqlite3 )

echo "Using DB types: ${!GEN_DB_MAP[@]} for migration generation"

for TARGET in "${!GEN_DB_MAP[@]}"; do
  DB_TYPE="${GEN_DB_MAP[$TARGET]}"
  echo "\n-- Generating migration for DB type '$DB_TYPE' (target: $TARGET) --"

  CORE_DB_TYPE="$DB_TYPE" \
    npx typeorm -d ./typeorm.config.js migration:generate "migrations/init_${TARGET}" --outputJs && echo "migration:generate exited successfully for $TARGET" || true

  f_any=$(ls -t migrations/*init_${TARGET}*.js 2>/dev/null || true | head -n1 || true)
  if [[ -z "$f_any" ]]; then
    echo "No generated migration file found from typeorm for $TARGET; creating empty JS migration skeleton..."
    ts_skel=$(date +%s)
    file="migrations/${ts_skel}-init_${TARGET}.js"
    printf '%s\n' \
      'import { MigrationInterface, QueryRunner } from "typeorm";' '' \
      "export class Init${ts_skel} implements MigrationInterface {" '' \
      '    public async up(queryRunner: QueryRunner): Promise<void> {' \
      '    }' '' \
      '    public async down(queryRunner: QueryRunner): Promise<void> {' \
      '    }' '' \
      '}' > "$file"
    echo "✓ Created $file"
  fi

  f_js=$(ls -t migrations/*init_${TARGET}*.js 2>/dev/null || true | head -n1 || true)
  if [[ -n "$f_js" ]]; then
    mv "$f_js" "migrations/init_${TARGET}.js"
    echo "✓ Migration created at migrations/init_${TARGET}.js"
    file="migrations/init_${TARGET}.js"
    echo "Post-processing $file to add IF NOT EXISTS / IF EXISTS"
    sed -i -E 's/CREATE TABLE\s+"/CREATE TABLE IF NOT EXISTS "/g' "$file"
    sed -i -E 's/CREATE INDEX\s+"/CREATE INDEX IF NOT EXISTS "/g' "$file"
    sed -i -E 's/DROP TABLE\s+"/DROP TABLE IF EXISTS "/g' "$file"
    sed -i -E 's/DROP INDEX\s+"/DROP INDEX IF EXISTS "/g' "$file"

    DB_TYPE_LOWER=$(echo "$DB_TYPE" | tr '[:upper:]' '[:lower:]')
    if [[ "$DB_TYPE_LOWER" == "postgres" ]]; then
      echo "Applying Postgres-specific fixes for $TARGET"
      sed -i -E 's/CREATE INDEX\s+"/CREATE INDEX IF NOT EXISTS "/g' "$file"
      sed -i -E "s/DEFAULT \(datetime\('now'\)\)/DEFAULT now()/g" "$file"
      sed -i -E "s/ datetime NOT NULL DEFAULT \(datetime\('now'\)\)/ TIMESTAMP NOT NULL DEFAULT now()/g" "$file"
      sed -i -E "s/ datetime NOT NULL/ TIMESTAMP NOT NULL/g" "$file"
      sed -i -E "s/ datetime/ TIMESTAMP/g" "$file"
      sed -i -E "s/boolean NOT NULL DEFAULT \(1\)/boolean NOT NULL DEFAULT true/g" "$file"
      sed -i -E "s/boolean NOT NULL DEFAULT \(0\)/boolean NOT NULL DEFAULT false/g" "$file"
      sed -i -E "s/DEFAULT \(([0-9]+)\)/DEFAULT \1/g" "$file"
      sed -i -E "s/\bjson\b/jsonb/g" "$file"

    elif [[ "$DB_TYPE_LOWER" == "mysql" || "$DB_TYPE_LOWER" == "mariadb" ]]; then
      echo "Applying MySQL-specific fixes for $TARGET"
      sed -i -E "s/DEFAULT \(datetime\('now'\)\)/DEFAULT CURRENT_TIMESTAMP/g" "$file"
      sed -i -E "s/DEFAULT \(datetime\('now'\)\)/DEFAULT CURRENT_TIMESTAMP/g" "$file"
      sed -i -E "s/ datetime NOT NULL DEFAULT \(datetime\('now'\)\)/ DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP/g" "$file"
      sed -i -E "s/ datetime NOT NULL/ DATETIME NOT NULL/g" "$file"
      sed -i -E "s/ datetime/ DATETIME/g" "$file"
      sed -i -E "s/boolean NOT NULL DEFAULT \(1\)/boolean NOT NULL DEFAULT 1/g" "$file"
      sed -i -E "s/boolean NOT NULL DEFAULT \(0\)/boolean NOT NULL DEFAULT 0/g" "$file"
      sed -i -E "s/DEFAULT \(([0-9]+)\)/DEFAULT \1/g" "$file"
      sed -i -E "s/\bjsonb\b/json/g" "$file"

    else
      echo "Applying SQLite-friendly defaults for $TARGET"
      sed -i -E 's/CREATE INDEX\s+"/CREATE INDEX IF NOT EXISTS "/g' "$file"
      sed -i -E "s/DEFAULT \(datetime\('now'\)\)/DEFAULT (datetime('now'))/g" "$file"
      sed -i -E "s/ datetime NOT NULL DEFAULT \(datetime\('now'\)\)/ datetime NOT NULL DEFAULT (datetime('now'))/g" "$file"
      sed -i -E "s/boolean NOT NULL DEFAULT \(1\)/boolean NOT NULL DEFAULT 1/g" "$file"
      sed -i -E "s/boolean NOT NULL DEFAULT \(0\)/boolean NOT NULL DEFAULT 0/g" "$file"
      sed -i -E "s/\bjsonb\b/json/g" "$file"
    fi

    echo "✓ Post-processed $file for DB type: $DB_TYPE"
  fi
done
exit 0

f_ts=$(ls -t migrations/*init*.ts 2>/dev/null || true | head -n1 || true)
if [[ -n "$f_ts" ]]; then
  echo "Found .ts migration; building project to generate JS..."
  npm run build
  f_dist=$(ls -t dist/migrations/*init*.js 2>/dev/null || true | head -n1 || true)
  if [[ -n "$f_dist" ]]; then
    cp "$f_dist" migrations/init.js
    echo "✓ Migration created at migrations/init.js (from dist)"
    file="migrations/init.js"
    echo "Post-processing $file to add IF NOT EXISTS / IF EXISTS"
    sed -i -E 's/CREATE TABLE\s+"/CREATE TABLE IF NOT EXISTS "/g' "$file"
    sed -i -E 's/CREATE INDEX\s+"/CREATE INDEX IF NOT EXISTS "/g' "$file"
    sed -i -E 's/DROP TABLE\s+"/DROP TABLE IF EXISTS "/g' "$file"
    sed -i -E 's/DROP INDEX\s+"/DROP INDEX IF EXISTS "/g' "$file"
    echo "✓ Post-processed $file"
    exit 0
  else
    echo "Error: built migration not found in dist/migrations" >&2
    exit 1
  fi
fi

echo "Error: no generated migration file found" >&2
exit 1
