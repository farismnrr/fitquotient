# CV Assessor

A microservice for AI-powered CV (Curriculum Vitae) evaluation and comparison with job descriptions. This service leverages modern vector embeddings and semantic search to provide intelligent matching between candidate profiles and job requirements.

## 🎯 Overview

CV Assessor is a Go-based REST API that enables:

- **CV Management**: Upload, store, and manage candidate CVs
- **Job Description Management**: Create and maintain job specifications
- **Intelligent Comparison**: Use AI to compare CVs against job descriptions with detailed match analysis
- **Vector-based Semantic Search**: Leverage Qdrant for fast and accurate similarity matching
- **Asynchronous Processing**: Queue-based job processing with Redis for scalability

### Key Features

- ✅ RESTful API with comprehensive endpoints
- ✅ AI-powered CV-to-Job matching (supports OpenAI, Anthropic, Gemini)
- ✅ Vector embeddings for semantic understanding (384-dimensional vectors)
- ✅ Distributed vector storage with Qdrant
- ✅ Asynchronous job processing with Redis
- ✅ JWT-based authentication
- ✅ Comprehensive error handling and validation
- ✅ Docker support for easy deployment

## 🏗️ Architecture

### Core Components

**1. Handlers** (`handlers/`)

- `cvs/`: CV management endpoints
- `jobs/`: Job description and evaluation endpoints
- Request routing and response handling

**2. Services** (`services/`)

- `cv.service`: CV CRUD operations
- `job.service`: Job CRUD operations
- `comparison.service`: CV-to-Job comparison logic

**3. Repositories** (`repositories/`)

- Data access layer for CVs and jobs
- Database operations abstraction

**4. Infrastructure** (`infrastructure/`)

- `qdrant.go`: Vector storage client (semantic search)
- `redis.go`: Cache and queue management
- `llm_client.go`: AI provider integration

**5. Middleware** (`middlewares/`)

- `api_key.go`: API key validation
- `jwt.go`: JWT authentication
- `error_handler.go`: Centralized error handling
- `powered_by.go`: Response headers

**6. Utilities** (`utils/`)

- `jwt.go`: JWT token generation and validation
- `hash.go`: Password hashing utilities
- `text_chunker.go`: Text segmentation for vector processing
- `vector_comparison.go`: Vector similarity calculations
- `logger.go`: Application logging

**7. DTOs** (`dtos/`)

- Request/Response data transfer objects
- Input validation and serialization

**8. Entities** (`entities/`)

- `cv.entity`: CV data model
- `job.entity`: Job data model

## 📚 API Documentation

Complete API documentation is available in the `docs/` folder:

```
docs/rest/
├── README.md              # API overview and workflow
├── AUTHENTICATION.md      # Auth mechanisms and JWT
├── COMMON.md             # Standard formats and status codes
├── endpoints/
│   ├── cvs.md            # CV endpoints documentation
│   ├── jobs.md           # Job and evaluation endpoints
│   └── evaluations.md    # Evaluation/comparison details
└── examples/
    ├── cvs-examples.md   # CV operation examples
    ├── jobs-examples.md  # Job operation examples
    └── evaluations-examples.md # Comparison examples
```

### Quick API Reference

| Resource    | Method | Endpoint               | Purpose                 |
| ----------- | ------ | ---------------------- | ----------------------- |
| Health      | GET    | `/healthcheck`         | Service health check    |
| CVs         | POST   | `/api/cvs`             | Create CV               |
| CVs         | GET    | `/api/cvs/:id`         | Retrieve CV             |
| CVs         | DELETE | `/api/cvs/:id`         | Delete CV               |
| Jobs        | POST   | `/api/jobs`            | Create job              |
| Jobs        | GET    | `/api/jobs/:id`        | Retrieve job            |
| Jobs        | DELETE | `/api/jobs/:id`        | Delete job              |
| Evaluations | POST   | `/api/jobs/evaluate`   | Start CV-Job comparison |
| Evaluations | GET    | `/api/jobs/result/:id` | Get comparison result   |

## 🚀 Getting Started

### Prerequisites

- Go 1.23+
- Docker & Docker Compose
- Qdrant (Vector Database)
- Redis (Cache/Queue)
- LLM API Key (OpenAI, Anthropic, or Gemini)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cv_assessor
   ```

2. **Install dependencies**

   ```bash
   go mod download
   ```

3. **Setup environment variables** (create `.env`)

   ```env
   # Server
   CV_ASSESSOR_HOST=0.0.0.0
   CV_ASSESSOR_PORT=8080
   CV_ASSESSOR_API_KEY=your_api_key

   # Database
   QDRANT_URL=http://localhost:6333
   REDIS_URL=redis://localhost:6379

   # AI Provider
   LLM_PROVIDER=openai
   OPENAI_API_KEY=your_api_key

   # Security
   JWT_SECRET=your_jwt_secret
   ```

4. **Start services with Docker Compose**

   ```bash
   docker-compose up -d
   ```

5. **Run the application**
   ```bash
   go run main.go
   ```

### Docker Deployment

```bash
# Build
docker build -t cv-assessor .

# Run
docker run -p 8080:8080 \
  -e QDRANT_URL=http://qdrant:6333 \
  -e REDIS_URL=redis://redis:6379 \
  -e OPENAI_API_KEY=your_key \
  cv-assessor
```

## 📊 Data Flow

```
┌─────────────┐
│   Upload    │
│     CV      │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│ 1. Parse & Extract Text             │
│ 2. Generate Vector Embeddings       │
│ 3. Store in Qdrant (Vector DB)     │
│ 4. Cache metadata in Redis          │
└──────┬──────────────────────────────┘
       │
       ├─────────────┐
       │             │
       ▼             ▼
   ┌─────────┐  ┌──────────┐
   │ CV Data │  │ Job Data │
   └────┬────┘  └─────┬────┘
        │             │
        └──────┬──────┘
               │
               ▼
        ┌────────────────────┐
        │ Request Comparison │
        └────────┬───────────┘
                 │
                 ▼
        ┌───────────────────────────────────┐
        │ 1. Queue Job (Redis)              │
        │ 2. Semantic Search (Qdrant)       │
        │ 3. AI Analysis (LLM)              │
        │ 4. Generate Match Report          │
        └────────┬────────────────────────┘
                 │
                 ▼
        ┌──────────────────────────┐
        │ Return Comparison Result │
        │ (Match Score, Details)   │
        └──────────────────────────┘
```

## 🔐 Security

- **Authentication**: API Key (`X-API-Key` header) and JWT tokens
- **Validation**: Input validation using Go Playground Validator
- **Error Handling**: Sanitized error messages to prevent information leakage
- **CORS**: Configurable cross-origin resource sharing

## 🧪 Testing

Run the test suite:

```bash
# All tests
go test ./...

# Specific package
go test ./services

# With coverage
go test -cover ./...
```

Test files are marked with `_test.go` suffix throughout the project.

## 📦 Dependencies

**Core Dependencies:**

- `gin-gonic/gin` - HTTP framework
- `qdrant/go-client` - Vector database client
- `go-redis/redis` - Cache and queue
- `golang-jwt/jwt` - JWT authentication
- `go-playground/validator` - Input validation

**Testing:**

- `onsi/ginkgo` & `onsi/gomega` - BDD testing framework
- `stretchr/testify` - Assertion utilities

See `go.mod` for complete dependency list.

## 📁 Project Structure

```
cv_assessor/
├── dtos/                  # Data transfer objects
│   ├── commons/          # Common DTOs
│   ├── cvs/             # CV-related DTOs
│   ├── jobs/            # Job-related DTOs
│   └── responses/       # Response DTOs
├── entities/            # Domain entities
├── handlers/            # HTTP handlers
│   ├── cvs/            # CV controllers
│   └── jobs/           # Job controllers
├── repositories/        # Data access layer
├── services/            # Business logic
├── infrastructure/      # External service clients
├── middlewares/         # HTTP middlewares
├── utils/              # Utility functions
├── docs/               # API documentation
├── main.go             # Application entry point
├── server.go           # Server setup
└── go.mod              # Dependency management
```

## 🔄 Workflow Example

1. **Upload CV**

   ```bash
   POST /api/cvs
   {
     "userId": "uuid",
     "filename": "resume.pdf",
     "sourceUrl": "https://...",
     "text": "CV content..."
   }
   ```

2. **Create Job**

   ```bash
   POST /api/jobs
   {
     "text": "Job description..."
   }
   ```

3. **Compare CV with Job** (Asynchronous)

   ```bash
   POST /api/jobs/evaluate
   {
     "cvId": "uuid",
     "jobId": "uuid"
   }
   ```

   Returns: Job ID with `status: "enqueued"`

4. **Poll Results**
   ```bash
   GET /api/jobs/result/:jobId
   ```
   Returns: Comparison result with match score and analysis

## 🐛 Troubleshooting

**Qdrant Connection Error**

```
Failed to connect to Qdrant: connection refused
```

- Ensure Qdrant is running on the configured URL
- Check `QDRANT_URL` environment variable

**Redis Connection Error**

```
Failed to connect to Redis: connection refused
```

- Ensure Redis is running
- Check `REDIS_URL` environment variable

**LLM API Error**

```
Failed to call LLM provider
```

- Verify API key is valid
- Check LLM provider availability
- Ensure `LLM_PROVIDER` matches configured service

## 📝 Configuration

Configuration is managed through environment variables:

| Variable              | Description                            | Default                  |
| --------------------- | -------------------------------------- | ------------------------ |
| `CV_ASSESSOR_HOST`    | Server host address                    | `0.0.0.0`                |
| `CV_ASSESSOR_PORT`    | Server port                            | `8080`                   |
| `CV_ASSESSOR_API_KEY` | API key for authentication             | Required                 |
| `QDRANT_URL`          | Qdrant service URL                     | `http://localhost:6333`  |
| `REDIS_URL`           | Redis connection URL                   | `redis://localhost:6379` |
| `JWT_SECRET`          | JWT signing secret                     | Required                 |
| `LLM_PROVIDER`        | LLM provider (openai/anthropic/gemini) | `openai`                 |
| `OPENAI_API_KEY`      | OpenAI API key                         | Required if using OpenAI |

## 🤝 Contributing

When contributing:

1. Follow Go coding standards
2. Write tests for new features
3. Update documentation accordingly
4. Ensure all tests pass: `go test ./...`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 📞 Support

For issues, questions, or feature requests, please open an issue in the project repository.

---

**Last Updated**: November 2025  
**Go Version**: 1.23+  
**API Version**: 1.0
