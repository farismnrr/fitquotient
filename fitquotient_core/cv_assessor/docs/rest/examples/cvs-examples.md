# CV Endpoint Examples

Complete code examples for working with CV endpoints.

## Create CV

### JavaScript/Node.js

```javascript
const apiKey = "your-api-key";
const baseUrl = "http://localhost:8080/api";

async function createCV(cvData) {
  const response = await fetch(`${baseUrl}/cvs`, {
    method: "POST",
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cvId: "123e4567-e89b-12d3-a456-426614174000",
      userId: "987e6543-e89b-12d3-a456-426614174999",
      filename: "john_doe_resume.pdf",
      sourceUrl: "https://example.com/files/john_doe_resume.pdf",
      text: "John Doe is a software engineer with 5 years of experience...",
    }),
  });

  const result = await response.json();

  if (result.is_success) {
    console.log("CV created:", result.data.cvId);
    return result.data.cvId;
  } else {
    throw new Error(result.message);
  }
}

createCV().catch(console.error);
```

### Python

```python
import requests
import uuid

API_KEY = 'your-api-key'
BASE_URL = 'http://localhost:8080/api'

def create_cv(filename, source_url, text):
    """Create a new CV"""
    headers = {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
    }

    payload = {
        'cvId': str(uuid.uuid4()),
        'userId': str(uuid.uuid4()),
        'filename': filename,
        'sourceUrl': source_url,
        'text': text
    }

    response = requests.post(
        f'{BASE_URL}/cvs',
        headers=headers,
        json=payload
    )

    result = response.json()

    if result['is_success']:
        print(f"CV created: {result['data']['cvId']}")
        return result['data']['cvId']
    else:
        raise Exception(result['message'])

# Usage
cv_id = create_cv(
    filename='john_doe_resume.pdf',
    source_url='https://example.com/files/john_doe_resume.pdf',
    text='John Doe is a software engineer with 5 years of experience in backend development...'
)
```

### cURL

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

---

## Get CV

### JavaScript/Node.js

```javascript
async function getCV(cvId) {
  const response = await fetch(`${baseUrl}/cvs/${cvId}`, {
    headers: {
      "X-API-Key": apiKey,
    },
  });

  const result = await response.json();

  if (result.is_success) {
    console.log("CV retrieved:", result.data);
    return result.data;
  } else {
    throw new Error(result.message);
  }
}

// Usage
const cv = await getCV("123e4567-e89b-12d3-a456-426614174000");
console.log("Filename:", cv.filename);
console.log("User ID:", cv.userId);
```

### Python

```python
def get_cv(cv_id):
    """Retrieve a CV by ID"""
    headers = {'X-API-Key': API_KEY}

    response = requests.get(
        f'{BASE_URL}/cvs/{cv_id}',
        headers=headers
    )

    result = response.json()

    if result['is_success']:
        return result['data']
    else:
        raise Exception(result['message'])

# Usage
cv = get_cv('123e4567-e89b-12d3-a456-426614174000')
print(f"Filename: {cv['filename']}")
print(f"User ID: {cv['userId']}")
```

### cURL

```bash
curl -X GET http://localhost:8080/api/cvs/123e4567-e89b-12d3-a456-426614174000 \
  -H "X-API-Key: your-api-key"
```

---

## Delete CV

### JavaScript/Node.js

```javascript
async function deleteCV(cvId) {
  const response = await fetch(`${baseUrl}/cvs/${cvId}`, {
    method: "DELETE",
    headers: {
      "X-API-Key": apiKey,
    },
  });

  const result = await response.json();

  if (result.is_success) {
    console.log("CV deleted successfully");
  } else {
    throw new Error(result.message);
  }
}

// Usage
await deleteCV("123e4567-e89b-12d3-a456-426614174000");
```

### Python

```python
def delete_cv(cv_id):
    """Delete a CV by ID"""
    headers = {'X-API-Key': API_KEY}

    response = requests.delete(
        f'{BASE_URL}/cvs/{cv_id}',
        headers=headers
    )

    result = response.json()

    if result['is_success']:
        print('CV deleted successfully')
    else:
        raise Exception(result['message'])

# Usage
delete_cv('123e4567-e89b-12d3-a456-426614174000')
```

### cURL

```bash
curl -X DELETE http://localhost:8080/api/cvs/123e4567-e89b-12d3-a456-426614174000 \
  -H "X-API-Key: your-api-key"
```

---

## Full Workflow Example

### JavaScript/Node.js

```javascript
async function cvWorkflow() {
  try {
    // 1. Create a CV
    console.log("Creating CV...");
    const cvId = await createCV(
      "resume.pdf",
      "https://example.com/resume.pdf",
      "Software Engineer with 5 years of experience..."
    );
    console.log(`✓ CV created: ${cvId}`);

    // 2. Retrieve the CV
    console.log("\nRetrieving CV...");
    const cvData = await getCV(cvId);
    console.log(`✓ CV retrieved - Filename: ${cvData.filename}`);

    // 3. Delete the CV
    console.log("\nDeleting CV...");
    await deleteCV(cvId);
    console.log("✓ CV deleted successfully");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

cvWorkflow();
```

### Python

```python
def cv_workflow():
    """Complete CV workflow"""
    try:
        # 1. Create a CV
        print("Creating CV...")
        cv_id = create_cv(
            'resume.pdf',
            'https://example.com/resume.pdf',
            'Software Engineer with 5 years of experience...'
        )
        print(f"✓ CV created: {cv_id}")

        # 2. Retrieve the CV
        print("\nRetrieving CV...")
        cv_data = get_cv(cv_id)
        print(f"✓ CV retrieved - Filename: {cv_data['filename']}")

        # 3. Delete the CV
        print("\nDeleting CV...")
        delete_cv(cv_id)
        print("✓ CV deleted successfully")

    except Exception as error:
        print(f"Error: {error}")

cv_workflow()
```

---

## Error Handling

### JavaScript/Node.js

```javascript
async function createCVWithErrorHandling() {
  try {
    const response = await fetch(`${baseUrl}/cvs`, {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cvId: "123e4567-e89b-12d3-a456-426614174000",
        userId: "987e6543-e89b-12d3-a456-426614174999",
        filename: "resume.pdf",
        sourceUrl: "https://example.com/resume.pdf",
        text: "Software engineer...",
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

    return result.data.cvId;
  } catch (error) {
    if (error.message.includes("HTTP Error: 401")) {
      console.error("Authentication failed - check API key");
    } else if (error.message.includes("HTTP Error: 400")) {
      console.error("Validation error - check request body");
    } else {
      console.error("Unexpected error:", error.message);
    }
    throw error;
  }
}
```

### Python

```python
def create_cv_with_error_handling():
    """Create CV with comprehensive error handling"""
    try:
        headers = {
            'X-API-Key': API_KEY,
            'Content-Type': 'application/json'
        }

        payload = {
            'cvId': str(uuid.uuid4()),
            'userId': str(uuid.uuid4()),
            'filename': 'resume.pdf',
            'sourceUrl': 'https://example.com/resume.pdf',
            'text': 'Software engineer...'
        }

        response = requests.post(
            f'{BASE_URL}/cvs',
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

        return result['data']['cvId']

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
