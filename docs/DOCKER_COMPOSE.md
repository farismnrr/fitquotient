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
git clone https://github.com/farismnrr/fitquotient.git
cd fitquotient
```

### 2. Setup Environment Variables

We provide a helper script to generate the `.env` file with secure defaults and your local IP address.

```bash
./env-config.sh
```

This will create a `.env` file configured for the Docker environment.

### 3. Start Services

You can use the provided Makefile or Docker Compose directly:

```bash
# Using Makefile (Recommended)
make docker-up

# OR using Docker Compose directly
docker compose up -d
```

The `docker-compose.yml` file in the root directory is pre-configured to run:
-   **FitQuotient App**: A single container running Core API, CV Assessor, and Frontend.
-   **Redis**: For caching and job queues.
-   **Qdrant**: Vector database for AI matching.

### 4. Verify Installation

Check if all containers are running:

```bash
docker compose ps
```

You should see `fitquotient`, `fitquotient-redis`, and `fitquotient-qdrant` running.

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
