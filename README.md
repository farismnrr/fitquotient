# FitQuotient - AI-Powered Job Matching Platform

FitQuotient is an end-to-end platform for intelligent matching between candidate CVs and job descriptions using AI/ML. The system consists of three main components working together in an integrated architecture.

> **📚 Full documentation is available in the [`docs/`](./docs/) folder.**

## 🚀 Quick Start

### Option 1: Automated Installation (Recommended)

The easiest way to install FitQuotient is using our automated installation script. This will handle downloading, configuring, and starting all services.

```bash
curl -fsSL https://raw.githubusercontent.com/farismnrr/fitquotient/master/install.sh | bash
```

This script will:
1.  Download the latest deployment package.
2.  Install necessary dependencies (Docker, Make, etc.) if missing.
3.  Configure environment variables automatically.
4.  Start the application services using Docker Compose.

### Option 2: Manual Docker Compose Setup

If you prefer to set it up manually from the source:

```bash
# 1. Clone the repository
git clone https://github.com/farismnrr/fitquotient.git
cd fitquotient

# 2. Configure Environment
# This script generates a .env file with secure random keys and local IP configuration
./env-config.sh

# 3. Start Services
make docker-up
```

### Accessing the Application

Once started, the services will be available at:

-   **Frontend**: http://localhost:3000
-   **Core API**: http://localhost:5400
-   **CV Assessor**: http://localhost:5500

> **Note**: If you installed on a remote server, replace `localhost` with your server's IP address. The `env-config.sh` script automatically detects and configures the host IP.

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
