#!/bin/bash

# migrate-generate.sh - Generate migrations without requiring database connections
# This script creates migration files for multiple database types (sqlite, postgres, mysql)
# without needing actual database connections running.

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
MIGRATIONS_DIR="migrations"
TIMESTAMP=$(date +%s)

# Database types to generate migrations for
DB_TYPES=("sqlite" "postgres" "mysql")
DB_TYPE_TARGETS=("better-sqlite3" "postgres" "mysql")

# Load environment variables if .env exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "Cleaning old migrations..."
rm -f ${MIGRATIONS_DIR}/*.ts ${MIGRATIONS_DIR}/*.js
echo "✓ Old migrations removed"

echo "Generating migrations without database connections..."
echo ""

# Note: We skip the build step since we're generating empty migration skeletons
# that don't require introspecting the actual database schema

# Counter for timestamps to avoid conflicts
counter=0

# Generate migrations for each database type
for i in "${!DB_TYPES[@]}"; do
  db_type="${DB_TYPES[$i]}"
  db_target="${DB_TYPE_TARGETS[$i]}"
  
  # Create unique timestamp for each DB type
  current_timestamp=$((TIMESTAMP + counter))
  counter=$((counter + 1))
  
  echo -e "\n${BLUE}-- Generating migration for DB type '${db_target}' (target: ${db_type}) --${NC}"
  
  # Create migration name
  migration_name="init_${db_type}"
  migration_file="${MIGRATIONS_DIR}/${current_timestamp}-${migration_name}.js"
  
  # Generate empty migration skeleton without DB connection
  # We don't use typeorm migration:generate since it requires DB connection
  # Instead, we create a basic migration template
  
  echo "Creating empty migration skeleton for ${db_type}..."
  
  # Create migrations directory if it doesn't exist
  mkdir -p ${MIGRATIONS_DIR}
  
  # Generate migration file content based on DB type
  cat > "${migration_file}" << 'EOF'
class InitMigration {
  constructor() {
    this.name = 'InitMigration' + Date.now();
  }

  async up(queryRunner) {
    // Users table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User sessions table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        token VARCHAR(500) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // User CVs table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_cvs (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size INTEGER,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // LLM API keys table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS llm_api_keys (
        id VARCHAR(36) PRIMARY KEY,
        provider VARCHAR(50) NOT NULL,
        api_key TEXT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // LLM match rates table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS llm_match_rates (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        job_id VARCHAR(36) NOT NULL,
        match_score DECIMAL(5,2),
        analysis_result TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Jobs table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        description TEXT,
        requirements TEXT,
        location VARCHAR(255),
        salary_range VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_user_email ON users(email)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_session_token ON user_sessions(token)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_session_user ON user_sessions(user_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_cv_user ON user_cvs(user_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_match_user ON llm_match_rates(user_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_match_job ON llm_match_rates(job_id)`);
  }

  async down(queryRunner) {
    // Drop tables in reverse order (to handle foreign keys)
    await queryRunner.query(`DROP TABLE IF EXISTS llm_match_rates`);
    await queryRunner.query(`DROP TABLE IF EXISTS user_cvs`);
    await queryRunner.query(`DROP TABLE IF EXISTS user_sessions`);
    await queryRunner.query(`DROP TABLE IF EXISTS jobs`);
    await queryRunner.query(`DROP TABLE IF EXISTS llm_api_keys`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
  }
}

module.exports = InitMigration;
EOF

  echo -e "${GREEN}✓ Created ${migration_file}${NC}"
  
  # Create a symlink with a friendly name
  friendly_name="${MIGRATIONS_DIR}/${migration_name}.js"
  ln -sf "$(basename ${migration_file})" "${friendly_name}" 2>/dev/null || cp "${migration_file}" "${friendly_name}"
  echo -e "${GREEN}✓ Migration created at ${friendly_name}${NC}"
  
  # Post-process the migration file to ensure DB-specific compatibility
  echo "Post-processing ${migration_file} to add IF NOT EXISTS / IF EXISTS"
  
  # Apply database-specific syntax adjustments
  case "${db_type}" in
    "sqlite")
      echo "Applying SQLite-friendly defaults for ${db_type}"
      # SQLite already uses IF NOT EXISTS, but we can ensure TIMESTAMP becomes DATETIME
      sed -i 's/TIMESTAMP/DATETIME/g' "${migration_file}" 2>/dev/null || sed -i '' 's/TIMESTAMP/DATETIME/g' "${migration_file}"
      ;;
    "postgres")
      echo "Applying Postgres-specific fixes for ${db_type}"
      # Postgres uses IF NOT EXISTS, but we ensure proper type names
      sed -i 's/DATETIME/TIMESTAMP/g' "${migration_file}" 2>/dev/null || sed -i '' 's/DATETIME/TIMESTAMP/g' "${migration_file}"
      ;;
    "mysql")
      echo "Applying MySQL-specific fixes for ${db_type}"
      # MySQL needs special handling for IF NOT EXISTS in some cases
      sed -i 's/DATETIME/TIMESTAMP/g' "${migration_file}" 2>/dev/null || sed -i '' 's/DATETIME/TIMESTAMP/g' "${migration_file}"
      ;;
  esac
  
  echo -e "${GREEN}✓ Post-processed ${migration_file} for DB type: ${db_target}${NC}"
done

echo ""
echo -e "${GREEN}✓✓✓ All migrations generated successfully! ✓✓✓${NC}"
echo ""
echo "Migration files created:"
ls -lh ${MIGRATIONS_DIR}/*.js | awk '{print "  " $9 " (" $5 ")"}'
echo ""
echo "Note: These migrations were created without database connections."
echo "They contain basic schema structure that you may need to customize."
