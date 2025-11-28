# Evaluation Endpoints

Compare CVs with job descriptions using AI-powered analysis. These endpoints handle the semantic matching and evaluation of CV-job compatibility.

## Overview

| Method | Endpoint               | Description               | Status |
| ------ | ---------------------- | ------------------------- | ------ |
| `POST` | `/api/jobs/evaluate`   | Start a CV-Job comparison | 202    |
| `GET`  | `/api/jobs/result/:id` | Get comparison result     | 200    |

---

## Compare CV with Job

Start an asynchronous evaluation to compare a CV against a job description using AI.

### Request

```
POST /api/jobs/evaluate
X-API-Key: your-api-key
Content-Type: application/json
```

### Request Body

| Field      | Type          | Required | Validation                               | Description                                                      |
| ---------- | ------------- | -------- | ---------------------------------------- | ---------------------------------------------------------------- |
| `cvId`     | string (UUID) | Yes      | `required,uuid`                          | ID of the CV to evaluate                                         |
| `jobId`    | string (UUID) | Yes      | `required,uuid`                          | ID of the job to compare against                                 |
| `apiKey`   | string        | Yes      | `required`                               | API key for the LLM provider                                     |
| `model`    | string        | Yes      | `required`                               | Model name to use (e.g., `gpt-4`, `claude-3-opus`, `gemini-pro`) |
| `provider` | string        | Yes      | `required,oneof=OPENAI ANTHROPIC GOOGLE` | LLM provider to use                                              |

### Example Request

```bash
curl -X POST http://localhost:5500/api/jobs/evaluate \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "cvId": "123e4567-e89b-12d3-a456-426614174000",
    "jobId": "456f7890-e89b-12d3-a456-426614174111",
    "apiKey": "sk-...",
    "model": "gpt-4",
    "provider": "OPENAI"
  }'
```

### Success Response (202 Accepted)

```json
{
  "is_success": true,
  "message": "Comparison queued successfully",
  "data": {
    "id": "789a1234-e89b-12d3-a456-426614174222",
    "status": "enqueued"
  }
}
```

The response includes:

- `id`: Comparison ID to use for polling results
- `status`: Current status (always `"enqueued"` on initial request)

### Error Responses

#### 400 Bad Request (Validation Failed)

```json
{
  "is_success": false,
  "message": "Validation failed: field 'provider' must be one of: OPENAI, ANTHROPIC, GOOGLE"
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
  "message": "CV not found"
}
```

#### 500 Internal Server Error

```json
{
  "is_success": false,
  "message": "Failed to start comparison"
}
```

### What Happens

1. CV and Job are retrieved and validated
2. Comparison task is queued in Redis
3. ID is returned immediately (asynchronous operation)
4. Background worker processes the comparison
5. Results are cached for later retrieval

### Supported LLM Providers

| Provider    | Models                                               | API Key Format |
| ----------- | ---------------------------------------------------- | -------------- |
| `openai`    | `gpt-4`, `gpt-4-turbo`, `gpt-3.5-turbo`              | `sk-...`       |
| `anthropic` | `claude-3-opus`, `claude-3-sonnet`, `claude-3-haiku` | `sk-ant-...`   |
| `gemini`    | `gemini-pro`, `gemini-pro-vision`                    | Google API key |

---

## Get Comparison Result

Retrieve the result of a CV-Job comparison. This endpoint should be polled until the comparison is complete.

### Request

```
GET /api/jobs/result/:id
X-API-Key: your-api-key
```

### URL Parameters

| Parameter | Type          | Required | Validation      | Description                                 |
| --------- | ------------- | -------- | --------------- | ------------------------------------------- |
| `id`      | string (UUID) | Yes      | `required,uuid` | The comparison ID from the evaluate request |

### Example Request

```bash
curl -X GET http://localhost:5500/api/jobs/result/789a1234-e89b-12d3-a456-426614174222 \
  -H "X-API-Key: your-api-key"
```

### Success Response - Pending (200 OK)

While the comparison is processing:

```json
{
  "is_success": true,
  "message": "Comparison result retrieved successfully",
  "data": {
    "comparisonId": "789a1234-e89b-12d3-a456-426614174222",
    "status": "processing",
    "result": null
  }
}
```

### Success Response - Complete (200 OK)

When the comparison is done:

```json
{
  "is_success": true,
  "message": "Comparison result retrieved successfully",
  "data": {
    "comparisonId": "789a1234-e89b-12d3-a456-426614174222",
    "status": "completed",
    "result": {
      "matchPercentage": 85,
      "matchResults": [
        {
          "skill": "Go Programming",
          "cvSkillLevel": "expert",
          "jobRequirementLevel": "required",
          "match": true,
          "confidence": 0.95
        },
        {
          "skill": "Kubernetes",
          "cvSkillLevel": "intermediate",
          "jobRequirementLevel": "required",
          "match": true,
          "confidence": 0.78
        },
        {
          "skill": "Python",
          "cvSkillLevel": "none",
          "jobRequirementLevel": "nice_to_have",
          "match": false,
          "confidence": 0.92
        }
      ],
      "summary": "The candidate has strong match for most core requirements. Missing some nice-to-have skills but overall a good fit.",
      "recommendations": [
        "Highlight Go experience in interviews",
        "Consider upskilling in Kubernetes",
        "Python knowledge would be beneficial"
      ]
    }
  }
}
```

### Result Object Fields

| Field             | Type   | Description                         |
| ----------------- | ------ | ----------------------------------- |
| `matchPercentage` | number | Overall match percentage (0-100)    |
| `matchResults`    | array  | Detailed skill-by-skill matching    |
| `summary`         | string | Human-readable summary of the match |
| `recommendations` | array  | Suggestions for improvement         |

### Match Result Fields

| Field                 | Type    | Description                                               |
| --------------------- | ------- | --------------------------------------------------------- |
| `skill`               | string  | Skill or requirement being evaluated                      |
| `cvSkillLevel`        | string  | Level in CV: `expert`, `intermediate`, `beginner`, `none` |
| `jobRequirementLevel` | string  | Level required: `required`, `nice_to_have`, `optional`    |
| `match`               | boolean | Whether there's a match                                   |
| `confidence`          | number  | Confidence score (0-1)                                    |

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
  "message": "Comparison result not found"
}
```

---

## Polling Strategy

For best results, implement exponential backoff when polling:

```javascript
async function getComparisonResult(comparisonId, maxAttempts = 30) {
  let attempt = 1;
  const maxDelay = 30000; // 30 seconds max

  while (attempt <= maxAttempts) {
    try {
      const response = await fetch(`/api/jobs/result/${comparisonId}`, {
        headers: { "X-API-Key": "your-api-key" },
      });

      const data = await response.json();

      if (data.data.status === "completed") {
        return data.data;
      }

      // Exponential backoff: 1s, 2s, 4s, 8s, etc.
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), maxDelay);
      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch (error) {
      console.error("Error fetching result:", error);
    }

    attempt++;
  }

  throw new Error("Comparison did not complete within timeout");
}
```

---

## Complete Workflow Example

See [evaluations-examples.md](../examples/evaluations-examples.md) for complete code examples.
