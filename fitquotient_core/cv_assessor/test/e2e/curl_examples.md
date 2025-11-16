# CV Assessor API - cURL Examples

This guide provides cURL command examples for all API endpoints.

---

## 1. Health Check

Check if the server is running.

```bash
curl -X GET "http://localhost:8080/healthcheck"
```

---

## CV Endpoints

### 2. Create CV

Create a new CV with embedding.

```bash
curl -X POST "http://localhost:8080/api/cvs" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "cvId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "john_doe_cv.pdf",
    "sourceUrl": "https://example.com/cvs/john_doe.pdf",
    "text": "John Doe is a senior software engineer with 10 years of experience in full-stack development. Skilled in React, Node.js, Go, and cloud technologies. Strong background in system design and team leadership."
  }'
```

### 3. Get CV

Retrieve CV data by ID.

```bash
curl -X GET "http://localhost:8080/api/cvs/550e8400-e29b-41d4-a716-446655440000" \
  -H "X-API-Key: your_api_key_here"
```

### 4. Delete CV

Delete a CV by ID.

```bash
curl -X DELETE "http://localhost:8080/api/cvs/550e8400-e29b-41d4-a716-446655440000" \
  -H "X-API-Key: your_api_key_here"
```

---

## Job Endpoints

### 5. Create Job

Create a new job posting with embedding.

```bash
curl -X POST "http://localhost:8080/api/jobs" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "jobId": "650e8400-e29b-41d4-a716-446655440001",
    "text": "We are looking for a Senior Backend Engineer with 8+ years of experience in microservices architecture. Must have expertise in Go, Kubernetes, and distributed systems. Strong communication and mentoring skills required."
  }'
```

### 6. Get Job

Retrieve job posting data by ID.

```bash
curl -X GET "http://localhost:8080/api/jobs/650e8400-e29b-41d4-a716-446655440001" \
  -H "X-API-Key: your_api_key_here"
```

### 7. Delete Job

Delete a job posting by ID.

```bash
curl -X DELETE "http://localhost:8080/api/jobs/650e8400-e29b-41d4-a716-446655440001" \
  -H "X-API-Key: your_api_key_here"
```

---

## Comparison Endpoints

### 8. Compare CV with Job

Compare a CV with a job posting using LLM for scoring and matching.

```bash
curl -X POST "http://localhost:8080/api/jobs/evaluate" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "cvId": "550e8400-e29b-41d4-a716-446655440000",
    "jobId": "650e8400-e29b-41d4-a716-446655440001",
    "apiKey": "your-gemini-api-key",
    "model": "gemini-2.5-flash",
    "provider": "gemini"
  }'
```

### 9. Get Comparison Result

Retrieve the comparison result between CV and job.

```bash
curl -X GET "http://localhost:8080/api/jobs/result/750e8400-e29b-41d4-a716-446655440002" \
  -H "X-API-Key: your_api_key_here"
```

---

## Quick Test Workflow

Run these commands in sequence to test the complete workflow:

```bash
# 1. Check health
curl -X GET "http://localhost:8080/healthcheck"

# 2. Create CV
curl -X POST "http://localhost:8080/api/cvs" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "cvId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "john_doe_cv.pdf",
    "sourceUrl": "https://example.com/cvs/john_doe.pdf",
    "text": "John Doe is a senior software engineer with 10 years of experience in full-stack development. Skilled in React, Node.js, Go, and cloud technologies."
  }'

# 3. Create Job
curl -X POST "http://localhost:8080/api/jobs" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "jobId": "650e8400-e29b-41d4-a716-446655440001",
    "text": "We are looking for a Senior Backend Engineer with 8+ years of experience in microservices architecture. Must have expertise in Go, Kubernetes, and distributed systems."
  }'

# 4. Get CV
curl -X GET "http://localhost:8080/api/cvs/550e8400-e29b-41d4-a716-446655440000" \
  -H "X-API-Key: your_api_key_here"

# 5. Get Job
curl -X GET "http://localhost:8080/api/jobs/650e8400-e29b-41d4-a716-446655440001" \
  -H "X-API-Key: your_api_key_here"

# 6. Delete CV
curl -X DELETE "http://localhost:8080/api/cvs/550e8400-e29b-41d4-a716-446655440000" \
  -H "X-API-Key: your_api_key_here"

# 7. Delete Job
curl -X DELETE "http://localhost:8080/api/jobs/650e8400-e29b-41d4-a716-446655440001" \
  -H "X-API-Key: your_api_key_here"
```

---

## Pretty Print JSON Response

Use `jq` to format JSON responses:

```bash
curl -s -X GET "http://localhost:8080/api/cvs/550e8400-e29b-41d4-a716-446655440000" \
  -H "X-API-Key: your_api_key_here" | jq .
```

---

## Error Handling Examples

### Invalid API Key

```bash
curl -X GET "http://localhost:8080/api/cvs/550e8400-e29b-41d4-a716-446655440000" \
  -H "X-API-Key: wrong_key"
```

Response:

```json
{
  "isSuccess": false,
  "message": "Invalid API Key"
}
```

### Missing Required Field

```bash
curl -X POST "http://localhost:8080/api/cvs" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "cv.pdf"
  }'
```

Response:

```json
{
  "isSuccess": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "cvId",
      "message": "cvId is a required field"
    },
    {
      "field": "sourceUrl",
      "message": "sourceUrl is a required field"
    },
    {
      "field": "text",
      "message": "text is a required field"
    }
  ]
}
```

### Invalid UUID Format

```bash
curl -X GET "http://localhost:8080/api/cvs/invalid-uuid" \
  -H "X-API-Key: your_api_key_here"
```

Response:

```json
{
  "isSuccess": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "id",
      "message": "id must be a valid UUID"
    }
  ]
}
```

---

## Tips

- Use `-s` flag to suppress progress meter in cURL
- Use `| jq .` to pretty-print JSON responses (requires jq to be installed)
- Use `-v` flag to see request/response headers: `curl -v ...`
- Use `--data-binary` instead of `-d` for sending binary data
- Add `-i` flag to include response headers in output
