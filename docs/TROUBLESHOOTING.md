# 🔧 Troubleshooting Guide

Common issues and solutions for FitQuotient.

## Docker Compose Issues

### Error: "Cannot find module" during build

**Cause**: Dependency installation failed

**Solution**:

```bash
# Clear cache and rebuild
docker-compose build --no-cache

# Or rebuild specific service
docker-compose build --no-cache app

# Clear Docker system
docker system prune -a
```

### Error: Port already in use

**Cause**: Another process is using the port

**Solution**:

```bash
# Find process using port (e.g., 5400)
lsof -ti:5400 | xargs kill -9

# Or use a different port in .env
CORE_PORT=5401

# Reload with new port
docker-compose restart app
```

### Error: "Container won't start"

**Cause**: Service configuration or setup issue

**Solution**:

```bash
# Check detailed logs
docker-compose logs app

# View build output
docker-compose build app --verbose

# Verify environment variables
docker-compose config

# Check if dependencies are running
docker-compose ps
```

### Error: "Database connection error"

**Cause**: Database service not healthy

**Solution**:

```bash
# Check database service
docker-compose logs db

# Restart database
docker-compose restart db

# Verify connection string in .env
cat .env | grep DB_

# Wait for database to be healthy
docker-compose up db
```

### Error: "Out of memory"

**Cause**: Container memory limit exceeded

**Solution**:

```bash
# Check memory usage
docker stats

# Increase memory in docker-compose.yml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 2G

# Rebuild and restart
docker-compose down -v
docker-compose up -d
```

---

## Manual Installation Issues

### Error: "Cannot find go module"

**Cause**: Missing or outdated Go dependencies

**Solution**:

```bash
cd fitquotient_core/cv_assessor

# Clean and download dependencies
go mod tidy
go mod download

# Verify dependencies
go mod verify

# If still failing, clear cache
go clean -modcache
go mod download
```

### Error: "npm ERR! ERESOLVE could not resolve dependency"

**Cause**: Conflicting npm dependencies

**Solution**:

```bash
# Use legacy peer deps
npm install --legacy-peer-deps

# Or force resolution
npm install --force

# Or use newer Node.js
nvm install 20
nvm use 20

# Clear cache
npm cache clean --force
npm install
```

### Error: "Port conflict"

**Cause**: Port already in use

**Solution**:

```bash
# Find and kill process
lsof -ti:5400 | xargs kill -9

# Or use different port
PORT=5401 npm run start:dev

# Check all Node processes
lsof -i -P -n | grep node
```

### Error: "Cannot connect to Redis"

**Cause**: Redis not running or misconfigured

**Solution**:

```bash
# Verify Redis is running
redis-cli ping

# If not running, start it
docker run -d -p 6379:6379 redis:7-alpine

# Check connection string
# .env should have: REDIS_URL=redis://localhost:6379

# Test connection
redis-cli -u redis://localhost:6379 ping
```

### Error: "Cannot connect to Qdrant"

**Cause**: Qdrant not running or misconfigured

**Solution**:

```bash
# Verify Qdrant is running
curl http://localhost:6333/health

# If not running, start it
docker run -d -p 6333:6333 -p 6334:6334 qdrant/qdrant:latest

# Check connection string in .env
# QDRANT_URL=http://localhost:6333

# Test connection
curl -X GET "http://localhost:6333/health"
```

---

## Service-Specific Issues

### Core API (NestJS)

#### Issue: Database migration fails

**Solution**:

```bash
cd fitquotient_core/core

# Check migration status
npm run migration:show

# Revert last migration
npm run migration:revert

# Run migrations
npm run migration:run

# Generate new migration
npm run migration:generate
```

#### Issue: Port 5400 not accessible

**Solution**:

```bash
# Check if service is running
curl http://localhost:5400/health

# View logs for errors
npm run start:dev 2>&1 | head -50

# Verify port binding
netstat -tuln | grep 5400
```

#### Issue: Authentication fails

**Solution**:

```bash
# Verify JWT_SECRET is set
echo $JWT_SECRET

# If empty, set it
export JWT_SECRET="your_secret_key_here"

# Restart service
npm run start:dev
```

### CV Assessor (Go)

#### Issue: Cannot connect to external services

**Solution**:

```bash
cd fitquotient_core/cv_assessor

# Check .env file
cat .env

# Verify Redis connection
redis-cli ping

# Verify Qdrant connection
curl http://localhost:6333/health

# Test LLM API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Issue: Build fails

**Solution**:

```bash
# Clean build cache
go clean -cache

# Force rebuild
go build -a -o cv_assessor .

# With verbose output
go build -v -o cv_assessor .
```

#### Issue: Hot reload (air) not working

**Solution**:

```bash
# Reinstall air
go install github.com/cosmtrek/air@latest

# Make sure air.toml exists in project
# Run from project directory
air

# Or use verbose mode
air -d
```

### Frontend (Next.js)

#### Issue: Cannot connect to backend APIs

**Solution**:

```bash
# Verify .env.local
cat .env.local

# Should contain:
# NEXT_PUBLIC_API_URL=http://localhost:5400
# NEXT_PUBLIC_CV_API_URL=http://localhost:8080

# Check Core API is running
curl http://localhost:5400/health

# Check CV Assessor is running
curl http://localhost:8080/healthcheck
```

#### Issue: Build optimization fails

**Solution**:

```bash
cd fitquotient_frontend

# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build

# Or use production-ready build
npm run build
npm start  # Production server
```

---

## Network Issues

### Cannot resolve service name (Docker Compose)

**Cause**: DNS resolution issue

**Solution**:

```bash
# Check network
docker network ls

# Verify service is on network
docker inspect fitquotient_network

# Restart all services
docker-compose down
docker-compose up -d
```

### Containers cannot communicate

**Cause**: Network misconfiguration

**Solution**:

```bash
# Check service names in docker-compose.yml
# They should match service names used in connection strings

# Test connection between containers
docker-compose exec app curl http://redis:6379
docker-compose exec app curl http://qdrant:6333
```

---

## Database Issues

### SQLite Issues

#### Database file corrupted

**Solution**:

```bash
# Remove corrupted file
rm database.sqlite

# Restart Core API - new database will be created
npm run start:dev
```

#### Migrations stuck

**Solution**:

```bash
npm run migration:revert
npm run migration:run
```

### PostgreSQL Issues

#### Cannot connect

**Solution**:

```bash
# Verify PostgreSQL is running
docker-compose ps db

# Check credentials in .env
cat .env | grep DB_

# Test connection
psql -U fitquotient -h localhost -d fitquotient_db

# Restart database
docker-compose restart db
```

#### Query timeout

**Solution**:

```bash
# Check database size
SELECT pg_size_pretty(pg_database_size('fitquotient_db'));

# Increase timeout in .env or config
DB_TIMEOUT=30000

# Check running queries
SELECT * FROM pg_stat_activity;

# Restart database if necessary
docker-compose restart db
```

---

## Performance Issues

### High CPU usage

**Cause**: Heavy processing or inefficient queries

**Solution**:

```bash
# Monitor CPU usage
docker stats

# Check process details
top -p $(docker inspect -f '{{ .State.Pid }}' fitquotient_app)

# Review logs for errors
docker-compose logs app | grep -i error

# Restart service
docker-compose restart app
```

### High memory usage

**Cause**: Memory leak or caching issues

**Solution**:

```bash
# Clear Redis cache
redis-cli FLUSHALL

# Check Redis memory
redis-cli info memory | grep used_memory

# Restart Redis
docker-compose restart redis

# Increase container memory limit
# Edit docker-compose.yml and increase memory
```

### Slow queries

**Cause**: Missing indexes or inefficient queries

**Solution**:

```bash
# Enable query logging
# In .env: DB_LOGGING=true

# View slow queries
docker-compose logs app | grep -i "took\|slow"

# Optimize database
# Run migrations: npm run migration:run

# Check Qdrant performance
curl http://localhost:6333/api/system/info
```

---

## SSL/TLS Issues

### Certificate errors in production

**Cause**: Invalid or expired certificates

**Solution**:

```bash
# Update certificates
# Use Let's Encrypt for free certificates

# In nginx config:
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
}

# Restart services
docker-compose restart
```

---

## File Size Issues

### File too large error

**Cause**: CV file exceeds size limit

**Solution**:

```bash
# Increase max file size in nginx
# In nginx config:
client_max_body_size 50M;

# Or in application .env
MAX_FILE_SIZE=52428800  # 50MB

# Restart services
docker-compose restart
```

---

## Logging & Debugging

### Enable detailed logging

```bash
# Core API
DEBUG=* npm run start:dev

# CV Assessor
LOGLEVEL=debug go run main.go

# Frontend
DEBUG=* npm run dev
```

### View logs

```bash
# Docker Compose
docker-compose logs -f --tail=100 app

# Specific error
docker-compose logs app | grep -i error

# Last 1000 lines
docker-compose logs --tail=1000 app
```

### Generate diagnostics

```bash
#!/bin/bash
echo "=== System Info ===" >> diagnostics.txt
uname -a >> diagnostics.txt

echo "=== Docker Info ===" >> diagnostics.txt
docker version >> diagnostics.txt

echo "=== Container Status ===" >> diagnostics.txt
docker-compose ps >> diagnostics.txt

echo "=== Service Logs ===" >> diagnostics.txt
docker-compose logs >> diagnostics.txt
```

---

## Support & Escalation

If issue persists:

1. **Collect logs**: Save output from `docker-compose logs`
2. **Document steps**: List exact steps to reproduce
3. **Check documentation**: See component-specific guides
4. **Open issue**: Create GitHub issue with details
5. **Contact support**: Reach out to development team

---

**Last Updated**: November 2025
