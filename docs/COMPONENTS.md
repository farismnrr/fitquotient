# 📦 Core Components

Detailed overview of all FitQuotient components.

## 1. FitQuotient Core API (NestJS)

### Overview

The main backend API server handling business logic, user management, and API orchestration.

### Specifications

| Property            | Value               |
| ------------------- | ------------------- |
| **Framework**       | NestJS (TypeScript) |
| **Port**            | 5400                |
| **Runtime**         | Node.js 22+         |
| **Package Manager** | npm                 |
| **Language**        | TypeScript          |

### Database Support

- **Default**: SQLite (file-based, zero configuration)
- **Optional**: PostgreSQL 14+
- **Optional**: MySQL 8+

### Features

- ✅ JWT-based authentication
- ✅ User management and profiles
- ✅ Job posting and management
- ✅ CV submission handling
- ✅ RESTful API endpoints
- ✅ Database migrations
- ✅ Input validation (class-validator)
- ✅ Optional Redis caching

### Environment Variables

```env
# Server Configuration
PORT=5400
NODE_ENV=development

# Authentication
JWT_SECRET=your_jwt_secret_key

# Database (Optional - SQLite is default)
DB_TYPE=sqlite
# DB_TYPE=postgres
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=fitquotient
# DB_PASSWORD=password
# DB_NAME=fitquotient_db

# Optional Redis Cache
# REDIS_URL=redis://localhost:6379
```

### Directory Structure

```
fitquotient_core/core/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── Common/          # Shared utilities
│   ├── Users/           # User module
│   ├── Jobs/            # Job module
│   ├── Llms/            # LLM integration
│   └── ...
├── docs/rest/           # API documentation
├── migrations/          # Database migrations
├── test/                # Test suites
├── package.json
└── tsconfig.json
```

### Common Commands

```bash
cd fitquotient_core/core

# Install dependencies
npm install

# Development
npm run start:dev

# Production
npm run build
npm run start:prod

# Migrations
npm run migration:run
npm run migration:generate

# Testing
npm run test
npm run test:e2e

# Code quality
npm run lint
npm run format
```

### API Documentation

Full documentation available at: [`docs/rest/README.md`](../fitquotient_core/core/docs/rest/README.md)

### Source Code

📁 Location: [`fitquotient_core/core/`](../fitquotient_core/core/)

---

## 2. CV Assessor Microservice (Go)

### Overview

Specialized microservice for CV analysis, semantic search, and AI-powered job matching.

### Specifications

| Property          | Value                  |
| ----------------- | ---------------------- |
| **Framework**     | Go (Gin web framework) |
| **External Port** | 5500                   |
| **Internal Port** | 8080                   |
| **Runtime**       | Go 1.23+               |
| **Language**      | Go                     |

### Required Dependencies

- **Redis**: Cache and async job queue (REQUIRED)
- **Qdrant**: Vector database for semantic search (REQUIRED)
- **LLM Provider**: OpenAI, Anthropic, or Gemini (REQUIRED)

### Features

- ✅ CV upload and management
- ✅ Job description management
- ✅ CV-to-Job semantic matching
- ✅ Vector embeddings (384-dimensional)
- ✅ Intelligent scoring and analysis
- ✅ Async job processing
- ✅ Comprehensive error handling
- ✅ JWT authentication

### Environment Variables

```env
# Server
PORT=8080

# Redis (REQUIRED)
REDIS_URL=redis://localhost:6379

# Qdrant (REQUIRED)
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=admin

# Authentication (REQUIRED)
JWT_SECRET=your_jwt_secret
API_KEY=your_api_key

# LLM Provider (REQUIRED)
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
# Or Anthropic:
# ANTHROPIC_API_KEY=your-key
# Or Gemini:
# GEMINI_API_KEY=your-key
```

### Directory Structure

```
fitquotient_core/cv_assessor/
├── handlers/            # HTTP handlers
│   ├── cvs/            # CV endpoints
│   └── jobs/           # Job endpoints
├── services/            # Business logic
│   ├── cv.service
│   ├── job.service
│   └── comparison.service
├── repositories/        # Data access
├── infrastructure/      # External services
│   ├── qdrant.go       # Vector DB
│   ├── redis.go        # Cache/Queue
│   └── llm_client.go   # LLM integration
├── middlewares/         # HTTP middlewares
├── utils/              # Utilities
├── dtos/               # Data transfer objects
├── docs/rest/          # API documentation
├── main.go
└── server.go
```

### Common Commands

```bash
cd fitquotient_core/cv_assessor

# Download dependencies
go mod download

# Development (requires air)
air

# Production build
go build -o cv_assessor .
./cv_assessor

# Testing
go test ./...

# Code quality
go fmt ./...
go vet ./...

# Generate test coverage
go test -cover ./...
```

### API Documentation

Full documentation available at: [`docs/rest/README.md`](../fitquotient_core/cv_assessor/docs/rest/README.md)

### Source Code

📁 Location: [`fitquotient_core/cv_assessor/`](../fitquotient_core/cv_assessor/)

---

## 3. Frontend Application (Next.js)

### Overview

Modern web frontend for user interface, job browsing, and CV management.

### Specifications

| Property            | Value        |
| ------------------- | ------------ |
| **Framework**       | Next.js 15   |
| **UI Library**      | React 19     |
| **Language**        | TypeScript   |
| **Port**            | 3000         |
| **Styling**         | Tailwind CSS |
| **Package Manager** | npm          |

### Features

- ✅ User authentication UI
- ✅ Job browsing and filtering
- ✅ CV upload interface
- ✅ Match results dashboard
- ✅ User profile management
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Real-time updates

### Environment Variables

```env
# API Endpoints
NEXT_PUBLIC_API_URL=http://localhost:5400
NEXT_PUBLIC_CV_API_URL=http://localhost:8080
```

### Directory Structure

```
fitquotient_frontend/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/
│   │   ├── register/
│   │   └── dashboard/
│   ├── components/          # React components
│   │   ├── Navbar.tsx
│   │   ├── dashboard/
│   │   ├── landpage/
│   │   └── ui/
│   ├── context/            # React Context
│   ├── lib/                # Utilities
│   ├── types/              # TypeScript types
│   └── styles/
├── public/                 # Static assets
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

### Common Commands

```bash
cd fitquotient_frontend

# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build

# Production start
npm start

# Code quality
npm run lint

# Type checking
npx tsc --noEmit
```

### Documentation

Full documentation available at: [`README.md`](../fitquotient_frontend/README.md)

### Source Code

📁 Location: [`fitquotient_frontend/`](../fitquotient_frontend/)

---

## 4. Redis Cache & Queue

### Overview

In-memory data store for caching and async job processing in CV Assessor.

### Specifications

| Property   | Value                    |
| ---------- | ------------------------ |
| **Image**  | redis:7-alpine           |
| **Port**   | 6379                     |
| **Status** | REQUIRED for CV Assessor |

### Purpose

- Session caching
- Request response caching
- Async job queue for CV comparisons
- Rate limiting data
- Temporary data storage

### Docker Command

```bash
docker run -d --name fitquotient-redis \
  -p 6379:6379 \
  -v redis_data:/data \
  redis:7-alpine
```

### Verification

```bash
redis-cli ping
# Output: PONG
```

### Configuration

```env
REDIS_URL=redis://localhost:6379
```

---

## 5. Qdrant Vector Database

### Overview

Specialized vector database for semantic search and similarity matching.

### Specifications

| Property           | Value                    |
| ------------------ | ------------------------ |
| **Image**          | qdrant/qdrant:latest     |
| **REST Port**      | 6333                     |
| **gRPC Port**      | 6334                     |
| **Dashboard Port** | 6334 (Web UI)            |
| **Status**         | REQUIRED for CV Assessor |

### Purpose

- Store CV vector embeddings
- Semantic similarity search
- Job description embeddings
- 384-dimensional vectors support
- Fast nearest neighbor search

### Docker Command

```bash
docker run -d --name fitquotient-qdrant \
  -p 6333:6333 \
  -p 6334:6334 \
  -v qdrant_data:/qdrant/storage \
  qdrant/qdrant:latest
```

### Access

- **REST API**: http://localhost:6333
- **Web Dashboard**: http://localhost:6334
- **gRPC**: localhost:6334

### Verification

```bash
curl http://localhost:6333/health
# Output: {"status":"ok"}
```

### Configuration

```env
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=admin  # Change in production
```

---

## Component Dependencies

```
Frontend (Next.js)
    ↓
    ├──→ Core API (NestJS) [Port 5400]
    │       └──→ SQLite/PostgreSQL/MySQL [Optional]
    │
    └──→ CV Assessor (Go) [Port 5500/8080]
            ├──→ Redis [REQUIRED, Port 6379]
            ├──→ Qdrant [REQUIRED, Port 6333]
            └──→ LLM Provider (OpenAI/Anthropic/Gemini) [REQUIRED]
```

---

## Service Communication

### Frontend ↔ Core API

- REST API calls
- JSON request/response
- JWT authentication

### Frontend ↔ CV Assessor

- REST API calls
- File upload (CV documents)
- JSON job matching results

### Core API ↔ CV Assessor

- Inter-service communication
- Job queuing
- Result retrieval

### CV Assessor ↔ Redis

- Cache read/write
- Job queue operations
- Session management

### CV Assessor ↔ Qdrant

- Vector storage
- Similarity search queries
- Embedding operations

---

## Scalability Recommendations

### Frontend

- Use CDN for static assets
- Implement code splitting
- Enable caching headers

### Core API

- Multiple instances with load balancer
- Database connection pooling
- Redis for session sharing

### CV Assessor

- Scale horizontally with multiple instances
- Shared Redis queue
- Distributed Qdrant setup

---

## Monitoring & Health

Each component provides health check endpoints:

```bash
# Core API
curl http://localhost:5400/health

# CV Assessor
curl http://localhost:8080/healthcheck

# Redis
redis-cli ping

# Qdrant
curl http://localhost:6333/health
```

---

**Last Updated**: November 2025
