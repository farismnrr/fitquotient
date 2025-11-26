# Jobs & Evaluations Examples

## 1. Complete Job Creation & Evaluation Flow

### Step 1: Create a Job

**Request:**

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Full Stack Engineer",
    "description": "We are looking for an experienced full stack engineer to join our growing team.",
    "requirements": "5+ years of experience with TypeScript, Node.js, React, PostgreSQL, Docker, and AWS. Experience with microservices architecture is a plus.",
    "apiKeyId": "550e8400-e29b-41d4-a716-446655440005",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "details": {
      "salary": "$120,000 - $150,000",
      "location": "San Francisco, CA",
      "jobType": "Full-time",
      "company": "Tech Corp",
      "yearsExperience": 5,
      "skills": [
        "TypeScript",
        "Node.js",
        "React",
        "PostgreSQL",
        "Docker",
        "AWS"
      ]
    }
  }'
```

**Response (201):**

```json
{
  "is_success": true,
  "message": "Job created successfully",
  "data": {
    "job_id": "550e8400-e29b-41d4-a716-446655440010"
  }
}
```

---

### Step 2: Upload User CV

**Request:**

```bash
curl -X POST http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000/cvs \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "file=@/path/to/resume.pdf"
```

**Response (201):**

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

---

### Step 3: Evaluate Job Match

**Request:**

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

**Response (200):**

```json
{
  "is_success": true,
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
      "embedding": [0.123, 0.456, 0.789, ...],
      "model": "text-embedding-3-small",
      "provider": "openai"
    },
    "summary": "Your profile matches 85% of the job requirements. You have strong expertise in the required tech stack."
  }
}
```

---

### Step 4: Get Comparison Result (using comparisonId)

**Request:**

```bash
curl -X GET "http://localhost:3000/api/jobs/result/550e8400-e29b-41d4-a716-446655440020" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200):**

```json
{
  "is_success": true,
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
      "missingSkills": ["AWS Lambda", "Kubernetes", "GraphQL"],
      "summary": "Your profile matches 85% of the job requirements. You have strong expertise in the required tech stack.",
      "recommendations": "Consider learning AWS Lambda and Kubernetes to improve your match percentage. These are becoming increasingly important in modern DevOps practices."
    }
  }
}
```

---

## 2. Get Job Details

**Request:**

```bash
curl -X GET http://localhost:3000/api/jobs/550e8400-e29b-41d4-a716-446655440010 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200):**

```json
{
  "is_success": true,
  "message": "Job retrieved successfully",
  "data": {
    "job": {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "title": "Senior Full Stack Engineer",
      "description": "We are looking for an experienced full stack engineer to join our growing team.",
      "requirements": "5+ years of experience with TypeScript, Node.js, React, PostgreSQL, Docker, and AWS.",
      "details": {
        "salary": "$120,000 - $150,000",
        "location": "San Francisco, CA",
        "jobType": "Full-time",
        "company": "Tech Corp",
        "yearsExperience": 5,
        "skills": [
          "TypeScript",
          "Node.js",
          "React",
          "PostgreSQL",
          "Docker",
          "AWS"
        ]
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

---

## 3. Update Job Details

**Request:**

```bash
curl -X PUT http://localhost:3000/api/jobs/550e8400-e29b-41d4-a716-446655440010 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Full Stack Engineer (Updated)",
    "details": {
      "salary": "$130,000 - $160,000",
      "location": "Hybrid - San Francisco, CA"
    }
  }'
```

**Response (200):**

```json
{
  "is_success": true,
  "message": "Job updated successfully",
  "data": null
}
```

---

## 4. Delete Job

**Request:**

```bash
curl -X DELETE http://localhost:3000/api/jobs/550e8400-e29b-41d4-a716-446655440010 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200):**

```json
{
  "is_success": true,
  "message": "Job deleted successfully",
  "data": null
}
```

---

## JavaScript/Node.js Examples

### Using Fetch API

```javascript
// 1. Create Job
async function createJob(accessToken) {
  const response = await fetch('http://localhost:3000/api/jobs', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Senior Full Stack Engineer',
      description: 'We are looking for an experienced full stack engineer...',
      requirements: '5+ years of experience with TypeScript, Node.js, React...',
      apiKeyId: '550e8400-e29b-41d4-a716-446655440005',
      userId: '550e8400-e29b-41d4-a716-446655440000',
      details: {
        salary: '$120,000 - $150,000',
        location: 'San Francisco, CA',
      },
    }),
  });

  const data = await response.json();
  console.log(data);
  return data.data.job_id;
}

// 2. Upload CV
async function uploadCV(userId, accessToken, file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `http://localhost:3000/api/users/${userId}/cvs`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    },
  );

  const data = await response.json();
  console.log(data);
  return data.data.cv_id;
}

// 3. Evaluate Job
async function evaluateJob(jobId, userId, accessToken) {
  const response = await fetch('http://localhost:3000/api/jobs/evaluate', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jobId: jobId,
      userId: userId,
      model: 'gpt-4',
      provider: 'OPENAI',
    }),
  });

  const data = await response.json();
  console.log(data);
  return data;
}

// 4. Get Comparison Result
async function getComparisonResult(comparisonId, accessToken) {
  const response = await fetch(
    `http://localhost:3000/api/jobs/result/${comparisonId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await response.json();
  console.log(data);
  return data.data;
}

// Usage
async function main() {
  const accessToken = 'your_jwt_token';

  // Create job
  const jobId = await createJob(accessToken);
  console.log('Job created:', jobId);

  // Upload CV
  const fileInput = document.getElementById('cvFile');
  const cvId = await uploadCV(
    '550e8400-e29b-41d4-a716-446655440000',
    accessToken,
    fileInput.files[0],
  );
  console.log('CV uploaded:', cvId);

  // Evaluate
  const evaluation = await evaluateJob(
    jobId,
    '550e8400-e29b-41d4-a716-446655440000',
    accessToken,
  );
  console.log('Match percentage:', evaluation.data.matchPercentage);

  // Get result (using the comparison id returned from the evaluation step)
  const comparisonId = '550e8400-e29b-41d4-a716-446655440020';
  const result = await getComparisonResult(comparisonId, accessToken);
  console.log('Comparison result:', result);
}
```

### Using Axios

```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Create job
async function createJob(job, accessToken) {
  try {
    const response = await api.post('/jobs', job, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data.job_id;
  } catch (error) {
    console.error('Failed to create job:', error.response.data);
  }
}

// Evaluate job
async function evaluateJob(jobId, userId, accessToken) {
  try {
    const response = await api.post(
      '/jobs/evaluate',
      {
        jobId: jobId,
        userId: userId,
        model: 'gpt-4',
        provider: 'OPENAI',
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error('Failed to evaluate job:', error.response.data);
  }
}
```

---

## Error Examples

### 1. Invalid Job ID

**Request:**

```bash
curl -X GET http://localhost:3000/api/jobs/invalid-uuid \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (400/404):**

```json
{
  "is_success": false,
  "message": "Job not found",
  "errors": []
}
```

### 2. Missing Required Fields

**Request:**

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Engineer"
  }'
```

**Response (400):**

```json
{
  "is_success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "apiKeyId",
      "message": "apiKeyId must be a UUID"
    },
    {
      "field": "userId",
      "message": "userId must be a UUID"
    }
  ]
}
```

### 3. Unauthorized Access

**Request:**

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Authorization: Bearer invalid_token" \
  -H "Content-Type: application/json" \
  -d '{"title": "..."}'
```

**Response (401):**

```json
{
  "is_success": false,
  "message": "Unauthorized",
  "errors": []
}
```
