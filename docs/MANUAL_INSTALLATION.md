# 💻 Manual Installation Guide

Complete guide for installing and running FitQuotient without Docker.

## Prerequisites

- **Node.js**: 18+ and npm
- **Go**: 1.23+
- **Redis**: 7+ (REQUIRED for CV Assessor)
- **Qdrant**: Latest version (REQUIRED for CV Assessor)
- **PostgreSQL/MySQL**: 14+ (OPTIONAL - Core API uses SQLite by default)

## Installation Order

1. Setup external services (Redis, Qdrant)
2. Install Core API (NestJS)
3. Install CV Assessor (Go)
4. Install Frontend (Next.js)

## Step 1: Setup External Services

### Redis Setup (REQUIRED)

#### Option A: Using Docker

```bash
docker run -d --name fitquotient-redis \
  -p 6379:6379 \
  -v redis_data:/data \
  redis:7-alpine
```

#### Option B: Manual Installation

**Linux (Ubuntu/Debian):**

```bash
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

**macOS (Homebrew):**

```bash
brew install redis
brew services start redis
```

**Verify Redis:**

```bash
redis-cli ping
# Should return: PONG
```

### Qdrant Setup (REQUIRED)

#### Using Docker

```bash
docker run -d --name fitquotient-qdrant \
  -p 6333:6333 \
  -p 6334:6334 \
  -v qdrant_data:/qdrant/storage \
  qdrant/qdrant:latest
```

**Verify Qdrant:**

```bash
curl http://localhost:6333/health
# Should return: {"status":"ok"}
```

Access dashboard: http://localhost:6334

### PostgreSQL Setup (OPTIONAL)

Only needed if you prefer PostgreSQL over SQLite.

#### Using Docker

```bash
docker run -d --name fitquotient-db \
  -e POSTGRES_USER=fitquotient \
  -e POSTGRES_PASSWORD=secure_password \
  -e POSTGRES_DB=fitquotient_db \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:17-alpine
```

#### Manual Installation

**Linux (Ubuntu/Debian):**

```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS (Homebrew):**

```bash
brew install postgresql
brew services start postgresql
```

#### Create Database

```bash
psql -U postgres -h localhost

# In psql:
CREATE USER fitquotient WITH PASSWORD 'secure_password';
CREATE DATABASE fitquotient_db OWNER fitquotient;
GRANT ALL PRIVILEGES ON DATABASE fitquotient_db TO fitquotient;
\q
```

## Step 2: Install FitQuotient Core API (NestJS)

See detailed documentation: [`fitquotient_core/core/README.md`](../fitquotient_core/core/README.md)

```bash
cd fitquotient_core/core

# Install dependencies
npm install

# Setup environment
cp .env.example .env
```

### Configure Environment (.env)

```bash
# Database Configuration
# Default is SQLite - no configuration needed
DB_TYPE=sqlite

# Or use PostgreSQL:
# DB_TYPE=postgres
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=fitquotient
# DB_PASSWORD=secure_password
# DB_NAME=fitquotient_db

# Core API
PORT=5400
JWT_SECRET=your_very_secure_jwt_secret_key_here
NODE_ENV=development
```

### Run Database Migrations

```bash
npm run migration:run
```

### Start Core API

**Development mode (with hot reload):**

```bash
npm run start:dev
```

**Production mode:**

```bash
npm run build
npm run start:prod
```

Core API will be available at: http://localhost:5400

## Step 3: Install CV Assessor (Go)

See detailed documentation: [`fitquotient_core/cv_assessor/README.md`](../fitquotient_core/cv_assessor/README.md)

```bash
cd fitquotient_core/cv_assessor

# Download dependencies
go mod download

# Setup environment
cp .env.example .env
```

### Configure Environment (.env)

```bash
# Server
PORT=8080

# Redis
REDIS_URL=redis://localhost:6379

# Qdrant
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=admin

# API Security
JWT_SECRET=your_jwt_secret_key_here
API_KEY=your_api_key_here

# LLM Provider
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-key-here
```

### Install Air (Hot Reload)

```bash
go install github.com/cosmtrek/air@latest
```

### Start CV Assessor

**Development mode (with hot reload):**

```bash
air
```

**Production mode:**

```bash
go build -o cv_assessor .
./cv_assessor
```

CV Assessor will be available at: http://localhost:8080

## Step 4: Install Frontend (Next.js)

See detailed documentation: [`fitquotient_frontend/README.md`](../fitquotient_frontend/README.md)

```bash
cd fitquotient_frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
```

### Configure Environment (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:5400
NEXT_PUBLIC_CV_API_URL=http://localhost:8080
```

### Start Frontend

**Development mode:**

```bash
npm run dev
```

**Production build:**

```bash
npm run build
npm run start
```

Frontend will be available at: http://localhost:3000

## Complete Setup Workflow

### Terminal 1 - Start Redis & Qdrant

```bash
# Start Redis
docker run -p 6379:6379 redis:7-alpine

# In another terminal, start Qdrant
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant:latest
```

### Terminal 2 - Start Core API

```bash
cd fitquotient_core/core
npm install
npm run start:dev
```

### Terminal 3 - Start CV Assessor

```bash
cd fitquotient_core/cv_assessor
go mod download
air
```

### Terminal 4 - Start Frontend

```bash
cd fitquotient_frontend
npm install
npm run dev
```

### Access Application

- **Frontend**: http://localhost:3000
- **Core API**: http://localhost:5400
- **CV Assessor**: http://localhost:8080
- **Qdrant Dashboard**: http://localhost:6334

## Database Options

### SQLite (Default)

**Advantages:**

- No external database needed
- Zero configuration
- Perfect for development

**File Location:**

```bash
# Database file stored at
database.sqlite
```

**Usage:**

```bash
DB_TYPE=sqlite
# No other configuration needed
```

### PostgreSQL

**Advantages:**

- Better for production
- Supports concurrent connections
- Advanced features

**Configuration:**

```bash
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=fitquotient
DB_PASSWORD=secure_password
DB_NAME=fitquotient_db
```

### MySQL

**Advantages:**

- Wide community support
- Good performance

**Configuration:**

```bash
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=fitquotient
DB_PASSWORD=secure_password
DB_NAME=fitquotient_db
```

## Verification

### Check all services

```bash
# Core API
curl http://localhost:5400/health

# CV Assessor
curl http://localhost:8080/healthcheck

# Redis
redis-cli ping

# Qdrant
curl http://localhost:6333/health

# Frontend
curl http://localhost:3000
```

## Troubleshooting

### "Cannot connect to Redis"

```bash
# Verify Redis is running
redis-cli ping

# Check connection string in .env
REDIS_URL=redis://localhost:6379

# Restart Redis
docker restart fitquotient-redis
```

### "Cannot connect to Qdrant"

```bash
# Verify Qdrant is running
curl http://localhost:6333/health

# Check connection string in .env
QDRANT_URL=http://localhost:6333

# Restart Qdrant
docker restart fitquotient-qdrant
```

### "Cannot find module" (Node.js)

```bash
npm install --legacy-peer-deps
```

### "Cannot find package" (Go)

```bash
go mod tidy
go mod download
```

### Port already in use

```bash
# Find process using port
lsof -ti:5400 | xargs kill -9

# Or use different port
PORT=5401 npm run start:dev
```

## Environment Variables Reference

### Core API

| Variable   | Required    | Default     | Description        |
| ---------- | ----------- | ----------- | ------------------ |
| PORT       | No          | 5400        | Core API port      |
| NODE_ENV   | No          | development | Environment mode   |
| JWT_SECRET | Yes         | -           | JWT signing secret |
| DB_TYPE    | No          | sqlite      | Database type      |
| DB_HOST    | If postgres | -           | Database host      |
| DB_USER    | If postgres | -           | Database user      |

### CV Assessor

| Variable       | Required  | Default | Description               |
| -------------- | --------- | ------- | ------------------------- |
| PORT           | No        | 8080    | CV Assessor port          |
| REDIS_URL      | Yes       | -       | Redis connection URL      |
| QDRANT_URL     | Yes       | -       | Qdrant API URL            |
| JWT_SECRET     | Yes       | -       | JWT signing secret        |
| API_KEY        | Yes       | -       | API key for endpoints     |
| LLM_PROVIDER   | Yes       | -       | LLM provider (openai/etc) |
| OPENAI_API_KEY | If OpenAI | -       | OpenAI API key            |

## Common Commands

### View logs

```bash
# Core API dev logs
npm run start:dev

# CV Assessor dev logs
air

# Frontend dev logs
npm run dev
```

### Restart services

```bash
# Kill all node processes
killall node

# Kill all Go processes
killall cv_assessor

# Restart individual services
```

### Database operations

```bash
# Run migrations
npm run migration:run

# Generate migration
npm run migration:generate

# Revert migration
npm run migration:revert
```

---

**Last Updated**: November 2025
