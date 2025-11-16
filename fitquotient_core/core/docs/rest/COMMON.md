# Common Information

## Standard Response Format

All endpoints follow a consistent response format for both success and error cases.

### Success Response

```json
{
  "isSuccess": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response

```json
{
  "isSuccess": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

## HTTP Status Codes

| Code | Description           | Common Use Cases                               |
| ---- | --------------------- | ---------------------------------------------- |
| 200  | OK                    | Successful GET, PUT, PATCH, DELETE             |
| 201  | Created               | Successful POST that creates a resource        |
| 400  | Bad Request           | Invalid input, validation errors               |
| 401  | Unauthorized          | Missing or invalid authentication              |
| 403  | Forbidden             | Authenticated but no permission                |
| 404  | Not Found             | Resource doesn't exist                         |
| 409  | Conflict              | Resource already exists (e.g., duplicate user) |
| 413  | Payload Too Large     | File size exceeds limit                        |
| 500  | Internal Server Error | Server-side error                              |

## Data Types & Formats

### UUID Format

```
550e8400-e29b-41d4-a716-446655440000
```

### ISO 8601 Date Format

```
2025-11-16T10:30:45.123Z
```

### Email Format

```
user@example.com
```

## Validation Rules

### Password Requirements

- Minimum length: 8 characters
- Must match confirmation password when creating/updating

### Username

- Must be unique
- Can contain letters, numbers, underscores, hyphens

### Email

- Must be valid email format
- Must be unique

### Phone (Optional)

- Valid phone number format

### API Key / Secret

- Will be encrypted before storage
- Cannot be retrieved after creation

## Input Transformation

All requests are transformed automatically:

1. **Whitelist** - Only whitelisted fields are accepted
2. **Type Conversion** - Types are converted implicitly when possible
3. **Case Transformation** - Request/response bodies are case-transformed for consistency
4. **Validation** - All fields are validated according to DTO rules

## Pagination & Filtering

Currently, the API does not support pagination or filtering. List endpoints return all records.

Future releases may include:

- Limit/offset parameters
- Sorting options
- Filter parameters

## Soft Deletes

The API uses soft deletes for data integrity:

- Records are marked as deleted but not removed from the database
- Deleted records are excluded from list/get operations
- Original data is preserved for audit trails

## Error Handling

### Validation Error Response

```json
{
  "isSuccess": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "email must be an email"
    },
    {
      "field": "password",
      "message": "password must be longer than or equal to 8 characters"
    }
  ]
}
```

### Not Found Response

```json
{
  "isSuccess": false,
  "message": "User not found",
  "errors": []
}
```

### Conflict Response

```json
{
  "isSuccess": false,
  "message": "User with this email already exists",
  "errors": []
}
```

## Request Headers

### Required Headers

```
Content-Type: application/json
```

### Optional Headers

```
Accept: application/json
User-Agent: YourApp/1.0
```

### Multipart Upload

```
Content-Type: multipart/form-data
```

## Rate Limiting

Currently, there are no rate limiting restrictions. Rate limiting may be implemented in future versions.

## CORS

Cross-Origin Resource Sharing (CORS) is enabled for development. Configuration may be adjusted for production.

## API Versioning

Current API version: v1

All endpoints use the following base path:

```
/api/v1/
```

Future versions will maintain backward compatibility where possible.

## Timestamps

- All timestamps are in UTC (ISO 8601 format)
- `createdAt` - When the resource was created
- `updatedAt` - When the resource was last modified

## Notes

- Null values in response data mean the field is not applicable or was not provided
- Optional fields may not appear in responses if not set
- List endpoints return empty arrays if no records exist
- Soft deleted records are automatically excluded from queries
