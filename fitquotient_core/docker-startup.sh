#!/bin/sh
set -e

echo "🚀 Starting FitQuotient Services..."

# Function to handle signals
cleanup() {
    echo "🛑 Shutting down services..."
    kill $NESTJS_PID $GO_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGTERM SIGINT

# ============================================================================
# All environment variables are already passed via docker-compose.yml
# ============================================================================

# ============================================================================
# Start NestJS Core Service
# ============================================================================
echo "📦 Starting NestJS Core Service on port ${CORE_PORT:-5400}..."
cd /home/appuser/core

# Determine which build to run based on NODE_ENV
if [ "${NODE_ENV}" = "production" ]; then
    echo "🔐 Running SECURE production build..."
    PORT=${CORE_PORT:-5400} npm run start:secure &
else
    echo "🔧 Running development mode..."
    PORT=${CORE_PORT:-5400} npm run start:dev &
fi

NESTJS_PID=$!
echo "✅ NestJS Core Service started (PID: $NESTJS_PID)"

# Wait a bit for NestJS to initialize
sleep 2

# ============================================================================
# Start Go CV Assessor Service
# ============================================================================
echo "📦 Starting Go CV Assessor Service on port ${CV_ASSESSOR_PORT:-5500}..."
cd /home/appuser/cv_assessor
./cv_assessor &
GO_PID=$!
echo "✅ Go CV Assessor Service started (PID: $GO_PID)"

# ============================================================================
# Keep container running and monitor both processes
# ============================================================================
echo "✨ All services are running!"
echo "   - NestJS Core: http://${CORE_HOST:-localhost}:${CORE_PORT:-5400}"
echo "   - Go Assessor: http://${CV_ASSESSOR_HOST:-localhost}:${CV_ASSESSOR_PORT:-5500}"
echo ""

# Wait for both processes
wait $NESTJS_PID $GO_PID