#!/bin/sh
set -e

echo "Starting FitQuotient services..."
/app/cv_assessor/cv_assessor &
sleep 2

max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if wget --no-verbose --tries=1 --spider http://localhost:5500/healthcheck 2>/dev/null; then
        break
    fi
    attempt=$((attempt + 1))
    sleep 1
done

exec /app/core/docker-entrypoint.sh
