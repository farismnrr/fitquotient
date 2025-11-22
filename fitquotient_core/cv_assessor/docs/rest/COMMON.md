# Common Response Formats & Standards

## Standard Success Response

All successful API responses follow this format:

```json
{
  "is_success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data specific to the endpoint
  }
}
```

## Standard Error Response

All error responses follow this format:

```json
{
  "is_success": false,
  "message": "Error description"
}
```

## HTTP Status Codes

| Status | Meaning               | Description                                               |
| ------ | --------------------- | --------------------------------------------------------- |
| `200`  | OK                    | Request succeeded                                         |
| `201`  | Created               | Resource created successfully                             |
| `202`  | Accepted              | Request accepted but not yet completed (async operations) |
| `400`  | Bad Request           | Validation failed or malformed request                    |
| `401`  | Unauthorized          | Missing or invalid API key                                |
| `404`  | Not Found             | Resource not found                                        |
| `409`  | Conflict              | Resource already exists or conflict                       |
| `500`  | Internal Server Error | Server error                                              |

## Response Field Descriptions

### Success Response

| Field        | Type    | Required | Description                           |
| ------------ | ------- | -------- | ------------------------------------- |
| `is_success` | boolean | Yes      | Always `true` for success             |
| `message`    | string  | Yes      | Human-readable success message        |
| `data`       | object  | No       | Response payload (varies by endpoint) |

### Error Response

| Field        | Type    | Required | Description               |
| ------------ | ------- | -------- | ------------------------- |
| `is_success` | boolean | Yes      | Always `false` for errors |
| `message`    | string  | Yes      | Error description         |

## Validation Rules

All request bodies are validated. Common validation rules:

| Rule          | Example                             | Description               |
| ------------- | ----------------------------------- | ------------------------- |
| `required`    | `json:"cvId" validate:"required"`   | Field must be present     |
| `uuid`        | `validate:"required,uuid"`          | Must be valid UUID format |
| `url`         | `validate:"url"`                    | Must be valid URL         |
| `min=N`       | `validate:"min=10"`                 | Minimum string length N   |
| `max=N`       | `validate:"max=255"`                | Maximum string length N   |
| `oneof=X Y Z` | `validate:"oneof=openai anthropic"` | Must be one of values     |

## Common Data Types

### UUID

Standard UUID v4 format:

```
123e4567-e89b-12d3-a456-426614174000
```

### URL

Must be valid URL format:

```
https://example.com/path
```

## Async Operations

Some operations are asynchronous (e.g., CV-Job comparison). These return `202 Accepted`:

```json
{
  "is_success": true,
  "message": "Comparison queued successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "enqueued"
  }
}
```

Use the returned ID to poll for results later.

## Rate Limiting

No rate limiting is currently implemented. However, it's recommended to:

- Avoid spamming requests
- Implement exponential backoff for failed requests
- Cache successful responses appropriately

---

See [AUTHENTICATION.md](./AUTHENTICATION.md) for authentication details.
