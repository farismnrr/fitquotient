# 📚 FitQuotient Documentation

Complete documentation for installing, running, and maintaining FitQuotient.

## 📖 Documentation Guide

### Getting Started

1. **[System Architecture](./ARCHITECTURE.md)** 🏗️

   - Platform overview
   - Component relationships
   - Data flow diagrams
   - Technology stack

2. **[Docker Compose Installation](./DOCKER_COMPOSE.md)** 🐳

   - Quick start guide
   - Step-by-step setup
   - `docker-compose.yml` location and usage
   - Environment variables

   Note: The main compose file for Core and infra is located at `fitquotient_core/docker-compose.yml`.

3. **[Manual Installation](./MANUAL_INSTALLATION.md)** 💻

- Prerequisites
- Component-by-component setup
- Database options (SQLite/PostgreSQL/MySQL)
- Development environment

### Running & Operations

4. **[Running the Application](./RUNNING.md)** 🚀

   - Three deployment options
   - Local development setup
   - Production deployment
   - Process manager integration

5. **[Core Components](./COMPONENTS.md)** 📦

   - Detailed component specs
   - APIs and features
   - Environment variables
   - Source code locations

6. **[Health Checks](./HEALTH_CHECK.md)** ✅
   - Manual verification commands (no top-level helper script guaranteed)
   - Monitoring setup
   - Troubleshooting procedures

### Support & Troubleshooting

7. **[Troubleshooting Guide](./TROUBLESHOOTING.md)** 🔧
   - Common issues and solutions
   - Docker problems
   - Service-specific issues
   - Performance optimization

---

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
cd /media/farismnrr/shared-disk/Documents/Programs/fitquotient

# The primary docker compose file for core services is under `fitquotient_core/`.
cd fitquotient_core
cp .env.example .env

# From repository root (preferred):
docker compose -f fitquotient_core/docker-compose.yml up --build -d

# Or from inside `fitquotient_core/`:
# docker compose up --build -d

# Verify using manual health checks (see Health Checks section)

# Access (defaults)
# Frontend: http://localhost:3000
# Core API: http://localhost:${CORE_PORT:-5400}
# CV Assessor: http://localhost:${CV_ASSESSOR_PORT:-5500}
```

👉 See [Docker Compose Installation](./DOCKER_COMPOSE.md)

### Option 2: Manual Development

```bash
# Terminal 1: Infrastructure
docker run -p 6379:6379 redis:7-alpine
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant:latest

# Terminal 2: Core API
cd fitquotient_core/core && npm install && npm run start:dev

# Terminal 3: CV Assessor
cd fitquotient_core/cv_assessor && go mod download && air

# Terminal 4: Frontend
cd fitquotient_frontend && npm install && npm run dev
```

👉 See [Manual Installation](./MANUAL_INSTALLATION.md)

---

## 📚 Component Documentation

Each component has detailed documentation:

| Component       | Location                        | Doc                                                 |
| --------------- | ------------------------------- | --------------------------------------------------- |
| **Core API**    | `fitquotient_core/core/`        | [README](../fitquotient_core/core/README.md)        |
| **CV Assessor** | `fitquotient_core/cv_assessor/` | [README](../fitquotient_core/cv_assessor/README.md) |
| **Frontend**    | `fitquotient_frontend/`         | [README](../fitquotient_frontend/README.md)         |

---

## 🏗️ Architecture Overview

```
Frontend (Next.js:3000)
    ↓
    ├→ Core API (NestJS:5400) [SQLite/PostgreSQL/MySQL]
    └→ CV Assessor (Go:5500) ← [Redis:6379 + Qdrant:6333]
```

👉 See [System Architecture](./ARCHITECTURE.md)

---

## ✅ Health Check

Verify all services are running:

```bash
# Automated check
./healthcheck.sh

# Manual checks
curl http://localhost:5400/health          # Core API
curl http://localhost:5500/healthcheck    # CV Assessor
redis-cli ping                             # Redis
curl http://localhost:6333/health          # Qdrant
curl http://localhost:3000                 # Frontend
```

👉 See [Health Checks](./HEALTH_CHECK.md)

---

## 🔍 Documentation Index

### By Topic

**Installation**

- [Docker Compose](./DOCKER_COMPOSE.md) - Containerized setup
- [Manual Installation](./MANUAL_INSTALLATION.md) - Direct installation

**Operations**

- [Running the App](./RUNNING.md) - Multiple deployment options
- [Components](./COMPONENTS.md) - Detailed component info

**Monitoring**

- [Health Checks](./HEALTH_CHECK.md) - Service verification
- [Architecture](./ARCHITECTURE.md) - System overview

**Support**

- [Troubleshooting](./TROUBLESHOOTING.md) - Problem solving

### By Component

**Core API (NestJS)**

- Specs: [COMPONENTS.md#1-fitquotient-core-api](./COMPONENTS.md#1-fitquotient-core-api-nestjs)
- Setup: [MANUAL_INSTALLATION.md#step-2](./MANUAL_INSTALLATION.md#step-2-install-fitquotient-core-api-nestjs)
- Full Docs: [fitquotient_core/core/README.md](../fitquotient_core/core/README.md)

**CV Assessor (Go)**

- Specs: [COMPONENTS.md#2-cv-assessor](./COMPONENTS.md#2-cv-assessor-microservice-go)
- Setup: [MANUAL_INSTALLATION.md#step-3](./MANUAL_INSTALLATION.md#step-3-install-cv-assessor-go)
- Full Docs: [fitquotient_core/cv_assessor/README.md](../fitquotient_core/cv_assessor/README.md)

**Frontend (Next.js)**

- Specs: [COMPONENTS.md#3-frontend](./COMPONENTS.md#3-frontend-application-nextjs)
- Setup: [MANUAL_INSTALLATION.md#step-4](./MANUAL_INSTALLATION.md#step-4-install-frontend-nextjs)
- Full Docs: [fitquotient_frontend/README.md](../fitquotient_frontend/README.md)

**Redis & Qdrant**

- Specs: [COMPONENTS.md#4-5](./COMPONENTS.md#4-redis-cache--queue)
- Setup: [MANUAL_INSTALLATION.md#step-1](./MANUAL_INSTALLATION.md#step-1-setup-external-services)

---

## 🎯 Common Tasks

### First Time Setup

1. Read [Architecture](./ARCHITECTURE.md) to understand the system
2. Choose installation method:
   - [Docker Compose](./DOCKER_COMPOSE.md) (Recommended)
   - [Manual Installation](./MANUAL_INSTALLATION.md) (Development)
3. Run [Health Checks](./HEALTH_CHECK.md) to verify setup
4. See [Running](./RUNNING.md) for next steps

### Running Locally

```bash
# Docker Compose (fastest)
docker-compose up -d
docker-compose logs -f

# Manual (more control)
# Follow [Manual Installation](./MANUAL_INSTALLATION.md)
# and [Running](./RUNNING.md) - Option 2
```

### Troubleshooting

1. Run health check: `./healthcheck.sh`
2. Check [Troubleshooting](./TROUBLESHOOTING.md) guide
3. Review service logs
4. Consult component-specific docs

### Production Deployment

See [Running - Option 3](./RUNNING.md#option-3-production-deployment) for:

- Production builds
- Process managers
- Scaling considerations
- Monitoring setup

---

## 📋 File Structure

```
docs/
├── README.md                    # This file
├── ARCHITECTURE.md              # 🏗️ System design
├── DOCKER_COMPOSE.md            # 🐳 Docker setup
├── MANUAL_INSTALLATION.md       # 💻 Direct installation
├── RUNNING.md                   # 🚀 How to run
├── COMPONENTS.md                # 📦 Component details
├── HEALTH_CHECK.md              # ✅ Monitoring
└── TROUBLESHOOTING.md           # 🔧 Problem solving
```

---

## 🔗 External References

- **Core API Docs**: [fitquotient_core/core/docs/rest/](../fitquotient_core/core/docs/rest/)
- **CV Assessor Docs**: [fitquotient_core/cv_assessor/docs/rest/](../fitquotient_core/cv_assessor/docs/rest/)
- **Frontend README**: [fitquotient_frontend/README.md](../fitquotient_frontend/README.md)

---

## ❓ FAQ

### Which installation method should I use?

- **Docker Compose**: Easiest, best for local development, production-ready
- **Manual**: More control, better for debugging, development-focused

### What's the minimum system requirement?

- Docker Compose: 4GB RAM, 10GB storage
- Manual: Varies by component, but typically 2GB RAM

### Can I use different database?

Yes! Core API supports:

- SQLite (default, no setup)
- PostgreSQL (optional)
- MySQL (optional)

### How do I update/upgrade?

1. Pull latest changes: `git pull`
2. Rebuild: `docker-compose build --no-cache`
3. Restart: `docker-compose up -d`

### Where are the logs?

- Docker Compose: `docker-compose logs -f <service>`
- Manual: Check terminal where service is running

---

## 📞 Support

- **Documentation**: Check relevant guide above
- **Issues**: Review [Troubleshooting](./TROUBLESHOOTING.md)
- **Contact**: Reach out to development team

---

## 📝 Document Status

| Document            | Status | Last Updated |
| ------------------- | ------ | ------------ |
| README              | ✅     | Nov 2025     |
| ARCHITECTURE        | ✅     | Nov 2025     |
| DOCKER_COMPOSE      | ✅     | Nov 2025     |
| MANUAL_INSTALLATION | ✅     | Nov 2025     |
| RUNNING             | ✅     | Nov 2025     |
| COMPONENTS          | ✅     | Nov 2025     |
| HEALTH_CHECK        | ✅     | Nov 2025     |
| TROUBLESHOOTING     | ✅     | Nov 2025     |

---

**Last Updated**: November 2025  
**Version**: 1.0.0  
**Maintained By**: Development Team
