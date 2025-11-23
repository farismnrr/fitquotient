# User CVs Endpoints

## 1. Upload CV

Upload a CV file for a user.

**Method:** `POST`  
**Endpoint:** `/users/:userId/cvs`  
**Authentication:** JWT Guard  
**Content-Type:** `multipart/form-data`  
**Status Code:** 201 Created

### Path Parameters

| Parameter | Type | Description                  |
| --------- | ---- | ---------------------------- |
| userId    | UUID | The user's unique identifier |

### Request Body

**Multipart Form:**

```
file: binary (required)
```

### Supported File Types

- PDF (.pdf)
- Word (.doc, .docx)
- Text (.txt)
- Other document formats

### File Size Limits

- Maximum: 10 MB (configurable)

### Success Response (201)

```json
{
  "is_success": true,
  "message": "CV uploaded successfully",
  "data": {
    "cv_id": "550e8400-e29b-41d4-a716-446655440001",
    "url": "https://storage.example.com/cvs/550e8400-e29b-41d4-a716-446655440001.pdf"
  }
}
```

### Error Response (400/404/413)

```json
{
  "is_success": false,
  "message": "File size exceeds limit",
  "errors": []
}
```

### Notes

- CV is processed and stored in cloud storage
- Vector embedding is generated for AI analysis
- Multiple CVs can be uploaded per user

---

## 2. Get CV by ID

Retrieve CV information and metadata.

**Method:** `GET`  
**Endpoint:** `/users/:userId/cvs/:cvId`  
**Authentication:** JWT Guard  
**Status Code:** 200 OK

### Path Parameters

| Parameter | Type | Description                  |
| --------- | ---- | ---------------------------- |
| userId    | UUID | The user's unique identifier |
| cvId      | UUID | The CV's unique identifier   |

### Success Response (200)

```json
{
  "is_success": true,
  "message": "CV retrieved successfully",
  "data": {
    "cv": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "john_doe_resume.pdf",
      "mimetype": "application/pdf",
      "url": "https://storage.example.com/cvs/550e8400-e29b-41d4-a716-446655440001.pdf",
      "vectorEmbedding": {
        "embedding": [0.1, 0.2, 0.3, ...],
        "model": "text-embedding-3-small",
        "provider": "openai"
      },
      "createdAt": "2025-11-16T10:30:45.123Z",
      "updatedAt": "2025-11-16T10:30:45.123Z"
    }
  }
}
```

### Error Response (404/403)

```json
{
  "is_success": false,
  "message": "CV not found",
  "errors": []
}
```

---

## 3. Delete CV

Soft delete a CV file.

**Method:** `DELETE`  
**Endpoint:** `/users/:userId/cvs/:cvId`  
**Authentication:** JWT Guard  
**Status Code:** 200 OK

### Path Parameters

| Parameter | Type | Description                  |
| --------- | ---- | ---------------------------- |
| userId    | UUID | The user's unique identifier |
| cvId      | UUID | The CV's unique identifier   |

### Success Response (200)

```json
{
  "is_success": true,
  "message": "CV deleted successfully",
  "data": null
}
```

### Error Response (404/403)

```json
{
  "is_success": false,
  "message": "CV not found",
  "errors": []
}
```

### Notes

- This is a soft delete operation
- CV file is marked as deleted but not removed from storage
- File URL becomes inaccessible
- Vector embedding is preserved for audit purposes

---

## CV Data Structure

### Vector Embedding

The CV is analyzed and converted to a vector embedding for similarity matching:

```json
{
  "embedding": [
    0.123, 0.456, 0.789, ...
  ],
  "model": "text-embedding-3-small",
  "provider": "openai",
  "createdAt": "2025-11-16T10:30:45.123Z"
}
```

### Extracted CV Information

When a CV is uploaded, the system extracts:

- Skills
- Experience
- Education
- Languages
- Certifications
- Contact information

This information is used for job matching and evaluation.

---

## Usage Examples

### Example: Upload CV with cURL

```bash
curl -X POST http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000/cvs \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "file=@/path/to/resume.pdf"
```

### Example: Get CV Information

```bash
curl -X GET http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000/cvs/550e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Example: Delete CV

```bash
curl -X DELETE http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000/cvs/550e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
