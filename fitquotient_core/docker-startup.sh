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
# REQUIRED ENV VALIDATION (NO DEFAULTS)
# ----------------------------------------------------------------------------
REQUIRED_ENVS=(
    CORE_DB_HOST
    CORE_DB_PORT
    CORE_DB_USER
    CORE_DB_PASS
    CORE_DB_NAME
    CORE_DB_TYPE
    CORE_PORT
    CV_ASSESSOR_PORT
)

for VAR in "${REQUIRED_ENVS[@]}"; do
    if [ -z "${!VAR}" ]; then
        echo "❌ ERROR: Environment variable '$VAR' is required but not set."
        exit 1
    fi
done


# ----------------------------------------------------------------------------
# 1. WAIT FOR POSTGRES USING PSQL (NO DEFAULT VALUES)
# ----------------------------------------------------------------------------
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
    exit 1
fi

# ----------------------------------------------------------------------------
# 3. START NESTJS CORE SERVICE (NO DEFAULTS)
# ----------------------------------------------------------------------------
echo "📦 Starting NestJS Core Service on port $CORE_PORT..."
cd /home/appuser/core

if [ "${NODE_ENV}" = "production" ]; then
    echo "🔐 Running production secure build..."
    PORT="$CORE_PORT" npm run start:secure &
else
    echo "🔧 Running development build..."
    PORT="$CORE_PORT" npm run start:dev &
fi

NESTJS_PID=$!
echo "✅ NestJS started (PID: $NESTJS_PID)"

sleep 2


# ----------------------------------------------------------------------------
# 4. START GO CV ASSESSOR SERVICE (NO DEFAULTS)
# ----------------------------------------------------------------------------
echo "📦 Starting Go CV Assessor on port $CV_ASSESSOR_PORT..."
cd /home/appuser/cv_assessor

./cv_assessor &
GO_PID=$!
echo "✅ Go Assessor started (PID: $GO_PID)"

# ----------------------------------------------------------------------------
# 5. START NEXT.JS UI (STANDALONE) — optional
# ----------------------------------------------------------------------------
if [ -d "/home/appuser/ui/standalone" ]; then
    echo "📦 Starting Next.js UI on port ${UI_PORT:-3000}..."
    cd /home/appuser/ui/standalone
    PORT="${UI_PORT:-3000}" node server.js &
    UI_PID=$!
    echo "✅ Next.js UI started (PID: $UI_PID)"
else
    echo "⚠️ No Next.js standalone build found; skipping UI start."
fi


# ----------------------------------------------------------------------------
# 5. KEEP CONTAINER RUNNING
# ----------------------------------------------------------------------------
echo ""
echo "✨ All services are now running!"
echo "   - NestJS Core     → http://${CORE_HOST}:${CORE_PORT}"
echo "   - Go CV Assessor  → http://${CV_ASSESSOR_HOST}:${CV_ASSESSOR_PORT}"
echo "   - Next.js UI      → http://${UI_HOST:-localhost}:${UI_PORT:-3000}"
echo ""

if [ -n "${UI_PID:-}" ]; then
    wait $NESTJS_PID $GO_PID $UI_PID
else
    wait $NESTJS_PID $GO_PID
fi
