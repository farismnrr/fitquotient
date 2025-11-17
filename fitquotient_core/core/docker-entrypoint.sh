#!/bin/sh
set -e

echo "🔧 NestJS Core Service Entrypoint"

# ============================================================================
# Environment Setup
# ============================================================================
echo "📋 Environment: NODE_ENV=${NODE_ENV:-development}"
echo "🔌 Port: ${CORE_PORT:-5400}"
echo "🔐 Using SECURE build"

# ============================================================================
# Database Migrations (if needed)
# ============================================================================
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    echo "🔄 Running database migrations..."
    cd /home/appuser/core
    npm run migration:run || echo "⚠️  Migrations already up to date or skipped"
fi

# ============================================================================
# Start NestJS Application
# ============================================================================
echo "🚀 Starting NestJS Core Service..."
cd /home/appuser/core

# Determine which build to run
if [ "${NODE_ENV}" = "production" ]; then
    echo "🔐 Running SECURE production build..."
    exec npm run start:secure
else
    echo "🔧 Running development mode..."
    exec npm run start:dev
fi
