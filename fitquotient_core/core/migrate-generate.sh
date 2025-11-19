#!/usr/bin/env bash
set -euo pipefail

##
# Technical documentation: migrate-generate.sh
#
# Purpose
#  - Generate TypeORM migrations from entity definitions for multiple database types
#    (SQLite, Postgres, MySQL) without requiring active database connections.
#
# How it works
#  1. Load environment variables from `.env` if the file exists.
#  2. Build TypeScript entities to JavaScript.
#  3. Run the Node.js migration generator script that reads entity metadata
#     and generates migration files for all three database types.
#  4. Generate three separate migration files:
#     - migrations/init_sqlite.js
#     - migrations/init_postgres.js
#     - migrations/init_mysql.js
#
# Notes
#  - This script is expected to be run from the core project root by `make`.
#  - No external database connection is required.
#  - Migrations are generated purely from entity metadata.
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
rm -f migrations/init_*.js || true
echo "✓ Old migrations removed"

echo ""
echo "Building TypeScript entities..."
npm run build:tsc

echo ""
echo "Generating migrations for all database types..."
node generate-migrations.js

echo ""
echo "✓ Migration generation complete!"
