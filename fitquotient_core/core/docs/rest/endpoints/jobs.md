# Jobs Endpoints

## 1. Create Job

Create a new job posting.

**Method:** `POST`  
**Endpoint:** `/jobs`  
**Authentication:** JWT Guard  
**Status Code:** 201 Created

### Request Body

```json
{
  "title": "string",
  "description": "string (optional)",
  "requirements": "string (optional)",
  "details": "object (optional)",
  "apiKeyId": "UUID",
  "userId": "UUID",
  "userCvId": "UUID (optional)"
}
```

### Validation Rules

- `title` - Required, must be a string
- `description` - Optional, string
- `requirements` - Optional, string
- `details` - Optional, can be any object
- `apiKeyId` - Required, must be a valid UUID
- `userId` - Required, must be a valid UUID
- `userCvId` - Optional, must be a valid UUID if provided

### Success Response (201)

```json
{
  "is_success": true,
  "message": "Job created successfully",
  "data": {
    "job_id": "550e8400-e29b-41d4-a716-446655440010"
  }
}
```

### Error Response (400/403)

```json
{
  "is_success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "title must be a string"
    }
  ]
}
```

---

## 2. Get Job by ID

Retrieve job posting information.

**Method:** `GET`  
**Endpoint:** `/jobs/:id`  
**Authentication:** JWT Guard  
**Status Code:** 200 OK

### Path Parameters

| Parameter | Type | Description                 |
| --------- | ---- | --------------------------- |
| id        | UUID | The job's unique identifier |

### Success Response (200)

```json
{
  "is_success": true,
  "message": "Job retrieved successfully",
  "data": {
    "job": {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "title": "Senior Software Engineer",
      "description": "We are looking for an experienced software engineer...",
      "requirements": "5+ years experience with TypeScript, Node.js, React...",
      "details": {
        "salary": "$120,000 - $150,000",
        "location": "Remote",
        "jobType": "Full-time"
      },
      "isActive": true,
      "createdAt": "2025-11-16T10:30:45.123Z",
      "updatedAt": "2025-11-16T10:30:45.123Z",
      "apiKeyId": "550e8400-e29b-41d4-a716-446655440005",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "userCvId": "550e8400-e29b-41d4-a716-446655440001"
    }
  }
}
```

### Error Response (404/403)

```json
{
  "is_success": false,
  "message": "Job not found",
  "errors": []
}
```

---

## 3. Update Job

Update job posting details.

**Method:** `PUT`  
**Endpoint:** `/jobs/:id`  
**Authentication:** JWT Guard  
**Status Code:** 200 OK

### Path Parameters

| Parameter | Type | Description                 |
| --------- | ---- | --------------------------- |
| id        | UUID | The job's unique identifier |

### Request Body (All fields optional)

```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "requirements": "string (optional)",
  "details": "object (optional)",
  "isActive": "boolean (optional)",
  "apiKeyId": "UUID (optional)",
  "userId": "UUID (optional)",
  "userCvId": "UUID (optional)"
}
```

### Success Response (200)

```json
{
  "is_success": true,
  "message": "Job updated successfully",
  "data": null
}
```

### Error Response (400/404/403)

```json
{
  "is_success": false,
  "message": "Job not found",
  "errors": []
}
```

---

## 4. Delete Job

Soft delete a job posting.

**Method:** `DELETE`  
**Endpoint:** `/jobs/:id`  
**Authentication:** JWT Guard  
**Status Code:** 200 OK

### Path Parameters

| Parameter | Type | Description                 |
| --------- | ---- | --------------------------- |
| id        | UUID | The job's unique identifier |

### Success Response (200)

```json
{
  "is_success": true,
  "message": "Job deleted successfully",
  "data": null
}
```

### Error Response (404/403)

```json
{
  "is_success": false,
  "message": "Job not found",
  "errors": []
}
```

### Notes

- This is a soft delete operation
- Job data is preserved in the database
- Job will not appear in future queries
- Associated evaluations are preserved for audit

---

## Job Details Structure

The `details` field can contain any custom information:

```json
{
  "details": {
    "salary": "$120,000 - $150,000",
    "location": "Remote",
    "jobType": "Full-time",
    "company": "Tech Corp",
    "department": "Engineering",
    "yearsExperience": 5,
    "skills": ["TypeScript", "Node.js", "React", "PostgreSQL"]
  }
}
```

---

## Usage Examples

### Example: Create Job

```bash
curl -X POST http://localhost:5400/api/jobs \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Software Engineer",
    "description": "We are looking for an experienced software engineer",
    "requirements": "5+ years experience with TypeScript, Node.js, React",
    "apiKeyId": "550e8400-e29b-41d4-a716-446655440005",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "details": {
      "salary": "$120,000 - $150,000",
      "location": "Remote"
    }
  }'
```

### Example: Get Job

```bash
curl -X GET http://localhost:5400/api/jobs/550e8400-e29b-41d4-a716-446655440010 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Example: Update Job

```bash
curl -X PUT http://localhost:5400/api/jobs/550e8400-e29b-41d4-a716-446655440010 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Software Engineer (Updated)",
    "details": {
      "salary": "$130,000 - $160,000"
    }
  }'
```

### Example: Delete Job

```bash
curl -X DELETE http://localhost:5400/api/jobs/550e8400-e29b-41d4-a716-446655440010 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
