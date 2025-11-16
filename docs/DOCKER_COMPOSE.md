# 🐳 Docker Compose Installation Guide

Complete guide for installing and running FitQuotient using Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Minimum 4GB RAM
- 10GB storage (for vector DB)
- Internet connection for pulling images

## Quick Start

### 1. Clone Repository

```bash
cd /media/farismnrr/shared-disk/Documents/Programs
git clone <repository-url> fitquotient
cd fitquotient
```

### 2. Setup Environment Variables

Create `.env` file in root directory:

```bash
# Core API Configuration (NestJS)
CORE_PORT=5400
CORE_ENV=production
JWT_SECRET=your_jwt_secret_key_here

# Core Database Configuration (Optional - SQLite is default)
# Leave DB_TYPE empty or as 'sqlite' for default SQLite database
# Set to 'postgres' to use PostgreSQL
DB_TYPE=sqlite
# DB_TYPE=postgres
# DB_HOST=db
# DB_PORT=5432
# DB_USER=fitquotient
# DB_PASSWORD=your_secure_password_here
# DB_NAME=fitquotient_db

# CV Assessor Configuration (Go Microservice - REQUIRED)
CV_PORT=5500
CV_JWT_SECRET=your_jwt_secret_key_here
CV_API_KEY=your_api_key_here

# Redis Configuration (REQUIRED for CV Assessor)
REDIS_URL=redis://redis:6379

# Qdrant Configuration (REQUIRED for CV Assessor Vector DB)
QDRANT_URL=http://qdrant:6333
QDRANT_API_KEY=admin

# LLM Provider (OpenAI/Anthropic/Gemini)
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-api-key-here

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5400
NEXT_PUBLIC_CV_API_URL=http://localhost:5500
```

### 3. Create docker-compose.yml

If `docker-compose.yml` doesn't exist, create this file:

```yaml
version: "3.9"

services:
  # Redis Cache & Queue (REQUIRED for CV Assessor)
  redis:
    image: redis:7-alpine
    container_name: fitquotient_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - fitquotient_network

  # Qdrant Vector Database (REQUIRED for CV Assessor)
  qdrant:
    image: qdrant/qdrant:latest
    container_name: fitquotient_qdrant
    ports:
      - "6333:6333"
      - "6334:6334"
    environment:
      QDRANT_API_KEY: ${QDRANT_API_KEY}
    volumes:
      - qdrant_data:/qdrant/storage
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:6333/health"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - fitquotient_network

  # PostgreSQL Database (OPTIONAL - for Core API)
  # Uncomment if you want to use PostgreSQL instead of SQLite
  # db:
  #   image: postgres:17-alpine
  #   container_name: fitquotient_db
  #   environment:
  #     POSTGRES_USER: ${DB_USER}
  #     POSTGRES_PASSWORD: ${DB_PASSWORD}
  #     POSTGRES_DB: ${DB_NAME}
  #   ports:
  #     - "5432:5432"
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data
  #   healthcheck:
  #     test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
  #     interval: 10s
  #     timeout: 5s
  #     retries: 5
  #   networks:
  #     - fitquotient_network

  # FitQuotient Core API + CV Assessor (Combined)
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: fitquotient_app
    depends_on:
      redis:
        condition: service_healthy
      qdrant:
        condition: service_healthy
      # db:
      #   condition: service_healthy
    environment:
      # Core API Configuration
      NODE_ENV: ${CORE_ENV}
      CORE_PORT: ${CORE_PORT}
      JWT_SECRET: ${JWT_SECRET}
      DB_TYPE: ${DB_TYPE}
      # DB_HOST: db
      # DB_PORT: 5432
      # DB_USER: ${DB_USER}
      # DB_PASSWORD: ${DB_PASSWORD}
      # DB_NAME: ${DB_NAME}

      # CV Assessor Configuration
      PORT: ${CV_PORT}
      QDRANT_URL: http://qdrant:6333
      QDRANT_API_KEY: ${QDRANT_API_KEY}
      REDIS_URL: redis://redis:6379
      CV_JWT_SECRET: ${CV_JWT_SECRET}
      CV_API_KEY: ${CV_API_KEY}
      LLM_PROVIDER: ${LLM_PROVIDER}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    ports:
      - "5400:5400"
      - "5500:8080"
    healthcheck:
      test:
        [
          "CMD",
          "node",
          "-e",
          "require('http').get('http://localhost:5400/health', (r) => {r.resume()})",
        ]
      interval: 30s
      timeout: 10s
      start_period: 40s
      retries: 3
    networks:
      - fitquotient_network

  # FitQuotient Frontend (Next.js)
  frontend:
    build:
      context: ./fitquotient_frontend
    container_name: fitquotient_frontend
    depends_on:
      - app
    environment:
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
      NEXT_PUBLIC_CV_API_URL: ${NEXT_PUBLIC_CV_API_URL}
    ports:
      - "3000:3000"
    networks:
      - fitquotient_network

volumes:
  redis_data:
  qdrant_data:
  # postgres_data:  # Uncomment if using PostgreSQL

networks:
  fitquotient_network:
    driver: bridge
```

## Build and Run

### Build all services

```bash
docker-compose build
```

### Run all services

```bash
docker-compose up -d
```

### View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f frontend
```

### Check status

```bash
docker-compose ps
```

### Stop services

```bash
docker-compose down

# Or to remove volumes:
docker-compose down -v
```

## Verification

### Check health of all services

```bash
./healthcheck.sh
```

### Manual verification

```bash
# Core API
curl http://localhost:5400/health

# CV Assessor
curl http://localhost:5500/healthcheck

# Frontend
curl http://localhost:3000

# Redis
redis-cli ping

# Qdrant
curl http://localhost:6333/health
```

## Access Points

| Service          | URL                   |
| ---------------- | --------------------- |
| Frontend         | http://localhost:3000 |
| Core API         | http://localhost:5400 |
| CV Assessor API  | http://localhost:5500 |
| Qdrant Dashboard | http://localhost:6334 |
| Redis            | localhost:6379        |

## Configuration Notes

### Database Configuration

- **SQLite (Default)**: No additional configuration needed

  - Database file stored locally
  - Suitable for development/testing

- **PostgreSQL (Optional)**:
  - Uncomment `db` service in docker-compose.yml
  - Set `DB_TYPE=postgres` in `.env`
  - Update database credentials

### Environment Variables Best Practices

- Generate strong JWT_SECRET and CV_JWT_SECRET
- Use secure API keys
- Never commit `.env` file to version control
- Use `.env.example` for version control

## Common Commands

```bash
# Rebuild a specific service
docker-compose build app

# Restart all services
docker-compose restart

# View container logs with tail
docker-compose logs -f --tail=100

# Execute command in container
docker-compose exec app npm run migration:run

# Remove all containers
docker-compose down -v
```

## Troubleshooting

### Port already in use

```bash
# Find process using port
lsof -ti:5400 | xargs kill -9

# Or change port in .env
```

### Container won't start

```bash
# View detailed logs
docker-compose logs app

# Rebuild without cache
docker-compose build --no-cache
```

### Connection errors

```bash
# Check network connectivity
docker-compose ps

# Verify environment variables
cat .env
```

---

**Last Updated**: November 2025
