# LLM API Keys Endpoints

## 1. Create LLM API Key

Create a new LLM API key configuration.

**Method:** `POST`  
**Endpoint:** `/llms`  
**Authentication:** JWT Guard  
**Status Code:** 201 Created

### Request Body

```json
{
  "name": "string",
  "provider": "OPENAI | ANTHROPIC | GOOGLE",
  "secret": "string",
  "assignedTo": "UUID (optional)",
  "isActive": "boolean (optional)"
}
```

### Validation Rules

- `name` - Required, must be a string (e.g., "OpenAI Production API")
- `provider` - Required, must be one of: OPENAI, ANTHROPIC, GOOGLE
- `secret` - Required, must be a string (API key from provider)
- `assignedTo` - Optional, UUID of user to assign the key to
- `isActive` - Optional, boolean (defaults to true)

### Supported Providers

| Provider  | Value     | Description       |
| --------- | --------- | ----------------- |
| OpenAI    | OPENAI    | For GPT models    |
| Anthropic | ANTHROPIC | For Claude models |
| Google    | GOOGLE    | For Gemini models |

### Success Response (201)

```json
{
  "is_success": true,
  "message": "LLM API Key created successfully",
  "data": {
    "api_key_id": "550e8400-e29b-41d4-a716-446655440030"
  }
}
```

### Important Notes

- The secret key is encrypted before storage
- The original secret is NOT returned after creation
- API keys cannot be retrieved after initial creation (security best practice)
- Store your API key securely on the client side

### Error Response (400/403)

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

### Error Response (409)

```json
{
  "is_success": false,
  "message": "API key with this name already exists",
  "errors": []
}
```

---

## 2. Delete LLM API Key

Delete an LLM API key configuration.

**Method:** `DELETE`  
**Endpoint:** `/llms/:id`  
**Authentication:** JWT Guard  
**Status Code:** 200 OK

### Path Parameters

| Parameter | Type | Description                     |
| --------- | ---- | ------------------------------- |
| id        | UUID | The API key's unique identifier |

### Success Response (200)

```json
{
  "is_success": true,
  "message": "LLM API Key deleted successfully",
  "data": null
}
```

### Error Response (404/403)

```json
{
  "is_success": false,
  "message": "API key not found",
  "errors": []
}
```

### Notes

- Deletion is permanent
- Any active evaluations using this key will fail
- Consider disabling the key first before deletion
- Related evaluations are preserved for audit

---

## API Key Management

### Creating API Keys for Different Providers

#### OpenAI API Key

```bash
curl -X POST http://localhost:3000/api/llms \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "OpenAI Production",
    "provider": "OPENAI",
    "secret": "sk-proj-xxx...",
    "isActive": true
  }'
```

#### Anthropic API Key

```bash
curl -X POST http://localhost:3000/api/llms \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Anthropic Production",
    "provider": "ANTHROPIC",
    "secret": "sk-ant-xxx...",
    "assignedTo": "550e8400-e29b-41d4-a716-446655440000",
    "isActive": true
  }'
```

#### Google API Key

```bash
curl -X POST http://localhost:3000/api/llms \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Google Gemini Production",
    "provider": "GOOGLE",
    "secret": "AIzaSy...",
    "isActive": true
  }'
```

### Delete API Key

```bash
curl -X DELETE http://localhost:3000/api/llms/550e8400-e29b-41d4-a716-446655440030 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Security Best Practices

### For API Key Management

1. **Never expose secrets** - Keep API keys secret and never commit to version control
2. **Use environment variables** - Store keys in .env files or secrets manager
3. **Rotate keys regularly** - Rotate API keys every 90 days
4. **Monitor usage** - Track API usage and set up alerts
5. **Delete unused keys** - Remove keys that are no longer needed
6. **Use separate keys** - Use different keys for different environments (dev, staging, prod)
7. **Assign keys appropriately** - Use the `assignedTo` field to track who uses which key

### For Secret Storage

- Secrets are encrypted with AES-256-GCM
- Encryption keys are stored securely
- Encrypted keys can only be decrypted by the system

### Access Control

- API keys are user-specific
- Users can only manage their own API keys
- Admin users may have additional permissions

---

## Rate Limits & Quota

- Rate limits depend on your LLM provider
- The system respects provider-level rate limits
- Quota management is provider-specific
- Monitor your provider's usage dashboard

---

## Troubleshooting

### Invalid API Key Error

If you receive an "Invalid API Key" error:

1. Verify the API key format is correct
2. Check that the key has the necessary permissions
3. Ensure the key hasn't expired or been revoked
4. Verify the correct provider is specified

### Provider Not Supported

If you see "Provider not supported":

1. Ensure you're using a supported provider (OPENAI, ANTHROPIC, GOOGLE)
2. Check that the provider is enabled in your configuration
3. Contact support if the provider should be available

### API Key Already Exists

If you get "API key with this name already exists":

1. Use a different name for the API key
2. Or delete the existing key first, then create a new one

---

## LLM Provider Documentation

For obtaining API keys from providers, visit:

- **OpenAI**: https://platform.openai.com/api-keys
- **Anthropic**: https://console.anthropic.com/
- **Google**: https://makersuite.google.com/app/apikey
