#!/bin/sh
set -e

echo "🚀 Starting FitQuotient Core..."

# Run database migrations
echo "🔄 Running database migrations..."
npm run migration:run || true

# Start the application
echo "✅ Starting application..."
exec node dist/main.js
