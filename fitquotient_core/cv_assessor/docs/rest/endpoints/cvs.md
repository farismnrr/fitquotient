# CV Endpoints

Manage CV documents for users. CVs are stored with their text content and automatically indexed as vector embeddings in Qdrant for semantic search.

## Overview

| Method   | Endpoint       | Description       | Status |
| -------- | -------------- | ----------------- | ------ |
| `POST`   | `/api/cvs`     | Create a new CV   | 201    |
| `GET`    | `/api/cvs/:id` | Retrieve CV by ID | 200    |
| `DELETE` | `/api/cvs/:id` | Delete a CV       | 200    |

---

## Create CV

Create and store a new CV document.

### Request

```
POST /api/cvs
X-API-Key: your-api-key
Content-Type: application/json
```

### Request Body

| Field       | Type          | Required | Validation         | Description                                         |
| ----------- | ------------- | -------- | ------------------ | --------------------------------------------------- |
| `cvId`      | string (UUID) | Yes      | `required,uuid`    | Unique identifier for the CV                        |
| `userId`    | string (UUID) | Yes      | `required,uuid`    | User ID who owns the CV                             |
| `filename`  | string        | Yes      | `required,max=255` | Original filename of the CV                         |
| `sourceUrl` | string        | Yes      | `required,url`     | URL source of the CV                                |
| `text`      | string        | Yes      | `required,min=10`  | Full text content of the CV (minimum 10 characters) |

### Example Request

```bash
curl -X POST http://localhost:8080/api/cvs \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "cvId": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "987e6543-e89b-12d3-a456-426614174999",
    "filename": "john_doe_resume.pdf",
    "sourceUrl": "https://example.com/files/john_doe_resume.pdf",
    "text": "John Doe is a software engineer with 5 years of experience in backend development..."
  }'
```

### Success Response (201 Created)

```json
{
  "is_success": true,
  "message": "CV created successfully",
  "data": {
    "cvId": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

### Error Responses

#### 400 Bad Request (Validation Failed)

```json
{
  "is_success": false,
  "message": "Validation failed: field 'cvId' must be a valid UUID"
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
  "message": "Failed to save CV"
}
```

### What Happens

1. CV text is validated and stored
2. Vector embeddings are generated (384-dimensional)
3. Text is chunked and stored in Qdrant for semantic search
4. ID is returned for future reference

---

## Get CV

Retrieve a CV by its ID.

### Request

```
GET /api/cvs/:id
X-API-Key: your-api-key
```

### URL Parameters

| Parameter | Type          | Required | Validation      | Description           |
| --------- | ------------- | -------- | --------------- | --------------------- |
| `id`      | string (UUID) | Yes      | `required,uuid` | The CV ID to retrieve |

### Example Request

```bash
curl -X GET http://localhost:8080/api/cvs/123e4567-e89b-12d3-a456-426614174000 \
  -H "X-API-Key: your-api-key"
```

### Success Response (200 OK)

```json
{
  "is_success": true,
  "message": "CV retrieved successfully",
  "data": {
    "cvId": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "987e6543-e89b-12d3-a456-426614174999",
    "filename": "john_doe_resume.pdf",
    "sourceUrl": "https://example.com/files/john_doe_resume.pdf",
    "text": "John Doe is a software engineer with 5 years of experience in backend development..."
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
  "message": "CV not found"
}
```

---

## Delete CV

Delete a CV by its ID.

### Request

```
DELETE /api/cvs/:id
X-API-Key: your-api-key
```

### URL Parameters

| Parameter | Type          | Required | Validation      | Description         |
| --------- | ------------- | -------- | --------------- | ------------------- |
| `id`      | string (UUID) | Yes      | `required,uuid` | The CV ID to delete |

### Example Request

```bash
curl -X DELETE http://localhost:8080/api/cvs/123e4567-e89b-12d3-a456-426614174000 \
  -H "X-API-Key: your-api-key"
```

### Success Response (200 OK)

```json
{
  "is_success": true,
  "message": "CV deleted successfully"
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
  "message": "CV not found"
}
```

### What Happens

1. CV is deleted from database
2. Vector embeddings are removed from Qdrant
3. All associated comparison records may be affected

---

See [evaluations.md](./evaluations.md) to learn how to compare CVs with jobs.
