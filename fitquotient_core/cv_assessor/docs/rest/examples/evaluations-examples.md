# Evaluation Endpoint Examples

Complete code examples for working with evaluation (comparison) endpoints.

## Compare CV with Job

### JavaScript/Node.js

```javascript
const apiKey = "your-api-key";
const baseUrl = "http://localhost:8080/api";

async function compareCVWithJob(cvId, jobId, llmConfig) {
  const response = await fetch(`${baseUrl}/jobs/evaluate`, {
    method: "POST",
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cvId: cvId,
      jobId: jobId,
      apiKey: llmConfig.apiKey,
      model: llmConfig.model,
      provider: llmConfig.provider,
    }),
  });

  const result = await response.json();

  if (result.is_success) {
    console.log("Comparison started:", result.data.id);
    console.log("Status:", result.data.status);
    return result.data.id;
  } else {
    throw new Error(result.message);
  }
}

// Usage
const comparisonId = await compareCVWithJob(
  "123e4567-e89b-12d3-a456-426614174000",
  "456f7890-e89b-12d3-a456-426614174111",
  {
    apiKey: "sk-...",
    model: "gpt-4",
    provider: "openai",
  }
);
```

### Python

```python
import requests
import uuid

API_KEY = 'your-api-key'
BASE_URL = 'http://localhost:8080/api'

def compare_cv_with_job(cv_id, job_id, llm_config):
    """Start a CV-Job comparison"""
    headers = {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
    }

    payload = {
        'cvId': cv_id,
        'jobId': job_id,
        'apiKey': llm_config['apiKey'],
        'model': llm_config['model'],
        'provider': llm_config['provider']
    }

    response = requests.post(
        f'{BASE_URL}/jobs/evaluate',
        headers=headers,
        json=payload
    )

    result = response.json()

    if result['is_success']:
        print(f"Comparison started: {result['data']['id']}")
        print(f"Status: {result['data']['status']}")
        return result['data']['id']
    else:
        raise Exception(result['message'])

# Usage
comparison_id = compare_cv_with_job(
    '123e4567-e89b-12d3-a456-426614174000',
    '456f7890-e89b-12d3-a456-426614174111',
    {
        'apiKey': 'sk-...',
        'model': 'gpt-4',
        'provider': 'openai'
    }
)
```

### cURL

```bash
curl -X POST http://localhost:8080/api/jobs/evaluate \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "cvId": "123e4567-e89b-12d3-a456-426614174000",
    "jobId": "456f7890-e89b-12d3-a456-426614174111",
    "apiKey": "sk-...",
    "model": "gpt-4",
    "provider": "openai"
  }'
```

---

## Get Comparison Result

### JavaScript/Node.js

```javascript
async function getComparisonResult(comparisonId) {
  const response = await fetch(`${baseUrl}/jobs/result/${comparisonId}`, {
    headers: {
      "X-API-Key": apiKey,
    },
  });

  const result = await response.json();

  if (result.is_success) {
    console.log("Comparison result:", result.data);
    return result.data;
  } else {
    throw new Error(result.message);
  }
}

// Usage
const result = await getComparisonResult(
  "789a1234-e89b-12d3-a456-426614174222"
);
console.log("Match percentage:", result.matchPercentage);
console.log("Status:", result.status);
```

### Python

```python
def get_comparison_result(comparison_id):
    """Get the result of a comparison"""
    headers = {'X-API-Key': API_KEY}

    response = requests.get(
        f'{BASE_URL}/jobs/result/{comparison_id}',
        headers=headers
    )

    result = response.json()

    if result['is_success']:
        return result['data']
    else:
        raise Exception(result['message'])

# Usage
result = get_comparison_result('789a1234-e89b-12d3-a456-426614174222')
print(f"Match percentage: {result['result']['matchPercentage']}")
print(f"Status: {result['status']}")
```

### cURL

```bash
curl -X GET http://localhost:8080/api/jobs/result/789a1234-e89b-12d3-a456-426614174222 \
  -H "X-API-Key: your-api-key"
```

---

## Poll with Exponential Backoff

### JavaScript/Node.js

```javascript
async function waitForComparisonResult(comparisonId, maxAttempts = 30) {
  let attempt = 1;
  const maxDelay = 30000; // 30 seconds max

  while (attempt <= maxAttempts) {
    try {
      const response = await fetch(`${baseUrl}/jobs/result/${comparisonId}`, {
        headers: {
          "X-API-Key": apiKey,
        },
      });

      const result = await response.json();

      if (result.data.status === "completed") {
        console.log("✓ Comparison completed");
        return result.data;
      }

      console.log(
        `⏳ Attempt ${attempt}/${maxAttempts} - Status: ${result.data.status}`
      );

      // Exponential backoff: 1s, 2s, 4s, 8s, etc.
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), maxDelay);
      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch (error) {
      console.error("Error fetching result:", error.message);
    }

    attempt++;
  }

  throw new Error("Comparison did not complete within timeout");
}

// Usage
try {
  const result = await waitForComparisonResult(
    "789a1234-e89b-12d3-a456-426614174222"
  );
  console.log("Match percentage:", result.result.matchPercentage);
  console.log("Summary:", result.result.summary);
} catch (error) {
  console.error("Failed to get comparison result:", error.message);
}
```

### Python

```python
import time

def wait_for_comparison_result(comparison_id, max_attempts=30):
    """Poll for comparison result with exponential backoff"""
    attempt = 1
    max_delay = 30  # 30 seconds max

    while attempt <= max_attempts:
        try:
            result = get_comparison_result(comparison_id)

            if result['status'] == 'completed':
                print('✓ Comparison completed')
                return result

            print(f"⏳ Attempt {attempt}/{max_attempts} - Status: {result['status']}")

            # Exponential backoff: 1s, 2s, 4s, 8s, etc.
            delay = min(1 * (2 ** (attempt - 1)), max_delay)
            time.sleep(delay)

        except Exception as error:
            print(f'Error fetching result: {error}')

        attempt += 1

    raise Exception('Comparison did not complete within timeout')

# Usage
try:
    result = wait_for_comparison_result('789a1234-e89b-12d3-a456-426614174222')
    print(f"Match percentage: {result['result']['matchPercentage']}")
    print(f"Summary: {result['result']['summary']}")
except Exception as error:
    print(f'Failed to get comparison result: {error}')
```

---

## Complete Workflow: Create, Compare, and Get Results

### JavaScript/Node.js

```javascript
async function completeComparisonWorkflow(cvText, jobText, llmConfig) {
  try {
    // 1. Create CV
    console.log("Creating CV...");
    const cvResponse = await fetch(`${baseUrl}/cvs`, {
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
        text: cvText,
      }),
    });
    const cvData = await cvResponse.json();
    const cvId = cvData.data.cvId;
    console.log("✓ CV created:", cvId);

    // 2. Create Job
    console.log("\nCreating job...");
    const jobResponse = await fetch(`${baseUrl}/jobs`, {
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
    const jobData = await jobResponse.json();
    const jobId = jobData.data.jobId;
    console.log("✓ Job created:", jobId);

    // 3. Start Comparison
    console.log("\nStarting comparison...");
    const comparisonId = await compareCVWithJob(cvId, jobId, llmConfig);
    console.log("✓ Comparison started:", comparisonId);

    // 4. Poll for Results
    console.log("\nWaiting for results...");
    const comparisonResult = await waitForComparisonResult(comparisonId);
    console.log("✓ Results received");

    return {
      cvId,
      jobId,
      comparisonId,
      result: comparisonResult,
    };
  } catch (error) {
    console.error("Workflow failed:", error.message);
    throw error;
  }
}

// Usage
const cvText = `
John Doe
Senior Backend Engineer
5 Years Experience

Skills:
- Go: Expert
- Kubernetes: Intermediate
- gRPC: Expert
- Microservices: Expert
- Distributed Systems: Expert

Experience:
- 5 years at TechCorp building microservices
- Led the migration to Kubernetes
`;

const jobText = `
Senior Backend Engineer - Remote

We are looking for a Senior Backend Engineer with:
- 5+ years of experience
- Expert in Go programming
- Strong Kubernetes knowledge
- gRPC experience
- Microservices architecture
- Distributed systems knowledge
`;

const llmConfig = {
  apiKey: "sk-...",
  model: "gpt-4",
  provider: "openai",
};

const workflow = await completeComparisonWorkflow(cvText, jobText, llmConfig);
console.log("\nFinal Results:");
console.log("Match Percentage:", workflow.result.result.matchPercentage);
console.log("Summary:", workflow.result.result.summary);
console.log("Recommendations:", workflow.result.result.recommendations);
```

### Python

```python
def complete_comparison_workflow(cv_text, job_text, llm_config):
    """Complete workflow: create CV, job, compare, and get results"""
    try:
        # 1. Create CV
        print("Creating CV...")
        cv_payload = {
            'cvId': str(uuid.uuid4()),
            'userId': str(uuid.uuid4()),
            'filename': 'resume.pdf',
            'sourceUrl': 'https://example.com/resume.pdf',
            'text': cv_text
        }
        headers = {
            'X-API-Key': API_KEY,
            'Content-Type': 'application/json'
        }
        cv_response = requests.post(
            f'{BASE_URL}/cvs',
            headers=headers,
            json=cv_payload
        )
        cv_data = cv_response.json()
        cv_id = cv_data['data']['cvId']
        print(f"✓ CV created: {cv_id}")

        # 2. Create Job
        print("\nCreating job...")
        job_payload = {
            'jobId': str(uuid.uuid4()),
            'text': job_text
        }
        job_response = requests.post(
            f'{BASE_URL}/jobs',
            headers=headers,
            json=job_payload
        )
        job_data = job_response.json()
        job_id = job_data['data']['jobId']
        print(f"✓ Job created: {job_id}")

        # 3. Start Comparison
        print("\nStarting comparison...")
        comparison_id = compare_cv_with_job(cv_id, job_id, llm_config)
        print(f"✓ Comparison started: {comparison_id}")

        # 4. Poll for Results
        print("\nWaiting for results...")
        comparison_result = wait_for_comparison_result(comparison_id)
        print("✓ Results received")

        return {
            'cvId': cv_id,
            'jobId': job_id,
            'comparisonId': comparison_id,
            'result': comparison_result
        }

    except Exception as error:
        print(f"Workflow failed: {error}")
        raise

# Usage
cv_text = """
John Doe
Senior Backend Engineer
5 Years Experience

Skills:
- Go: Expert
- Kubernetes: Intermediate
- gRPC: Expert
- Microservices: Expert
- Distributed Systems: Expert

Experience:
- 5 years at TechCorp building microservices
- Led the migration to Kubernetes
"""

job_text = """
Senior Backend Engineer - Remote

We are looking for a Senior Backend Engineer with:
- 5+ years of experience
- Expert in Go programming
- Strong Kubernetes knowledge
- gRPC experience
- Microservices architecture
- Distributed systems knowledge
"""

llm_config = {
    'apiKey': 'sk-...',
    'model': 'gpt-4',
    'provider': 'openai'
}

workflow = complete_comparison_workflow(cv_text, job_text, llm_config)
print("\nFinal Results:")
print(f"Match Percentage: {workflow['result']['result']['matchPercentage']}")
print(f"Summary: {workflow['result']['result']['summary']}")
print(f"Recommendations: {workflow['result']['result']['recommendations']}")
```

---

## Using Different LLM Providers

### OpenAI

```javascript
const openaiConfig = {
  apiKey: "sk-YOUR-OPENAI-API-KEY",
  model: "gpt-4",
  provider: "openai",
};
```

### Anthropic (Claude)

```javascript
const anthropicConfig = {
  apiKey: "sk-ant-YOUR-ANTHROPIC-API-KEY",
  model: "claude-3-opus-20240229",
  provider: "anthropic",
};
```

### Google Gemini

```javascript
const geminiConfig = {
  apiKey: "YOUR-GOOGLE-GEMINI-API-KEY",
  model: "gemini-pro",
  provider: "gemini",
};
```

---

## Error Handling

### JavaScript/Node.js

```javascript
async function compareWithErrorHandling(cvId, jobId, llmConfig) {
  try {
    if (!cvId || !jobId) {
      throw new Error("CV ID and Job ID are required");
    }

    if (!llmConfig.apiKey || !llmConfig.model || !llmConfig.provider) {
      throw new Error("LLM config must include apiKey, model, and provider");
    }

    const validProviders = ["openai", "anthropic", "gemini"];
    if (!validProviders.includes(llmConfig.provider)) {
      throw new Error(`Provider must be one of: ${validProviders.join(", ")}`);
    }

    const response = await fetch(`${baseUrl}/jobs/evaluate`, {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cvId,
        jobId,
        apiKey: llmConfig.apiKey,
        model: llmConfig.model,
        provider: llmConfig.provider,
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

    return result.data.id;
  } catch (error) {
    if (error.message.includes("HTTP Error: 404")) {
      console.error("CV or Job not found");
    } else if (error.message.includes("HTTP Error: 401")) {
      console.error("Authentication failed");
    } else if (error.message.includes("HTTP Error: 400")) {
      console.error("Validation error - check inputs");
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
}
```

### Python

```python
def compare_with_error_handling(cv_id, job_id, llm_config):
    """Compare CV with job with comprehensive error handling"""
    try:
        if not cv_id or not job_id:
            raise ValueError('CV ID and Job ID are required')

        if not llm_config.get('apiKey') or not llm_config.get('model') or not llm_config.get('provider'):
            raise ValueError('LLM config must include apiKey, model, and provider')

        valid_providers = ['openai', 'anthropic', 'gemini']
        if llm_config['provider'] not in valid_providers:
            raise ValueError(f"Provider must be one of: {', '.join(valid_providers)}")

        headers = {
            'X-API-Key': API_KEY,
            'Content-Type': 'application/json'
        }

        payload = {
            'cvId': cv_id,
            'jobId': job_id,
            'apiKey': llm_config['apiKey'],
            'model': llm_config['model'],
            'provider': llm_config['provider']
        }

        response = requests.post(
            f'{BASE_URL}/jobs/evaluate',
            headers=headers,
            json=payload,
            timeout=10
        )

        if response.status_code == 404:
            raise Exception('CV or Job not found')
        elif response.status_code == 401:
            raise Exception('Authentication failed')
        elif response.status_code == 400:
            raise Exception('Validation error - check inputs')
        elif not response.ok:
            raise Exception(f'HTTP Error: {response.status_code}')

        result = response.json()

        if not result['is_success']:
            print(f'API Error: {result["message"]}')
            return None

        return result['data']['id']

    except requests.exceptions.Timeout:
        print('Request timeout - server took too long to respond')
    except requests.exceptions.ConnectionError:
        print('Connection error - cannot reach server')
    except Exception as error:
        print(f'Error: {error}')
        raise
```

---

See the main [README.md](../README.md) for API overview and getting started guide.
