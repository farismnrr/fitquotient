# FitQuotient - AI-Powered Job Matching Platform

FitQuotient is an end-to-end platform for intelligent matching between candidate CVs and job descriptions using AI/ML. The system consists of three main components working together in an integrated architecture.

> **📚 Full documentation is available in the [`docs/`](./docs/) folder.**

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone and setup
cd /media/farismnrr/shared-disk/Documents/Programs
git clone <repository-url> fitquotient
cd fitquotient

# The repository ships a docker-compose configuration inside `fitquotient_core/`.
# Use the compose file there or run the helper script that starts both services.

# Create environment file for the core services
cd fitquotient_core
cp .env.example .env

# Build and run services (from repository root):
docker compose -f fitquotient_core/docker-compose.yml up --build -d

# OR (from inside `fitquotient_core/`):
# docker compose up --build -d

# Alternative: use the multi-service entrypoint inside the image/container
# `fitquotient_core/docker-startup.sh` is used by the container runtime.

# Verify (manual checks shown below)

# Access (defaults)
# Frontend: http://localhost:3000
# Core API: http://localhost:${CORE_PORT:-5400}
# CV Assessor: http://localhost:${CV_ASSESSOR_PORT:-5500}
```

👉 **See [Docker Compose Setup](./docs/DOCKER_COMPOSE.md) for detailed guide**

### Option 2: Manual Development

```bash
# Terminal 1: Start Redis & Qdrant
docker run -p 6379:6379 redis:7-alpine
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant:latest

# Terminal 2: Core API
cd fitquotient_core/core && npm install && npm run start:dev

# Terminal 3: CV Assessor
cd fitquotient_core/cv_assessor && go mod download && air

# Terminal 4: Frontend
cd fitquotient_frontend && npm install && npm run dev
```

👉 **See [Manual Installation](./docs/MANUAL_INSTALLATION.md) for detailed guide**

---

## 📚 Documentation

All documentation is organized in the [`docs/`](./docs/) folder:

| Document                                                    | Purpose                                       |
| ----------------------------------------------------------- | --------------------------------------------- |
| [**ARCHITECTURE.md**](./docs/ARCHITECTURE.md)               | System design, components, and data flow      |
| [**DOCKER_COMPOSE.md**](./docs/DOCKER_COMPOSE.md)           | Docker Compose installation and configuration |
| [**MANUAL_INSTALLATION.md**](./docs/MANUAL_INSTALLATION.md) | Step-by-step manual installation guide        |
| [**RUNNING.md**](./docs/RUNNING.md)                         | How to run in different environments          |
| [**COMPONENTS.md**](./docs/COMPONENTS.md)                   | Detailed component specifications             |
| [**HEALTH_CHECK.md**](./docs/HEALTH_CHECK.md)               | Service monitoring and verification           |
| [**TROUBLESHOOTING.md**](./docs/TROUBLESHOOTING.md)         | Common issues and solutions                   |

👉 **Start with [Documentation Index](./docs/README.md)**

---

## 🏗️ System Architecture

```
Frontend (Next.js:3000)
    ↓
    ├→ Core API (NestJS:5400) [SQLite/PostgreSQL/MySQL]
    └→ CV Assessor (Go:5500)  [Redis:6379 + Qdrant:6333]
```

**Key Components:**

- **Frontend**: Next.js web application
- **Core API**: NestJS backend (user, job, API management)
- **CV Assessor**: Go microservice (CV analysis, job matching)
- **Redis**: Cache and async job queue (REQUIRED for CV Assessor)
- **Qdrant**: Vector database for semantic search (REQUIRED for CV Assessor)

👉 **See [System Architecture](./docs/ARCHITECTURE.md) for detailed diagram**

---

## ✅ Health Check

There is no guaranteed top-level `healthcheck.sh` in the repository root. Use these manual checks to verify services after starting them:

```bash
# Core API (replace port if you customized CORE_PORT)
curl -f http://localhost:${CORE_PORT:-5400}/healthcheck

# CV Assessor
curl -f http://localhost:${CV_ASSESSOR_PORT:-5500}/healthcheck

# Redis (if running locally)
redis-cli -h 127.0.0.1 -p ${REDIS_PORT:-6379} ping

# Qdrant
curl -f http://localhost:6333/health

# Frontend (Next.js)
curl -f http://localhost:3000
```

👉 **See [Health Checks](./docs/HEALTH_CHECK.md) for monitoring guide**

---

## 🔧 Troubleshooting

Having issues? Check the [Troubleshooting Guide](./docs/TROUBLESHOOTING.md) for:

- Docker Compose issues
- Service-specific problems
- Network and database issues
- Performance optimization

---

## 📦 Component Documentation

Each component has detailed README:

| Component       | Location                        | Docs                                               |
| --------------- | ------------------------------- | -------------------------------------------------- |
| **Core API**    | `fitquotient_core/core/`        | [README](./fitquotient_core/core/README.md)        |
| **CV Assessor** | `fitquotient_core/cv_assessor/` | [README](./fitquotient_core/cv_assessor/README.md) |
| **Frontend**    | `fitquotient_frontend/`         | [README](./fitquotient_frontend/README.md)         |

---

## 🎯 Next Steps

1. **First time?** → Read [System Architecture](./docs/ARCHITECTURE.md)
2. **Ready to install?** → Choose:
   - [Docker Compose](./docs/DOCKER_COMPOSE.md) (recommended)
   - [Manual Installation](./docs/MANUAL_INSTALLATION.md)
3. **Need to run?** → See [Running the App](./docs/RUNNING.md)
4. **Having issues?** → Check [Troubleshooting](./docs/TROUBLESHOOTING.md)

---

## 🔐 Security

For production deployment:

- Set strong JWT secrets
- Use secure API keys
- Enable HTTPS/SSL
- Configure CORS properly
- Use PostgreSQL instead of SQLite
- Set up proper access controls

👉 **See component READMEs for security details**

---

## 📋 Project Structure

```
fitquotient/
├── docs/                          # 📚 Documentation (start here!)
│   ├── README.md                  # Docs index
│   ├── ARCHITECTURE.md
│   ├── DOCKER_COMPOSE.md
│   ├── MANUAL_INSTALLATION.md
│   ├── RUNNING.md
│   ├── COMPONENTS.md
│   ├── HEALTH_CHECK.md
│   └── TROUBLESHOOTING.md
├── fitquotient_core/              # Core services, compose and runtimes
│   ├── docker-compose.yml         # Docker Compose for core + infra
│   ├── docker-startup.sh          # Multi-service container entrypoint
│   ├── Dockerfile.core            # Dockerfile used by compose
    ├── core/                      # Core API (NestJS)
    └── cv_assessor/               # CV Assessor (Go)
├── fitquotient_frontend/          # Frontend (Next.js)
├── .env.example                   # Example environment (per-component)
└── README.md                      # This file
```

---

## 📞 Support

- **Documentation**: Check [`docs/`](./docs/) folder
- **Issues**: Review [Troubleshooting Guide](./docs/TROUBLESHOOTING.md)
- **Component docs**: Check individual component READMEs

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) file

---

**Last Updated**: November 20, 2025
**Version**: 1.0.0  
**Status**: ✅ Production Ready
