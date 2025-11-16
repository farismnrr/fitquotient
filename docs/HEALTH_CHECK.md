# ✅ Health Check Guide

Comprehensive guide for monitoring and verifying all FitQuotient services.

## Automated Health Check

Run the included health check script:

```bash
./healthcheck.sh
```

This will check all services and return status:

- ✅ Green checkmark = Service is healthy
- ❌ Red X = Service is unhealthy

---

## Manual Health Checks

### Core API (NestJS)

```bash
curl http://localhost:5400/health
```

**Expected Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-11-17T10:30:00.000Z"
}
```

**Status Codes:**

- `200 OK`: Service is running
- `500 Error`: Service has issues
- `Connection refused`: Service not started

### CV Assessor (Go)

```bash
curl http://localhost:5500/healthcheck
```

**Expected Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-11-17T10:30:00Z"
}
```

**Troubleshooting:**

- Port 5500 is for Docker
- Port 8080 is for local development
- Ensure Redis and Qdrant are running

### Redis

```bash
redis-cli ping
```

**Expected Response:**

```
PONG
```

**Additional Checks:**

```bash
# Check memory usage
redis-cli info memory

# Check connected clients
redis-cli info clients

# Check key count
redis-cli dbsize

# Monitor commands in real-time
redis-cli monitor
```

### Qdrant Vector Database

```bash
# Health check
curl http://localhost:6333/health
```

**Expected Response:**

```json
{
  "status": "ok"
}
```

**Additional Checks:**

```bash
# Check version
curl http://localhost:6333/api/version

# List collections
curl http://localhost:6333/api/collections

# Check storage info
curl http://localhost:6333/api/system/info
```

**Dashboard Access:**

- Open browser: http://localhost:6334
- Check storage and collection status visually

### Frontend (Next.js)

```bash
curl http://localhost:3000
```

**Expected Response:**

- HTTP 200
- HTML page content
- Contains your frontend markup

**Advanced Check:**

```bash
# Check API routes
curl http://localhost:3000/api/health
```

---

## Docker Compose Health Check

### Check All Services

```bash
docker-compose ps
```

**Output Example:**

```
NAME                    STATUS
fitquotient_redis       Up (healthy)
fitquotient_qdrant      Up (healthy)
fitquotient_app         Up (healthy)
fitquotient_frontend    Up
```

### Check Specific Service Logs

```bash
# Core API + CV Assessor logs
docker-compose logs app

# Frontend logs
docker-compose logs frontend

# Redis logs
docker-compose logs redis

# Follow logs in real-time
docker-compose logs -f app
```

### Check Service Stats

```bash
# CPU and memory usage
docker stats
```

---

## Health Check Matrix

| Service         | Endpoint           | Expected Response | Port |
| --------------- | ------------------ | ----------------- | ---- |
| **Core API**    | `GET /health`      | `200 OK`          | 5400 |
| **CV Assessor** | `GET /healthcheck` | `200 OK`          | 5500 |
| **Redis**       | `PING`             | `PONG`            | 6379 |
| **Qdrant**      | `GET /health`      | `200 OK`          | 6333 |
| **Frontend**    | `GET /`            | `200 OK`          | 3000 |
| **Qdrant UI**   | Browser            | Web UI            | 6334 |

---

## Complete Health Check Script

Create `health_check_detailed.sh`:

```bash
#!/bin/bash

echo "🔍 FitQuotient Health Check"
echo "============================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

check_service() {
    local name=$1
    local url=$2
    local port=$3

    echo -n "Checking $name... "

    if curl -s -f "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Healthy${NC}"
        return 0
    else
        echo -e "${RED}✗ Unhealthy${NC}"
        return 1
    fi
}

# Check all services
check_service "Core API" "http://localhost:5400/health" 5400
check_service "CV Assessor" "http://localhost:5500/healthcheck" 5500
check_service "Frontend" "http://localhost:3000" 3000
check_service "Qdrant API" "http://localhost:6333/health" 6333

# Redis check
echo -n "Checking Redis... "
if redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Healthy${NC}"
else
    echo -e "${RED}✗ Unhealthy${NC}"
fi

echo ""
echo "✅ Health check complete"
```

### Run Detailed Health Check

```bash
chmod +x health_check_detailed.sh
./health_check_detailed.sh
```

---

## Monitoring & Alerts

### Real-time Monitoring

```bash
# Watch service status (updates every 2 seconds)
watch -n 2 'curl -s http://localhost:5400/health'
```

### Check Service Versions

```bash
# Core API version
curl http://localhost:5400/api/version

# CV Assessor version
curl http://localhost:5500/api/version

# Qdrant version
curl http://localhost:6333/api/version

# Redis version
redis-cli INFO server | grep redis_version
```

### Performance Monitoring

```bash
# Redis memory usage
redis-cli info memory | grep used_memory_human

# Qdrant storage info
curl http://localhost:6333/api/system/info

# Docker resource usage
docker stats fitquotient_app
```

---

## Troubleshooting Health Checks

### Service "Connection Refused"

**Cause**: Service not running

**Solution**:

```bash
# Docker Compose
docker-compose up -d <service>

# Manual
cd fitquotient_core/<service>
npm run start:dev  # or appropriate command
```

### Service "Timeout"

**Cause**: Service is slow or overloaded

**Solution**:

```bash
# Check service logs
docker-compose logs <service>

# Increase timeout
curl --max-time 30 http://localhost:5400/health

# Check resource usage
docker stats
```

### Redis "Connection Refused"

**Cause**: Redis not running

**Solution**:

```bash
# Start Redis
docker run -d -p 6379:6379 redis:7-alpine

# Or with Docker Compose
docker-compose up -d redis
```

### Qdrant "Connection Refused"

**Cause**: Qdrant not running

**Solution**:

```bash
# Start Qdrant
docker run -d -p 6333:6333 -p 6334:6334 qdrant/qdrant:latest

# Or with Docker Compose
docker-compose up -d qdrant
```

---

## Continuous Monitoring

### Using PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start monitoring
pm2 monit

# View logs
pm2 logs
```

### Using Docker Compose with Monitoring

```bash
# Monitor all services
docker-compose up --abort-on-container-exit

# View live stats
docker stats
```

---

## Health Check Best Practices

1. **Regular Checks**: Monitor services every 30 seconds
2. **Alerts**: Set up alerts for unhealthy services
3. **Logs**: Check logs for errors and warnings
4. **Metrics**: Monitor CPU, memory, and disk usage
5. **Dependencies**: Verify all dependencies are running
6. **Network**: Check network connectivity between services

---

## Escalation Procedures

If a service fails health check:

1. **Check logs**: `docker-compose logs <service>`
2. **Verify dependencies**: Ensure required services are running
3. **Restart service**: `docker-compose restart <service>`
4. **Rebuild if needed**: `docker-compose build --no-cache <service>`
5. **Check configuration**: Verify `.env` variables
6. **Review documentation**: Check component-specific guides

---

**Last Updated**: November 2025
