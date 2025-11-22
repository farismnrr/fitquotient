# Job Endpoints

Manage job descriptions. Jobs are stored with their text content and automatically indexed as vector embeddings in Qdrant for semantic search.

## Overview

| Method   | Endpoint        | Description        | Status |
| -------- | --------------- | ------------------ | ------ |
| `POST`   | `/api/jobs`     | Create a new job   | 201    |
| `GET`    | `/api/jobs/:id` | Retrieve job by ID | 200    |
| `DELETE` | `/api/jobs/:id` | Delete a job       | 200    |

---

## Create Job

Create and store a new job description.

### Request

```
POST /api/jobs
X-API-Key: your-api-key
Content-Type: application/json
```

### Request Body

| Field   | Type          | Required | Validation        | Description                                       |
| ------- | ------------- | -------- | ----------------- | ------------------------------------------------- |
| `jobId` | string (UUID) | Yes      | `required,uuid`   | Unique identifier for the job                     |
| `text`  | string        | Yes      | `required,min=10` | Full job description text (minimum 10 characters) |

### Example Request

```bash
curl -X POST http://localhost:8080/api/jobs \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "456f7890-e89b-12d3-a456-426614174111",
    "text": "We are looking for a Senior Backend Engineer with 5+ years of experience in Go and distributed systems. Requirements: Strong understanding of microservices architecture, experience with Kubernetes, and knowledge of gRPC..."
  }'
```

### Success Response (201 Created)

```json
{
  "is_success": true,
  "message": "Job created successfully",
  "data": {
    "jobId": "456f7890-e89b-12d3-a456-426614174111"
  }
}
```

### Error Responses

#### 400 Bad Request (Validation Failed)

```json
{
  "is_success": false,
  "message": "Validation failed: field 'jobId' must be a valid UUID"
}
```

#### 401 Unauthorized

```json
{
  "is_success": false,
  "message": "API key is missing or invalid"
}
```

#### 500 Internal Server Error

```json
{
  "is_success": false,
  "message": "Failed to save job"
}
```

### What Happens

1. Job text is validated and stored
2. Vector embeddings are generated (384-dimensional)
3. Text is chunked and stored in Qdrant for semantic search
4. ID is returned for future reference

---

## Get Job

Retrieve a job by its ID.

### Request

```
GET /api/jobs/:id
X-API-Key: your-api-key
```

### URL Parameters

| Parameter | Type          | Required | Validation      | Description            |
| --------- | ------------- | -------- | --------------- | ---------------------- |
| `id`      | string (UUID) | Yes      | `required,uuid` | The job ID to retrieve |

### Example Request

```bash
curl -X GET http://localhost:8080/api/jobs/456f7890-e89b-12d3-a456-426614174111 \
  -H "X-API-Key: your-api-key"
```

### Success Response (200 OK)

```json
{
  "is_success": true,
  "message": "Job retrieved successfully",
  "data": {
    "jobId": "456f7890-e89b-12d3-a456-426614174111",
    "text": "We are looking for a Senior Backend Engineer with 5+ years of experience in Go and distributed systems..."
  }
}
```

### Error Responses

#### 400 Bad Request (Invalid UUID)

```json
{
  "is_success": false,
  "message": "Validation failed: field 'id' must be a valid UUID"
}
```

#### 401 Unauthorized

```json
{
  "is_success": false,
  "message": "API key is missing or invalid"
}
```

#### 404 Not Found

```json
{
  "is_success": false,
  "message": "Job not found"
}
```

---

## Delete Job

Delete a job by its ID.

### Request

```
DELETE /api/jobs/:id
X-API-Key: your-api-key
```

### URL Parameters

| Parameter | Type          | Required | Validation      | Description          |
| --------- | ------------- | -------- | --------------- | -------------------- |
| `id`      | string (UUID) | Yes      | `required,uuid` | The job ID to delete |

### Example Request

```bash
curl -X DELETE http://localhost:8080/api/jobs/456f7890-e89b-12d3-a456-426614174111 \
  -H "X-API-Key: your-api-key"
```

### Success Response (200 OK)

```json
{
  "is_success": true,
  "message": "Job deleted successfully"
}
```

### Error Responses

#### 400 Bad Request (Invalid UUID)

```json
{
  "is_success": false,
  "message": "Validation failed: field 'id' must be a valid UUID"
}
```

#### 401 Unauthorized

```json
{
  "is_success": false,
  "message": "API key is missing or invalid"
}
```

#### 404 Not Found

```json
{
  "is_success": false,
  "message": "Job not found"
}
```

### What Happens

1. Job is deleted from database
2. Vector embeddings are removed from Qdrant
3. All associated comparison records may be affected

---

See [evaluations.md](./evaluations.md) to learn how to compare CVs with this job.
