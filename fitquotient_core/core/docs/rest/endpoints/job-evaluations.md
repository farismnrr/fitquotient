# Job Evaluations Endpoints

## 1. Evaluate Job

Evaluate a job against a user's CV using LLM analysis.

**Method:** `POST`  
**Endpoint:** `/jobs/evaluate`  
**Authentication:** JWT Guard  
**Status Code:** 200 OK

### Request Body

```json
{
  "jobId": "UUID",
  "userId": "UUID",
  "model": "string",
  "provider": "OPENAI | ANTHROPIC | GOOGLE"
}
```

### Validation Rules

- `jobId` - Required, must be a valid UUID
- `userId` - Required, must be a valid UUID
- `model` - Required, string (e.g., "gpt-4", "claude-3-sonnet")
- `provider` - Required, must be one of: OPENAI, ANTHROPIC, GOOGLE

### Success Response (200)

```json
{
  "isSuccess": true,
  "message": "Job evaluated successfully",
  "data": {
    "matchPercentage": 85,
    "matchedSkills": [
      "TypeScript",
      "Node.js",
      "React",
      "PostgreSQL",
      "Docker"
    ],
    "vectorEmbedding": {
      "embedding": [0.1, 0.2, 0.3, ...],
      "model": "text-embedding-3-small",
      "provider": "openai"
    },
    "summary": "Your profile matches 85% of the job requirements. You have strong expertise in the required tech stack."
  }
}
```

### Error Response (400/404/403)

```json
{
  "isSuccess": false,
  "message": "Job not found",
  "errors": []
}
```

### Processing Notes

1. The system retrieves the job and user's CV
2. CV is analyzed by the LLM to extract skills and experience
3. Job requirements are analyzed
4. Similarity matching is performed
5. A detailed comparison report is generated
6. Results are cached for future retrieval

---

## 2. Get Job Comparison Result

Retrieve comparison result between a CV and a job posting.

**Method:** `GET`  
**Endpoint:** `/jobs/result/:cvId-:jobId`  
**Authentication:** JWT Guard  
**Status Code:** 200 OK

### Path Parameters

| Parameter | Type | Description                 |
| --------- | ---- | --------------------------- |
| cvId      | UUID | The CV's unique identifier  |
| jobId     | UUID | The job's unique identifier |

### Path Parameter Format

The endpoint uses a composite parameter format: `cvId-jobId`

Example: `/jobs/result/550e8400-e29b-41d4-a716-446655440001-550e8400-e29b-41d4-a716-446655440010`

### Success Response (200)

```json
{
  "isSuccess": true,
  "message": "Comparison result retrieved successfully",
  "data": {
    "comparisonId": "550e8400-e29b-41d4-a716-446655440020",
    "status": "COMPLETED",
    "result": {
      "matchPercentage": 85,
      "matchedSkills": [
        "TypeScript",
        "Node.js",
        "React",
        "PostgreSQL",
        "Docker"
      ],
      "missingSkills": ["Kubernetes", "AWS Lambda", "GraphQL"],
      "summary": "Your profile matches 85% of the job requirements. You have strong expertise in the required tech stack.",
      "recommendations": "Consider learning Kubernetes and AWS Lambda to improve your match percentage. These are becoming increasingly important in modern DevOps practices."
    }
  }
}
```

### Status Values

| Status    | Description                       |
| --------- | --------------------------------- |
| PENDING   | Evaluation is in progress         |
| COMPLETED | Evaluation completed successfully |
| FAILED    | Evaluation failed                 |

### Error Response (404/403)

```json
{
  "isSuccess": false,
  "message": "Comparison result not found",
  "errors": []
}
```

---

## Evaluation Result Structure

### Match Percentage

- Range: 0-100
- Calculated based on skill overlap and experience level
- Higher percentage indicates better job fit

### Matched Skills

- List of skills found in both CV and job requirements
- Indicates areas of strength

### Missing Skills

- List of skills in job requirements but not in CV
- Indicates areas for improvement

### Summary

- Human-readable overview of the match
- Key highlights and observations

### Recommendations

- Actionable suggestions for improving job fit
- Learning path recommendations

---

## LLM Providers

### OpenAI

- Models: gpt-4, gpt-4-turbo, gpt-3.5-turbo
- Provider value: `OPENAI`
- Default embeddings model: text-embedding-3-small

### Anthropic

- Models: claude-3-opus, claude-3-sonnet, claude-3-haiku
- Provider value: `ANTHROPIC`

### Google

- Models: gemini-pro, gemini-1.5-flash
- Provider value: `GOOGLE`

---

## Usage Examples

### Example: Evaluate Job

```bash
curl -X POST http://localhost:3000/api/jobs/evaluate \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "550e8400-e29b-41d4-a716-446655440010",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "model": "gpt-4",
    "provider": "OPENAI"
  }'
```

### Example: Get Comparison Result

```bash
curl -X GET "http://localhost:3000/api/jobs/result/550e8400-e29b-41d4-a716-446655440001-550e8400-e29b-41d4-a716-446655440010" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Performance Notes

- Evaluations are asynchronous and may take time to complete
- Results are cached for subsequent retrievals
- Multiple evaluations with same CV and job are deduplicated
- Batch evaluation processing is supported internally

## Cost Considerations

- Each evaluation uses LLM API calls (costs depend on provider)
- Vector embeddings are generated and stored
- Consider evaluating only when necessary to minimize costs
