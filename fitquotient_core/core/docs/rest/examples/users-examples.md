# User Endpoints Examples

## 1. Complete User Registration Flow

### Step 1: Create Account

**Request:**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123",
    "role": "USER"
  }'
```

**Response (201):**

```json
{
  "is_success": true,
  "message": "User created successfully",
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Step 2: Login

**Request:**

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Response (200):**

```json
{
  "is_success": true,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJpYXQiOjE3MzE3NTk0NDUsImV4cCI6MTczMTc2MzA0NX0.abc123..."
  }
}
```

**Cookies Set:**

```
Set-Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict
```

---

## 2. Get User Profile

**Request:**

```bash
curl -X GET http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200):**

```json
{
  "is_success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "fullName": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "USER",
      "status": "ACTIVE",
      "organization": "Tech Corp"
    }
  }
}
```

---

## 3. Update Password

**Request:**

```bash
curl -X PATCH http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "SecurePass123",
    "password": "NewSecurePass456",
    "confirmPassword": "NewSecurePass456"
  }'
```

**Response (200):**

```json
{
  "is_success": true,
  "message": "User updated successfully",
  "data": null
}
```

---

## 4. Refresh Access Token

**Request:**

```bash
curl -X GET http://localhost:3000/api/users/refresh \
  -H "X-API-Key: your_api_key_here" \
  -H "Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200):**

```json
{
  "is_success": true,
  "message": "Access token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJpYXQiOjE3MzE3NTk0NDUsImV4cCI6MTczMTc2MzA0NX0.newtoken123..."
  }
}
```

---

## 5. Logout

**Request:**

```bash
curl -X DELETE http://localhost:3000/api/users/logout/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200):**

```json
{
  "is_success": true,
  "message": "User logged out successfully",
  "data": null
}
```

---

## 6. Delete Account

**Request:**

```bash
curl -X DELETE http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200):**

```json
{
  "is_success": true,
  "message": "User deleted successfully",
  "data": null
}
```

---

## Error Examples

### 1. Duplicate Email

**Request:**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Doe",
    "username": "janedoe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }'
```

**Response (409):**

```json
{
  "is_success": false,
  "message": "User with this email already exists",
  "errors": []
}
```

### 2. Password Validation Error

**Request:**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "short",
    "confirmPassword": "short"
  }'
```

**Response (400):**

```json
{
  "is_success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "password",
      "message": "password must be longer than or equal to 8 characters"
    }
  ]
}
```

### 3. Invalid Credentials on Login

**Request:**

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "WrongPassword"
  }'
```

**Response (401):**

```json
{
  "is_success": false,
  "message": "Invalid credentials",
  "errors": []
}
```

### 4. Unauthorized Access

**Request:**

```bash
curl -X GET http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer invalid_token"
```

**Response (401):**

```json
{
  "is_success": false,
  "message": "Unauthorized",
  "errors": []
}
```

---

## JavaScript/Node.js Examples

### Using Fetch API

```javascript
// 1. Create Account
async function createUser() {
  const response = await fetch('http://localhost:3000/api/users', {
    method: 'POST',
    headers: {
      'X-API-Key': 'your_api_key_here',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fullName: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'SecurePass123',
      confirmPassword: 'SecurePass123',
    }),
  });

  const data = await response.json();
  console.log(data);
}

// 2. Login
async function login() {
  const response = await fetch('http://localhost:3000/api/users/login', {
    method: 'POST',
    headers: {
      'X-API-Key': 'your_api_key_here',
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies
    body: JSON.stringify({
      email: 'john@example.com',
      password: 'SecurePass123',
    }),
  });

  const data = await response.json();
  localStorage.setItem('accessToken', data.data.accessToken);
  return data.data.accessToken;
}

// 3. Get User Profile
async function getUserProfile(userId) {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  console.log(data);
}

// 4. Refresh Token
async function refreshToken() {
  const response = await fetch('http://localhost:3000/api/users/refresh', {
    method: 'GET',
    headers: {
      'X-API-Key': 'your_api_key_here',
    },
    credentials: 'include', // For cookies
  });

  const data = await response.json();
  localStorage.setItem('accessToken', data.data.accessToken);
}
```

### Using Axios

```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

// Login
async function login() {
  try {
    const response = await api.post(
      '/users/login',
      {
        email: 'john@example.com',
        password: 'SecurePass123',
      },
      {
        headers: {
          'X-API-Key': 'your_api_key_here',
        },
      },
    );

    const token = response.data.data.accessToken;
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return token;
  } catch (error) {
    console.error('Login failed:', error.response.data);
  }
}

// Get User Profile
async function getUserProfile(userId) {
  try {
    const response = await api.get(`/users/${userId}`);
    console.log(response.data);
  } catch (error) {
    console.error('Failed to get user:', error.response.data);
  }
}
```
