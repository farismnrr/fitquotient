# LLM API Keys Examples

## 1. Creating API Keys for Different Providers

### OpenAI API Key

**Request:**

```bash
curl -X POST http://localhost:3000/api/llms \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "OpenAI Production API",
    "provider": "OPENAI",
    "secret": "sk-proj-abc123def456ghi789jkl000",
    "isActive": true
  }'
```

**Response (201):**

```json
{
  "is_success": true,
  "message": "LLM API Key created successfully",
  "data": {
    "api_key_id": "550e8400-e29b-41d4-a716-446655440030"
  }
}
```

---

### Anthropic API Key

**Request:**

```bash
curl -X POST http://localhost:3000/api/llms \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Anthropic Claude Production",
    "provider": "ANTHROPIC",
    "secret": "sk-ant-v1-abc123def456ghi789jkl000mnopqrst",
    "assignedTo": "550e8400-e29b-41d4-a716-446655440000",
    "isActive": true
  }'
```

**Response (201):**

```json
{
  "is_success": true,
  "message": "LLM API Key created successfully",
  "data": {
    "api_key_id": "550e8400-e29b-41d4-a716-446655440031"
  }
}
```

---

### Google API Key

**Request:**

```bash
curl -X POST http://localhost:3000/api/llms \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Google Gemini API",
    "provider": "GOOGLE",
    "secret": "AIzaSyDxyz123abc456def789ghi000jkl111",
    "isActive": true
  }'
```

**Response (201):**

```json
{
  "is_success": true,
  "message": "LLM API Key created successfully",
  "data": {
    "api_key_id": "550e8400-e29b-41d4-a716-446655440032"
  }
}
```

---

## 2. Complete API Key Management Flow

### Step 1: Create API Key

```bash
curl -X POST http://localhost:3000/api/llms \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production OpenAI API",
    "provider": "OPENAI",
    "secret": "sk-proj-abc123def456ghi789jkl000",
    "assignedTo": "550e8400-e29b-41d4-a716-446655440000",
    "isActive": true
  }'
```

**Response (201):**

```json
{
  "is_success": true,
  "message": "LLM API Key created successfully",
  "data": {
    "api_key_id": "550e8400-e29b-41d4-a716-446655440030"
  }
}
```

---

### Step 2: Use API Key for Evaluations

After creating the API key, you can use it in job evaluations:

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

The system will automatically use the configured API key for OpenAI.

---

### Step 3: Delete API Key

**Request:**

```bash
curl -X DELETE http://localhost:3000/api/llms/550e8400-e29b-41d4-a716-446655440030 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200):**

```json
{
  "is_success": true,
  "message": "LLM API Key deleted successfully",
  "data": null
}
```

---

## JavaScript/Node.js Examples

### Using Fetch API

```javascript
// 1. Create API Key
async function createLLMApiKey(apiKeyConfig, accessToken) {
  const response = await fetch('http://localhost:3000/api/llms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiKeyConfig),
  });

  const data = await response.json();
  if (data.is_success) {
    console.log('API Key created:', data.data.api_key_id);
    return data.data.api_key_id;
  } else {
    console.error('Failed to create API key:', data.message);
  }
}

// 2. Delete API Key
async function deleteLLMApiKey(apiKeyId, accessToken) {
  const response = await fetch(`http://localhost:3000/api/llms/${apiKeyId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  if (data.is_success) {
    console.log('API Key deleted successfully');
  } else {
    console.error('Failed to delete API key:', data.message);
  }
}

// Usage examples
async function main() {
  const accessToken = 'your_jwt_token';

  // Create OpenAI API Key
  const openAiConfig = {
    name: 'Production OpenAI API',
    provider: 'OPENAI',
    secret: 'sk-proj-abc123def456ghi789jkl000',
    isActive: true,
  };

  const apiKeyId = await createLLMApiKey(openAiConfig, accessToken);

  // Delete when no longer needed
  await deleteLLMApiKey(apiKeyId, accessToken);
}
```

### Using Axios

```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Create API Key
async function createLLMApiKey(config, accessToken) {
  try {
    const response = await api.post('/llms', config, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('API Key created:', response.data.data.api_key_id);
    return response.data.data.api_key_id;
  } catch (error) {
    console.error('Failed to create API key:', error.response.data);
  }
}

// Delete API Key
async function deleteLLMApiKey(apiKeyId, accessToken) {
  try {
    const response = await api.delete(`/llms/${apiKeyId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('API Key deleted successfully');
  } catch (error) {
    console.error('Failed to delete API key:', error.response.data);
  }
}

// Create multiple API keys for different providers
async function setupMultipleProviders(accessToken) {
  const providers = [
    {
      name: 'OpenAI Production',
      provider: 'OPENAI',
      secret: 'sk-proj-abc123...',
    },
    {
      name: 'Anthropic Production',
      provider: 'ANTHROPIC',
      secret: 'sk-ant-v1-abc123...',
    },
    {
      name: 'Google Production',
      provider: 'GOOGLE',
      secret: 'AIzaSyDxyz123...',
    },
  ];

  const apiKeyIds = {};

  for (const provider of providers) {
    const id = await createLLMApiKey(provider, accessToken);
    apiKeyIds[provider.provider] = id;
  }

  return apiKeyIds;
}
```

---

## Environment-Based Configuration

### Development Environment

```bash
curl -X POST http://localhost:3000/api/llms \
  -H "Authorization: Bearer dev_token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "OpenAI Development",
    "provider": "OPENAI",
    "secret": "sk-proj-dev-abc123...",
    "isActive": true
  }'
```

### Staging Environment

```bash
curl -X POST http://localhost:3000/api/llms \
  -H "Authorization: Bearer staging_token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "OpenAI Staging",
    "provider": "OPENAI",
    "secret": "sk-proj-staging-abc123...",
    "assignedTo": "550e8400-e29b-41d4-a716-446655440001",
    "isActive": true
  }'
```

### Production Environment

```bash
curl -X POST http://localhost:3000/api/llms \
  -H "Authorization: Bearer prod_token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "OpenAI Production",
    "provider": "OPENAI",
    "secret": "sk-proj-prod-abc123...",
    "assignedTo": "550e8400-e29b-41d4-a716-446655440000",
    "isActive": true
  }'
```

---

## Error Examples

### 1. Invalid Provider

**Request:**

```bash
curl -X POST http://localhost:3000/api/llms \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My API Key",
    "provider": "INVALID_PROVIDER",
    "secret": "secret_key"
  }'
```

**Response (400):**

```json
{
  "is_success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "provider",
      "message": "provider must be one of: OPENAI, ANTHROPIC, GOOGLE"
    }
  ]
}
```

### 2. Duplicate API Key Name

**Request:**

```bash
curl -X POST http://localhost:3000/api/llms \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "OpenAI Production API",
    "provider": "OPENAI",
    "secret": "different_secret"
  }'
```

**Response (409):**

```json
{
  "is_success": false,
  "message": "API key with this name already exists",
  "errors": []
}
```

### 3. Missing Required Fields

**Request:**

```bash
curl -X POST http://localhost:3000/api/llms \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My API Key"
  }'
```

**Response (400):**

```json
{
  "is_success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "provider",
      "message": "provider must be a string"
    },
    {
      "field": "secret",
      "message": "secret must be a string"
    }
  ]
}
```

### 4. API Key Not Found

**Request:**

```bash
curl -X DELETE http://localhost:3000/api/llms/invalid-uuid \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (404):**

```json
{
  "is_success": false,
  "message": "API key not found",
  "errors": []
}
```

---

## Best Practices

1. **Store secrets securely** - Never commit API keys to version control
2. **Use environment variables** - Store secrets in .env files
3. **Rotate keys regularly** - Implement a key rotation policy
4. **Monitor usage** - Track which API keys are being used
5. **Use descriptive names** - Include environment and purpose in key names
6. **Assign appropriately** - Use the `assignedTo` field to track ownership
7. **Delete unused keys** - Remove keys that are no longer needed
