# Authentication & Security

## API Key Authentication

All API endpoints require authentication via the `X-API-Key` header.

### Request Header

```
X-API-Key: your-api-key
```

### Example Request

```bash
curl -X GET http://localhost:8080/api/cvs/123e4567-e89b-12d3-a456-426614174000 \
  -H "X-API-Key: your-api-key"
```

## Error Responses

When authentication fails or a request is invalid, the API returns an error response.

### 401 Unauthorized

```json
{
  "is_success": false,
  "message": "API key is missing or invalid"
}
```

### 400 Bad Request

```json
{
  "is_success": false,
  "message": "Validation failed: field 'cvId' must be a valid UUID"
}
```

### 404 Not Found

```json
{
  "is_success": false,
  "message": "CV not found"
}
```

### 500 Internal Server Error

```json
{
  "is_success": false,
  "message": "An internal server error occurred"
}
```

## Middleware Stack

The API uses the following middleware in order:

1. **PoweredBy** - Adds `X-Powered-By` header to responses
2. **ErrorHandler** - Catches and transforms errors into standard responses
3. **ApiKey** - Validates `X-API-Key` header

## Validation Rules

All request bodies are validated using the Go Playground Validator. Common validation rules:

- `required` - Field is mandatory
- `uuid` - Must be a valid UUID
- `url` - Must be a valid URL
- `min=N` - String minimum length
- `max=N` - String maximum length
- `oneof=value1 value2` - Must be one of specified values

## Error Codes

The service uses standardized error codes:

| Code                    | HTTP Status | Description                         |
| ----------------------- | ----------- | ----------------------------------- |
| `NOT_FOUND`             | 404         | Resource not found                  |
| `INVALID_INPUT`         | 400         | Validation failed                   |
| `UNAUTHORIZED`          | 401         | API key missing or invalid          |
| `CONFLICT`              | 409         | Resource already exists or conflict |
| `INTERNAL_SERVER_ERROR` | 500         | Server error                        |

---

See [COMMON.md](./COMMON.md) for standard response formats.
