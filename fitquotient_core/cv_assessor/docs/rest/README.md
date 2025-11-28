# CV Assessor API Documentation

Complete API documentation for CV Assessor service - a microservice for comparing CVs with job descriptions using AI-powered analysis.

## 📁 Folder Structure

```
docs/rest/
├── README.md (this file)
├── AUTHENTICATION.md
├── COMMON.md
├── endpoints/
│   ├── cvs.md
│   ├── jobs.md
│   └── evaluations.md
└── examples/
    ├── cvs-examples.md
    ├── jobs-examples.md
    └── evaluations-examples.md
```

## 🚀 Quick Start

### Base URL

```
http://localhost:5500/api
```

### Health Check

```
GET http://localhost:5500/healthcheck
```

Response:

```
OK
```

### Required Headers

All API requests (except health check) must include:

```
X-API-Key: your-api-key
```

## 📚 Endpoint Modules

### 1. [CVs](./endpoints/cvs.md) (3 endpoints)

Manage CV documents for users.

- **Create CV** - Upload and store a new CV
- **Get CV** - Retrieve CV by ID
- **Delete CV** - Remove a CV

### 2. [Jobs](./endpoints/jobs.md) (3 endpoints)

Manage job descriptions.

- **Create Job** - Create a new job description
- **Get Job** - Retrieve job by ID
- **Delete Job** - Remove a job

### 3. [Evaluations](./endpoints/evaluations.md) (2 endpoints)

Compare CVs with jobs using AI analysis.

- **Compare CV with Job** - Start an evaluation process
- **Get Comparison Result** - Retrieve the evaluation result

## 📋 Standard Response Format

See [COMMON.md](./COMMON.md) for:

- Standard response format
- HTTP status codes
- Error handling
- Validation rules

## 🔐 Security Notes

- All endpoints require API Key authentication via `X-API-Key` header
- Input validation using Go playground validator
- Error handling middleware for consistent error responses
- Request/response transformation applied to all endpoints

## 💾 Data Storage & Processing

- **Vector Storage**: Qdrant (384-dimensional vectors)
- **Cache/Queue**: Redis
- **AI Integration**: Support for OpenAI, Anthropic, and Gemini providers

## 📊 Entity Overview

### CV Entity

- **CVId** (UUID): Unique identifier for the CV
- **UserId** (UUID): User who owns the CV
- **Filename**: Original filename of the CV
- **SourceUrl**: URL source of the CV
- **Text**: Full text content of the CV
- **Vector Chunks**: Stored in Qdrant for semantic search

### Job Entity

- **JobID** (UUID): Unique identifier for the job
- **Text**: Full job description text
- **Vector Chunks**: Stored in Qdrant for semantic search

## 💡 Examples

Check the [examples/](./examples/) folder for complete implementation examples:

- `cvs-examples.md` - Examples for CV endpoints
- `jobs-examples.md` - Examples for Job endpoints
- `evaluations-examples.md` - Examples for comparison/evaluation endpoints

## 🔄 Workflow Example

```
1. Create a CV (POST /api/cvs)
   └─> Stores CV text and generates vector embeddings

2. Create a Job (POST /api/jobs)
   └─> Stores job description and generates vector embeddings

3. Compare CV with Job (POST /api/jobs/evaluate)
   └─> Queues comparison task (returns immediately with status "enqueued")

4. Get Comparison Result (GET /api/jobs/result/:id)
   └─> Polls result until comparison is complete
```

## 📞 Support

For issues, questions, or feature requests, please refer to the main project repository.

---

**Last Updated**: November 2025
**API Version**: 1.0
