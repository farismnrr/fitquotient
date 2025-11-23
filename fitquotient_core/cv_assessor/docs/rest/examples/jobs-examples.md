# Job Endpoint Examples

Complete code examples for working with Job endpoints.

## Create Job

### JavaScript/Node.js

```javascript
const apiKey = "your-api-key";
const baseUrl = "http://localhost:8080/api";

async function createJob(jobText) {
  const response = await fetch(`${baseUrl}/jobs`, {
    method: "POST",
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jobId: "456f7890-e89b-12d3-a456-426614174111",
      text: jobText,
    }),
  });

  const result = await response.json();

  if (result.is_success) {
    console.log("Job created:", result.data.jobId);
    return result.data.jobId;
  } else {
    throw new Error(result.message);
  }
}

createJob("We are looking for a Senior Backend Engineer...").catch(
  console.error
);
```

### Python

```python
import requests
import uuid

API_KEY = 'your-api-key'
BASE_URL = 'http://localhost:8080/api'

def create_job(job_text):
    """Create a new job"""
    headers = {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
    }

    payload = {
        'jobId': str(uuid.uuid4()),
        'text': job_text
    }

    response = requests.post(
        f'{BASE_URL}/jobs',
        headers=headers,
        json=payload
    )

    result = response.json()

    if result['is_success']:
        print(f"Job created: {result['data']['jobId']}")
        return result['data']['jobId']
    else:
        raise Exception(result['message'])

# Usage
job_id = create_job(
    'We are looking for a Senior Backend Engineer with 5+ years of experience...'
)
```

### cURL

```bash
curl -X POST http://localhost:8080/api/jobs \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "456f7890-e89b-12d3-a456-426614174111",
    "text": "We are looking for a Senior Backend Engineer with 5+ years of experience in Go and distributed systems. Requirements: Strong understanding of microservices architecture..."
  }'
```

---

## Get Job

### JavaScript/Node.js

```javascript
async function getJob(jobId) {
  const response = await fetch(`${baseUrl}/jobs/${jobId}`, {
    headers: {
      "X-API-Key": apiKey,
    },
  });

  const result = await response.json();

  if (result.is_success) {
    console.log("Job retrieved:", result.data);
    return result.data;
  } else {
    throw new Error(result.message);
  }
}

// Usage
const job = await getJob("456f7890-e89b-12d3-a456-426614174111");
console.log("Job text length:", job.text.length);
```

### Python

```python
def get_job(job_id):
    """Retrieve a job by ID"""
    headers = {'X-API-Key': API_KEY}

    response = requests.get(
        f'{BASE_URL}/jobs/{job_id}',
        headers=headers
    )

    result = response.json()

    if result['is_success']:
        return result['data']
    else:
        raise Exception(result['message'])

# Usage
job = get_job('456f7890-e89b-12d3-a456-426614174111')
print(f"Job text length: {len(job['text'])}")
```

### cURL

```bash
curl -X GET http://localhost:8080/api/jobs/456f7890-e89b-12d3-a456-426614174111 \
  -H "X-API-Key: your-api-key"
```

---

## Delete Job

### JavaScript/Node.js

```javascript
async function deleteJob(jobId) {
  const response = await fetch(`${baseUrl}/jobs/${jobId}`, {
    method: "DELETE",
    headers: {
      "X-API-Key": apiKey,
    },
  });

  const result = await response.json();

  if (result.is_success) {
    console.log("Job deleted successfully");
  } else {
    throw new Error(result.message);
  }
}

// Usage
await deleteJob("456f7890-e89b-12d3-a456-426614174111");
```

### Python

```python
def delete_job(job_id):
    """Delete a job by ID"""
    headers = {'X-API-Key': API_KEY}

    response = requests.delete(
        f'{BASE_URL}/jobs/{job_id}',
        headers=headers
    )

    result = response.json()

    if result['is_success']:
        print('Job deleted successfully')
    else:
        raise Exception(result['message'])

# Usage
delete_job('456f7890-e89b-12d3-a456-426614174111')
```

### cURL

```bash
curl -X DELETE http://localhost:8080/api/jobs/456f7890-e89b-12d3-a456-426614174111 \
  -H "X-API-Key: your-api-key"
```

---

## Full Workflow Example

### JavaScript/Node.js

```javascript
async function jobWorkflow() {
  try {
    // 1. Create a job
    console.log("Creating job...");
    const jobId = await createJob(
      "We are looking for a Senior Backend Engineer with 5+ years of experience in Go. " +
        "Requirements: microservices architecture knowledge, Kubernetes experience, gRPC knowledge."
    );
    console.log(`✓ Job created: ${jobId}`);

    // 2. Retrieve the job
    console.log("\nRetrieving job...");
    const jobData = await getJob(jobId);
    console.log(`✓ Job retrieved - Text length: ${jobData.text.length}`);

    // 3. Delete the job
    console.log("\nDeleting job...");
    await deleteJob(jobId);
    console.log("✓ Job deleted successfully");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

jobWorkflow();
```

### Python

```python
def job_workflow():
    """Complete job workflow"""
    try:
        # 1. Create a job
        print("Creating job...")
        job_id = create_job(
            'We are looking for a Senior Backend Engineer with 5+ years of experience in Go. '
            'Requirements: microservices architecture knowledge, Kubernetes experience, gRPC knowledge.'
        )
        print(f"✓ Job created: {job_id}")

        # 2. Retrieve the job
        print("\nRetrieving job...")
        job_data = get_job(job_id)
        print(f"✓ Job retrieved - Text length: {len(job_data['text'])}")

        # 3. Delete the job
        print("\nDeleting job...")
        delete_job(job_id)
        print("✓ Job deleted successfully")

    except Exception as error:
        print(f"Error: {error}")

job_workflow()
```

---

## Real-World Example: Job Posting Ingestion

### JavaScript/Node.js

```javascript
async function ingestJobPostings(jobPostings) {
  const results = [];

  for (const posting of jobPostings) {
    try {
      const jobId = await createJob(posting.description);
      results.push({
        title: posting.title,
        company: posting.company,
        jobId: jobId,
        status: "success",
      });
      console.log(`✓ Ingested: ${posting.title} at ${posting.company}`);
    } catch (error) {
      results.push({
        title: posting.title,
        company: posting.company,
        status: "failed",
        error: error.message,
      });
      console.error(`✗ Failed: ${posting.title} - ${error.message}`);
    }
  }

  return results;
}

// Usage
const jobPostings = [
  {
    title: "Senior Backend Engineer",
    company: "TechCorp",
    description: "We are looking for a Senior Backend Engineer...",
  },
  {
    title: "Full Stack Developer",
    company: "StartupXYZ",
    description: "Join our team as a Full Stack Developer...",
  },
];

const results = await ingestJobPostings(jobPostings);
console.log("Ingestion complete:", results);
```

### Python

```python
def ingest_job_postings(job_postings):
    """Ingest multiple job postings"""
    results = []

    for posting in job_postings:
        try:
            job_id = create_job(posting['description'])
            results.append({
                'title': posting['title'],
                'company': posting['company'],
                'jobId': job_id,
                'status': 'success'
            })
            print(f"✓ Ingested: {posting['title']} at {posting['company']}")
        except Exception as error:
            results.append({
                'title': posting['title'],
                'company': posting['company'],
                'status': 'failed',
                'error': str(error)
            })
            print(f"✗ Failed: {posting['title']} - {error}")

    return results

# Usage
job_postings = [
    {
        'title': 'Senior Backend Engineer',
        'company': 'TechCorp',
        'description': 'We are looking for a Senior Backend Engineer...'
    },
    {
        'title': 'Full Stack Developer',
        'company': 'StartupXYZ',
        'description': 'Join our team as a Full Stack Developer...'
    }
]

results = ingest_job_postings(job_postings)
print('Ingestion complete:', results)
```

---

## Error Handling

### JavaScript/Node.js

```javascript
async function createJobWithErrorHandling(jobText) {
  try {
    if (!jobText || jobText.length < 10) {
      throw new Error("Job text must be at least 10 characters");
    }

    const response = await fetch(`${baseUrl}/jobs`, {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobId: "456f7890-e89b-12d3-a456-426614174111",
        text: jobText,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();

    if (!result.is_success) {
      console.error("API Error:", result.message);
      return null;
    }

    return result.data.jobId;
  } catch (error) {
    if (error.message.includes("HTTP Error: 401")) {
      console.error("Authentication failed - check API key");
    } else if (error.message.includes("HTTP Error: 400")) {
      console.error("Validation error - check request body");
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
}
```

### Python

```python
def create_job_with_error_handling(job_text):
    """Create job with comprehensive error handling"""
    try:
        if not job_text or len(job_text) < 10:
            raise ValueError('Job text must be at least 10 characters')

        headers = {
            'X-API-Key': API_KEY,
            'Content-Type': 'application/json'
        }

        payload = {
            'jobId': str(uuid.uuid4()),
            'text': job_text
        }

        response = requests.post(
            f'{BASE_URL}/jobs',
            headers=headers,
            json=payload,
            timeout=10
        )

        if response.status_code == 401:
            raise Exception('Authentication failed - check API key')
        elif response.status_code == 400:
            raise Exception('Validation error - check request body')
        elif not response.ok:
            raise Exception(f'HTTP Error: {response.status_code}')

        result = response.json()

        if not result['is_success']:
            print(f'API Error: {result["message"]}')
            return None

        return result['data']['jobId']

    except requests.exceptions.Timeout:
        print('Request timeout - server took too long to respond')
    except requests.exceptions.ConnectionError:
        print('Connection error - cannot reach server')
    except Exception as error:
        print(f'Error: {error}')
        raise
```

---

See [evaluations-examples.md](./evaluations-examples.md) to learn how to compare CVs with jobs.
