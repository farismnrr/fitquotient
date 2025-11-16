# CV Assessor API - Postman Testing Guide

## Base URL

```
http://localhost:8080
```

## Authentication

All endpoints (except `/healthcheck`) require the following header:

```
X-API-Key: <your-api-key>
```

---

## 1. Health Check

### GET /healthcheck

Verify that the server is running properly.

**URL:**

```
GET http://localhost:8080/healthcheck
```

**Auth:** Not required

**Body:** Empty

**Response (200 OK):**

```
OK
```

---

## CV Endpoints

## 2. Create CV

### POST /api/cvs

Create a new CV and save its embedding.

**URL:**

```
POST http://localhost:8080/api/cvs
```

**Auth:**

```
Header: X-API-Key: <your-api-key>
```

**Body (JSON):**

```json
{
  "cvId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "john_doe_cv.pdf",
  "sourceUrl": "https://example.com/cvs/john_doe.pdf",
  "text": "John Doe is a senior software engineer with 10 years of experience in full-stack development. Skilled in React, Node.js, Go, and cloud technologies. Strong background in system design and team leadership."
}
```

**Validation Rules:**

- `cvId`: Required, must be valid UUID
- `userId`: Required, must be valid UUID
- `filename`: Required, max 255 characters
- `sourceUrl`: Required, must be valid URL
- `text`: Required, minimum 10 characters

**Response (201 Created):**

```json
{
  "isSuccess": true,
  "message": "CV created successfully",
  "data": {
    "cvId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

## 3. Get CV

### GET /api/cvs/:id

Retrieve CV data by ID.

**URL:**

```
GET http://localhost:8080/api/cvs/550e8400-e29b-41d4-a716-446655440000
```

**Auth:**

```
Header: X-API-Key: <your-api-key>
```

**Body:** Empty

**Response (200 OK):**

```json
{
  "isSuccess": true,
  "message": "CV retrieved successfully",
  "data": {
    "cvId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "john_doe_cv.pdf",
    "sourceUrl": "https://example.com/cvs/john_doe.pdf",
    "text": "John Doe is a senior software engineer with 10 years of experience in full-stack development..."
  }
}
```

---

## 4. Delete CV

### DELETE /api/cvs/:id

Delete a CV by ID.

**URL:**

```
DELETE http://localhost:8080/api/cvs/550e8400-e29b-41d4-a716-446655440000
```

**Auth:**

```
Header: X-API-Key: <your-api-key>
```

**Body:** Empty

**Response (200 OK):**

```json
{
  "isSuccess": true,
  "message": "CV deleted successfully"
}
```

---

## Job Endpoints

## 5. Create Job

### POST /api/jobs

Create a new job posting and save its embedding.

**URL:**

```
POST http://localhost:8080/api/jobs
```

**Auth:**

```
Header: X-API-Key: <your-api-key>
```

**Body (JSON):**

```json
{
  "jobId": "650e8400-e29b-41d4-a716-446655440001",
  "text": "We are looking for a Senior Backend Engineer with 8+ years of experience in microservices architecture. Must have expertise in Go, Kubernetes, and distributed systems. Strong communication and mentoring skills required."
}
```

**Validation Rules:**

- `jobId`: Required, must be valid UUID
- `text`: Required, minimum 10 characters

**Response (201 Created):**

```json
{
  "isSuccess": true,
  "message": "Job created successfully",
  "data": {
    "jobId": "650e8400-e29b-41d4-a716-446655440001"
  }
}
```

---

## 6. Get Job

### GET /api/jobs/:id

Retrieve job posting data by ID.

**URL:**

```
GET http://localhost:8080/api/jobs/650e8400-e29b-41d4-a716-446655440001
```

**Auth:**

```
Header: X-API-Key: <your-api-key>
```

**Body:** Empty

**Response (200 OK):**

```json
{
  "isSuccess": true,
  "message": "Job retrieved successfully",
  "data": {
    "jobId": "650e8400-e29b-41d4-a716-446655440001",
    "text": "We are looking for a Senior Backend Engineer with 8+ years of experience..."
  }
}
```

---

## 7. Delete Job

### DELETE /api/jobs/:id

Delete a job posting by ID.

**URL:**

```
DELETE http://localhost:8080/api/jobs/650e8400-e29b-41d4-a716-446655440001
```

**Auth:**

```
Header: X-API-Key: <your-api-key>
```

**Body:** Empty

**Response (200 OK):**

```json
{
  "isSuccess": true,
  "message": "Job deleted successfully"
}
```

---

## 8. Compare CV with Job

### POST /api/jobs/evaluate

Compare a CV with a job posting using LLM for scoring and matching.

**URL:**

```
POST http://localhost:8080/api/jobs/evaluate
```

**Auth:**

```
Header: X-API-Key: <your-api-key>
```

**Body (JSON):**

```json
{
  "cvId": "550e8400-e29b-41d4-a716-446655440000",
  "jobId": "650e8400-e29b-41d4-a716-446655440001",
  "apiKey": "your-gemini-api-key",
  "model": "gemini-2.5-flash",
  "provider": "gemini"
}
```

**Validation Rules:**

- `cvId`: Required, must be valid UUID
- `jobId`: Required, must be valid UUID
- `apiKey`: Required, API key for LLM provider
- `model`: Required, model name (e.g., gpt-4, claude-3-opus, gemini-pro)
- `provider`: Required, must be one of: `openai`, `anthropic`, `gemini`

**Response (202 Accepted):**

```json
{
  "isSuccess": true,
  "message": "Comparison queued successfully",
  "data": {
    "id": "750e8400-e29b-41d4-a716-446655440002",
    "status": "enqueued"
  }
}
```

---

## 9. Get Comparison Result

### GET /api/jobs/result/:id

Retrieve the comparison result between CV and job. Possible statuses: pending, processing, completed, failed.

**URL:**

```
GET http://localhost:8080/api/jobs/result/750e8400-e29b-41d4-a716-446655440002
```

**Auth:**

```
Header: X-API-Key: <your-api-key>
```

**Body:** Empty

**Response (200 OK):**

```json
{
  "isSuccess": true,
  "message": "Comparison result retrieved successfully",
  "data": {
    "comparisonId": "750e8400-e29b-41d4-a716-446655440002",
    "status": "completed",
    "result": {
      "matchPercentage": 85,
      "matchedSkills": ["Go", "Microservices", "System Design"],
      "missingSkills": ["Kubernetes", "Docker"],
      "summary": "Strong match with 85% skill alignment. Candidate has excellent backend experience but lacks some containerization expertise.",
      "recommendations": "Consider training on Kubernetes and Docker for perfect fit."
    }
  }
}
```

---

## Error Responses

### 400 Bad Request

Validation failed or request format is incorrect.

```json
{
  "isSuccess": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "userId",
      "message": "userId must be a valid UUID"
    }
  ]
}
```

### 401 Unauthorized

API Key is invalid or missing.

```json
{
  "isSuccess": false,
  "message": "Invalid API Key"
}
```

### 404 Not Found

Resource not found.

```json
{
  "isSuccess": false,
  "message": "CV not found"
}
```

### 500 Internal Server Error

Server error occurred.

```json
{
  "isSuccess": false,
  "message": "Internal server error"
}
```

---

## Postman Collection Template

Here is a template for testing in Postman:

### Setup in Postman:

1. **Create Environment Variables:**

   - `base_url`: `http://localhost:8080`
   - `api_key`: `your-api-key-here`
   - `cv_id`: `550e8400-e29b-41d4-a716-446655440000`
   - `job_id`: `650e8400-e29b-41d4-a716-446655440001`
   - `comparison_id`: `750e8400-e29b-41d4-a716-446655440002`

2. **Required headers for each request:**

   ```
   X-API-Key: {{api_key}}
   Content-Type: application/json
   ```

3. **URLs in Postman:**
   - Create CV: `{{base_url}}/api/cvs`
   - Get CV: `{{base_url}}/api/cvs/{{cv_id}}`
   - Delete CV: `{{base_url}}/api/cvs/{{cv_id}}`
   - Create Job: `{{base_url}}/api/jobs`
   - Get Job: `{{base_url}}/api/jobs/{{job_id}}`
   - Delete Job: `{{base_url}}/api/jobs/{{job_id}}`
   - Compare: `{{base_url}}/api/jobs/evaluate`
   - Get Result: `{{base_url}}/api/jobs/result/{{comparison_id}}`
