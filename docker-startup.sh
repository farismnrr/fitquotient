#!/bin/bash
set -e

echo "🚀 Starting FitQuotient Multi-Service Container..."

# ----------------------------------------------------------------------------
# CLEANUP ON EXIT
# ----------------------------------------------------------------------------
cleanup() {
    echo "🛑 Stopping services..."
    kill ${NESTJS_PID:-} ${GO_PID:-} ${UI_PID:-} 2>/dev/null || true
    exit 0
}
trap cleanup SIGTERM SIGINT

# ----------------------------------------------------------------------------
# REQUIRED ENV VALIDATION
# ----------------------------------------------------------------------------
# No port environment variables needed - ports are hardcoded in the container
REQUIRED_ENVS=()

# Add DB vars only if not using sqlite
if [ "${CORE_DB_TYPE:-postgres}" != "sqlite" ] && [ "${CORE_DB_TYPE:-postgres}" != "better-sqlite3" ]; then
    REQUIRED_ENVS+=(
        CORE_DB_HOST
        CORE_DB_PORT
        CORE_DB_USER
        CORE_DB_PASS
        CORE_DB_NAME
    )
fi

for VAR in "${REQUIRED_ENVS[@]}"; do
    if [ -z "${!VAR}" ]; then
        echo "❌ ERROR: Environment variable '$VAR' is required but not set."
        exit 1
    fi
done


# ----------------------------------------------------------------------------
# 1. WAIT FOR POSTGRES USING PSQL (ONLY IF NOT SQLITE)
# ----------------------------------------------------------------------------
if [ "${CORE_DB_TYPE:-postgres}" != "sqlite" ] && [ "${CORE_DB_TYPE:-postgres}" != "better-sqlite3" ]; then
    echo "⏳ Waiting for PostgreSQL to be ready..."

    for i in {1..30}; do
        if PGPASSWORD="${CORE_DB_PASS}" \
            psql -U "${CORE_DB_USER}" \
                 -h "${CORE_DB_HOST}" \
                 -p "${CORE_DB_PORT}" \
                 -d "${CORE_DB_NAME}" \
                 -c "SELECT 1" >/dev/null 2>&1; then

            echo "✅ PostgreSQL is ready!"
            break
        fi

        if [ $i -eq 30 ]; then
            echo "❌ PostgreSQL did not become ready in time."
            exit 1
        fi

        echo "⏳ Attempt $i/30 - PostgreSQL not ready yet..."
        sleep 2
    done
else
    echo "ℹ️ Using SQLite (${CORE_DB_TYPE}), skipping PostgreSQL check."
fi


# ----------------------------------------------------------------------------
# ENSURE SQLITE DATABASE DIRECTORY EXISTS
# ----------------------------------------------------------------------------
if [ "${CORE_DB_TYPE:-postgres}" = "sqlite" ] || [ "${CORE_DB_TYPE:-postgres}" = "better-sqlite3" ]; then
    if [ -n "${CORE_DB_PATH}" ] && [ "${CORE_DB_PATH}" != ":memory:" ]; then
        # Extract directory from database path
        DB_DIR=$(dirname "${CORE_DB_PATH}")
        
        echo "📁 Ensuring SQLite database directory exists: ${DB_DIR}"
        echo "🔍 Current user: $(whoami) (UID: $(id -u), GID: $(id -g))"
        echo "🔍 Current working directory: $(pwd)"
        
        # Convert relative path to absolute if needed
        if [[ "${DB_DIR}" != /* ]]; then
            DB_DIR="$(pwd)/${DB_DIR}"
            echo "⚠️  Relative path detected, converting to absolute: ${DB_DIR}"
        fi
        
        # Create directory if it doesn't exist
        if [ ! -d "${DB_DIR}" ]; then
            echo "🔨 Creating directory: ${DB_DIR}"
            mkdir -p "${DB_DIR}"
            
            # Verify creation succeeded
            if [ ! -d "${DB_DIR}" ]; then
                echo "❌ ERROR: Failed to create directory ${DB_DIR}"
                exit 1
            fi
        fi
        
        # Test write capability first (before attempting chmod)
        TEST_FILE="${DB_DIR}/.write_test_$$"
        if touch "${TEST_FILE}" 2>/dev/null; then
            rm -f "${TEST_FILE}"
            echo "✅ Write test successful - directory is already writable"
        else
            # Only try to fix permissions if write test failed
            echo "⚠️  Directory not writable, attempting to fix permissions..."
            
            # Try chown (will fail silently if not permitted)
            chown -R appuser:appuser "${DB_DIR}" 2>/dev/null || true
            
            # Try chmod (will fail silently if not permitted)
            chmod -R 755 "${DB_DIR}" 2>/dev/null || true
            
            # Test again after permission fix attempt
            if touch "${TEST_FILE}" 2>/dev/null; then
                rm -f "${TEST_FILE}"
                echo "✅ Write test successful after permission fix"
            else
                echo "❌ ERROR: Cannot write to ${DB_DIR} even after permission fix attempt"
                echo "📋 Directory info:"
                ls -la "${DB_DIR}"
                echo "📋 Parent directory info:"
                ls -la "$(dirname "${DB_DIR}")"
                exit 1
            fi
        fi
        
        echo "✅ SQLite directory ready: ${DB_DIR}"
        echo "📝 Database file will be: ${CORE_DB_PATH}"
    else
        echo "ℹ️ Using in-memory SQLite database"
    fi
fi


# ----------------------------------------------------------------------------
# 2. RUN DATABASE MIGRATIONS
# ----------------------------------------------------------------------------
echo "🔄 Running database migrations..."

cd /home/appuser/core
echo "🔍 Filtering migration files for CORE_DB_TYPE=${CORE_DB_TYPE:-postgres}"
echo "🔎 BEFORE filter: $(ls -la migrations || true)"
echo "🔎 CORE_DB_TYPE value in runtime: ${CORE_DB_TYPE:-<not-set>}"
case "${CORE_DB_TYPE:-postgres}" in
    postgres)
        rm -f migrations/init_sqlite.js migrations/init_mysql.js || true
        ;;
    mysql)
        rm -f migrations/init_sqlite.js migrations/init_postgres.js || true
        ;;
    sqlite|better-sqlite3)
        rm -f migrations/init_postgres.js migrations/init_mysql.js || true
        ;;
    *)
        echo "⚠️ Unknown CORE_DB_TYPE '${CORE_DB_TYPE}', not filtering."
        ;;
esac

echo "🔎 AFTER filter: $(ls -la migrations || true)"
# If the migrations folder is empty (bind mount is empty), generate migrations at runtime
if [ -z "$(ls -A /home/appuser/core/migrations 2>/dev/null || true)" ]; then
    echo "🧭 Migrations folder is empty. Generating migrations using 'generate-migrations.js'..."
    # generate-migrations.js uses the built JS in ./core/dist to build migrations
    if node ./generate-migrations.js; then
        echo "✅ Generated migrations successfully."
    else
        echo "⚠️ Failed to generate migrations. Please ensure 'dist' exists in core and try again."
    fi
fi

# Run migrations and only delete the migrations folder if migrations succeed
if npm run migration:run; then
    echo "✅ Migrations completed successfully. Deleting 'migrations/' folder..."
    rm -rf /home/appuser/core/migrations || true
    echo "🗑️ 'migrations/' folder removed."
else
    echo "⚠️ Migrations failed (non-zero exit). Aborting container startup to avoid running with a broken schema."
    exit 
fi

# ----------------------------------------------------------------------------
# 3. START NESTJS CORE SERVICE (HARDCODED PORT 5400)
# ----------------------------------------------------------------------------
echo "📦 Starting NestJS Core Service on port 5400..."
cd /home/appuser/core

if [ "${NODE_ENV}" = "production" ]; then
    if [ -f "dist/app.secure.js" ]; then
        echo "🔐 Running production secure build..."
        npm run start:secure &
    else
        echo "⚠️  app.secure.js not found, falling back to main.js..."
        NODE_ENV=production node dist/main.js &
    fi
else
    echo "🔧 Running development build..."
    npm run start:dev &
fi

NESTJS_PID=$!
echo "✅ NestJS started (PID: $NESTJS_PID)"

# Wait for NestJS to be ready
echo "⏳ Waiting for NestJS Core to be ready..."
for i in {1..30}; do
    if curl -fsS http://127.0.0.1:5400/healthcheck > /dev/null 2>&1; then
        echo "✅ NestJS Core is ready!"
        break
    fi
    
    if [ $i -eq 30 ]; then
        echo "❌ NestJS Core did not become ready in time."
        exit 1
    fi
    
    echo "⏳ Attempt $i/30 - NestJS Core not ready yet..."
    sleep 2
done


# ----------------------------------------------------------------------------
# 4. START GO CV ASSESSOR SERVICE (HARDCODED PORT 5500)
# ----------------------------------------------------------------------------
echo "📦 Starting Go CV Assessor on port 5500..."
cd /home/appuser/cv_assessor

./cv_assessor &
GO_PID=$!
echo "✅ Go Assessor started (PID: $GO_PID)"

# Wait for Go CV Assessor to be ready
echo "⏳ Waiting for Go CV Assessor to be ready..."
for i in {1..30}; do
    if curl -fsS http://127.0.0.1:5500/healthcheck > /dev/null 2>&1; then
        echo "✅ Go CV Assessor is ready!"
        break
    fi
    
    if [ $i -eq 30 ]; then
        echo "❌ Go CV Assessor did not become ready in time."
        exit 1
    fi
    
    echo "⏳ Attempt $i/30 - Go CV Assessor not ready yet..."
    sleep 2
done

# ----------------------------------------------------------------------------
# 5. START NEXT.JS UI (STANDALONE) — HARDCODED PORT 3000
# ----------------------------------------------------------------------------
if [ -d "/home/appuser/ui" ] && [ -f "/home/appuser/ui/server.js" ]; then
    echo "📦 Starting Next.js UI on port 3000..."
    cd /home/appuser/ui
    # Set HOSTNAME to 0.0.0.0 to bind to all interfaces (needed for healthcheck on 127.0.0.1)
    # Next.js standalone defaults to port 3000
    HOSTNAME=0.0.0.0 node server.js &
    UI_PID=$!
    echo "✅ Next.js UI started (PID: $UI_PID)"
    
    # Wait for Next.js UI to be ready
    echo "⏳ Waiting for Next.js UI to be ready..."
    for i in {1..30}; do
        if curl -fsS http://127.0.0.1:3000/api/health > /dev/null 2>&1; then
            echo "✅ Next.js UI is ready!"
            break
        fi
        
        if [ $i -eq 30 ]; then
            echo "⚠️ Next.js UI did not become ready in time (non-critical, continuing...)."
        fi
        
        echo "⏳ Attempt $i/30 - Next.js UI not ready yet..."
        sleep 2
    done
else
    echo "⚠️ No Next.js standalone build found; skipping UI start."
fi


# ----------------------------------------------------------------------------
# 6. KEEP CONTAINER RUNNING
# ----------------------------------------------------------------------------
echo ""
echo "✨ All services are now running!"
echo "   - NestJS Core     → http://0.0.0.0:5400"
echo "   - Go CV Assessor  → http://0.0.0.0:5500"
echo "   - Next.js UI      → http://0.0.0.0:3000"
echo ""

if [ -n "${UI_PID:-}" ]; then
    wait $NESTJS_PID $GO_PID $UI_PID
else
    wait $NESTJS_PID $GO_PID
fi
