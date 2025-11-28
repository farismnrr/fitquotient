# Authentication Guide

## Overview

The FitQuotient Core API uses two types of authentication mechanisms:

1. **API Key Guard** - For public endpoints
2. **JWT Guard** - For protected endpoints

## API Key Guard

### Purpose

Used for public endpoints that don't require user authentication, such as:

- User registration
- User login
- Token refresh

### How to Use

Include your API key in the request headers or query parameters.

**Header Method:**

```
X-API-Key: your_api_key_here
```

**Query Parameter Method:**

```
GET /users/refresh?apiKey=your_api_key_here
```

### Example Request

```bash
curl -X POST http://localhost:5400/api/users \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }'
```

## JWT Guard

### Purpose

Used for protected endpoints that require user authentication, such as:

- Getting user profile
- Creating jobs
- Uploading CVs
- Job evaluations

### How to Use

Include the JWT token in the Authorization header with Bearer scheme.

**Header Format:**

```
Authorization: Bearer your_jwt_token_here
```

### Example Request

```bash
curl -X GET http://localhost:5400/api/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

## Getting an Access Token

### Step 1: Login

Send a POST request to `/users/login` with your credentials:

```bash
curl -X POST http://localhost:5400/api/users/login \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "SecurePass123"
  }'
```

### Step 2: Extract Token

The response will contain your access token:

```json
{
  "is_success": true,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Step 3: Use Token

Include the token in all subsequent requests:

```bash
curl -X GET http://localhost:5400/api/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Refresh Token

Access tokens have a limited lifetime. Use the refresh token to get a new access token.

### Getting a Refresh Token

When you login, a refresh token is automatically set as an HTTP-only cookie.

### Refreshing the Token

```bash
curl -X GET http://localhost:5400/api/users/refresh \
  -H "X-API-Key: your_api_key_here" \
  -H "Cookie: refreshToken=your_refresh_token_here"
```

Response:

```json
{
  "is_success": true,
  "message": "Access token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Token Expiration & Security

- **Access Token**: Expires in a short time (typically 15 minutes)
- **Refresh Token**: Expires in a longer time (typically 7 days)
- **HTTP-only Cookies**: Refresh tokens are stored in HTTP-only cookies to prevent XSS attacks
- **HTTPS Required**: In production, all requests must use HTTPS

## Error Responses

### Invalid or Missing Token

```json
{
  "is_success": false,
  "message": "Unauthorized",
  "errors": []
}
```

### Expired Token

```json
{
  "is_success": false,
  "message": "Token expired",
  "errors": []
}
```

### Invalid API Key

```json
{
  "is_success": false,
  "message": "Invalid API Key",
  "errors": []
}
```

## Best Practices

1. **Store tokens securely** - Never expose tokens in client-side code
2. **Use HTTPS** - Always use HTTPS in production
3. **Refresh before expiry** - Proactively refresh tokens before they expire
4. **Handle 401 responses** - Implement proper handling for unauthorized responses
5. **Logout properly** - Call the logout endpoint to invalidate tokens
6. **API Key security** - Keep API keys secret and rotate regularly
