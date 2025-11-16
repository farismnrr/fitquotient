# 🏗️ System Architecture

FitQuotient uses a modular, scalable architecture with clear separation of concerns.

## Architecture Diagram

```
┌────────────────────────────────────────────────────────────┐
│                    FitQuotient Platform                     │
└────────────────────────────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
    ┌────────┐          ┌────────┐          ┌─────────────┐
    │ Frontend│          │Core API │         │CV Assessor  │
    │(Next.js)│          │(NestJS) │         │(Go + Gin)   │
    └────────┘          └────────┘          └─────────────┘
                             │                    │
                             │                    ├──────────┐
                             │                    │          │
                             ▼                    ▼          ▼
                        ┌──────────┐         ┌────────┐  ┌──────────┐
                        │ Database │         │ Redis  │  │ Qdrant   │
                        │(SQLite*) │         │ Cache  │  │(Vector DB)
                        │or        │         │& Queue │  │Semantic  │
                        │PostgreSQL│         │        │  │Search    │
                        │or MySQL  │         │        │  │          │
                        └──────────┘         └────────┘  └──────────┘
                        (*default)
```

## Components Overview

### Frontend Layer

- **Framework**: Next.js 15 (React + TypeScript)
- **Purpose**: User interface for job matching and CV management
- **Port**: 3000

### Core API Layer

- **Framework**: NestJS (TypeScript)
- **Purpose**:
  - User management and authentication
  - Job posting and retrieval
  - API orchestration
  - Business logic coordination
- **Port**: 5400
- **Database**:
  - **Default**: SQLite (file-based, no external setup)
  - **Optional**: PostgreSQL or MySQL
- **Features**:
  - JWT-based authentication
  - REST API endpoints
  - Optional Redis caching integration

### CV Assessor Microservice Layer

- **Framework**: Go (Gin web framework)
- **Purpose**:
  - CV analysis and processing
  - Intelligent job matching
  - Semantic search capabilities
- **Port**: 5500 (external), 8080 (internal)
- **Dependencies**:
  - **Redis** (required): Caching and async job queue
  - **Qdrant** (required): Vector embeddings and semantic search

### Data Layer Components

#### Redis

- **Purpose**: Caching and job queue for CV Assessor
- **Port**: 6379
- **Features**:
  - Session management
  - Async job processing
  - Cache layer

#### Qdrant Vector Database

- **Purpose**: Semantic search with vector embeddings
- **Port**: 6333 (REST API), 6334 (Web UI)
- **Features**:
  - 384-dimensional vectors
  - Fast similarity search
  - Web dashboard for management

## Data Flow

```
1. User uploads CV
   └─> Core API receives request
       └─> Stores CV metadata in database
           └─> Sends to CV Assessor

2. CV Assessor processes CV
   └─> Extract text and generate embeddings
       └─> Store vectors in Qdrant
           └─> Cache metadata in Redis

3. Job Matching Request
   └─> CV Assessor retrieves job description
       └─> Queries Qdrant for similar CVs
           └─> AI analysis with LLM
               └─> Returns match score and details
```

## Technology Stack

| Component    | Technology                    | Language   |
| ------------ | ----------------------------- | ---------- |
| Frontend     | Next.js 15, React, TypeScript | TypeScript |
| Core API     | NestJS, TypeORM               | TypeScript |
| Microservice | Go, Gin                       | Go         |
| Cache        | Redis                         | -          |
| Vector DB    | Qdrant                        | -          |
| Default DB   | SQLite                        | -          |
| Optional DB  | PostgreSQL/MySQL              | SQL        |

## Deployment Models

### 1. Docker Compose (Recommended)

- All services containerized
- Single command deployment
- Easy local development

### 2. Manual Installation

- Services run directly
- Individual process management
- Suitable for development/debugging

### 3. Kubernetes (Future)

- Scalable deployment
- Load balancing
- Service mesh integration

## Scalability Considerations

### Horizontal Scaling

- **Frontend**: Nginx load balancer
- **Core API**: Multiple instances with shared database
- **CV Assessor**: Multiple instances with shared Redis/Qdrant

### Vertical Scaling

- Increase container resources (CPU/Memory)
- Database connection pooling
- Redis memory optimization

### Performance Optimization

- Vector search indexing in Qdrant
- Redis caching strategy
- Database query optimization
- Frontend code splitting

---

**Last Updated**: November 2025
