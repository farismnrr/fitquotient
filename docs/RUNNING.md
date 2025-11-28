# 🚀 Running the Application

Quick guides for running FitQuotient in different environments.

## Option 1: Automated / Docker Compose (Recommended)

### Quick Start

The easiest way is to use the automated script:

```bash
curl -fsSL https://raw.githubusercontent.com/farismnrr/fitquotient/master/install.sh | bash
```

Or manually with Docker Compose:

```bash
# Navigate to root directory
cd fitquotient

# Setup environment (generates keys and config)
./env-config.sh

# Start services
make docker-up
# OR: docker compose up -d
```

### Access Points

| Service          | URL                   |
| ---------------- | --------------------- |
| Frontend         | http://localhost:3000 |
| Core API         | http://localhost:5400 |
| CV Assessor      | http://localhost:5500 |
| Qdrant Dashboard | http://localhost:6334 |

### Common Commands

```bash
# View logs for the main application (Core + CV Assessor + Frontend)
docker compose logs -f fitquotient

# View logs for infrastructure
docker compose logs -f redis
docker compose logs -f qdrant

# Stop all services
docker compose stop

# Restart services
docker compose restart

# View running containers
docker compose ps

# Remove all containers and volumes
docker compose down -v
```

**Full Guide**: See [DOCKER_COMPOSE.md](./DOCKER_COMPOSE.md)

---

## Option 2: Manual Development

Run each service in separate terminals.

### Terminal 1: Start Infrastructure (Redis + Qdrant)

```bash
# Redis
docker run -p 6379:6379 redis:7-alpine

# In another terminal, start Qdrant
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant:latest
```

### Terminal 2: Core API

```bash
cd fitquotient_core/core
npm install
npm run start:dev
```

Will be available at: **http://localhost:5400**

### Terminal 3: CV Assessor

```bash
cd fitquotient_core/cv_assessor
go mod download
air
```

Will be available at: **http://localhost:8080** (or **http://localhost:5500** externally)

### Terminal 4: Frontend

```bash
cd fitquotient_frontend
npm install
npm run dev
```

Will be available at: **http://localhost:3000**

**Full Guide**: See [MANUAL_INSTALLATION.md](./MANUAL_INSTALLATION.md)

---

## Option 3: Production Deployment

### Build for Production

```bash
# Core API
cd fitquotient_core/core
npm run build

# CV Assessor
cd fitquotient_core/cv_assessor
go build -o cv_assessor .

# Frontend
cd fitquotient_frontend
npm run build
```

### Run Production Services

```bash
# Core API
npm run start:prod

# CV Assessor
./cv_assessor

# Frontend (requires Node.js)
npm start
```

### Using Process Manager (PM2)

```bash
# Install PM2
npm install -g pm2

# Start Core API
cd fitquotient_core/core
pm2 start "npm run start:prod" --name "fitquotient-core"

# Start CV Assessor
cd fitquotient_core/cv_assessor
pm2 start "./cv_assessor" --name "fitquotient-cv"

# Start Frontend
cd fitquotient_frontend
pm2 start "npm start" --name "fitquotient-frontend"

# View processes
pm2 list

# View logs
pm2 logs fitquotient-core
```

---

## Verification Checklist

### All Services Running

- [ ] Core API health: `curl http://localhost:5400/health`
- [ ] CV Assessor health: `curl http://localhost:8080/healthcheck`
- [ ] Redis ping: `redis-cli ping`
- [ ] Qdrant health: `curl http://localhost:6333/health`
- [ ] Frontend loads: `curl http://localhost:3000`

### Automated Health Check

```bash
./healthcheck.sh
```

---

## Environment Configuration

### Development

```bash
NODE_ENV=development
CORE_ENV=development
DB_TYPE=sqlite
```

### Production

```bash
NODE_ENV=production
CORE_ENV=production
DB_TYPE=postgres
```

---

## Logs and Debugging

### View Docker Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100 app
```

### View Process Logs

```bash
# Core API (npm)
npm run start:dev

# CV Assessor (Go)
air

# Frontend (Next.js)
npm run dev
```

---

## Performance Tips

### Docker Compose

- Use `.env` for configuration management
- Set memory limits in docker-compose.yml
- Use Alpine images for smaller footprint
- Enable health checks

### Manual Installation

- Use development mode for debugging
- Monitor process resources: `top`, `htop`
- Check database connection pooling
- Monitor Redis memory usage

### Frontend Optimization

- Enable code splitting
- Use image optimization
- Enable caching headers
- Monitor bundle size

---

## Stopping Services

### Docker Compose

```bash
# Stop all services (keep volumes)
docker-compose stop

# Stop and remove (remove volumes)
docker-compose down -v
```

### Manual Installation

```bash
# Kill node processes
killall node

# Kill Go processes
killall cv_assessor

# Or use Ctrl+C in respective terminals
```

---

## Next Steps

1. Check [Core Components Documentation](./COMPONENTS.md)
2. Review [Health Check Guide](./HEALTH_CHECK.md)
3. See [Troubleshooting Guide](./TROUBLESHOOTING.md)
4. Read individual component documentation:
   - [Core API](../fitquotient_core/core/README.md)
   - [CV Assessor](../fitquotient_core/cv_assessor/README.md)
   - [Frontend](../fitquotient_frontend/README.md)

---

**Last Updated**: November 2025
