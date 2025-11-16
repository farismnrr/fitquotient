# Users Endpoints

## 1. Create User

Create a new user account in the system.

**Method:** `POST`  
**Endpoint:** `/users`  
**Authentication:** API Key Guard  
**Status Code:** 201 Created

### Request Body

```json
{
  "fullName": "string",
  "username": "string",
  "email": "string",
  "phone": "string (optional)",
  "password": "string",
  "confirmPassword": "string",
  "role": "USER | ADMIN | RECRUITER (optional)"
}
```

### Validation Rules

- `fullName` - Required, must be a string
- `username` - Required, must be a string, must be unique
- `email` - Required, must be valid email format, must be unique
- `phone` - Optional, valid phone format
- `password` - Required, minimum 8 characters
- `confirmPassword` - Required, must match password
- `role` - Optional, defaults to USER

### Success Response (201)

```json
{
  "isSuccess": true,
  "message": "User created successfully",
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Error Response (400/409)

```json
{
  "isSuccess": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "email must be an email"
    }
  ]
}
```

---

## 2. Login

Authenticate user and retrieve access token.

**Method:** `POST`  
**Endpoint:** `/users/login`  
**Authentication:** API Key Guard  
**Status Code:** 200 OK

### Request Body

```json
{
  "username": "string (optional if email provided)",
  "email": "string (optional if username provided)",
  "password": "string"
}
```

### Validation Rules

- Either `username` or `email` must be provided (not both required, but at least one)
- `password` - Required, must be a string

### Success Response (200)

```json
{
  "isSuccess": true,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Cookies Set

The response will set an HTTP-only cookie:

```
Set-Cookie: refreshToken=<token>; HttpOnly; Secure; SameSite=Strict
```

### Error Response (401/400)

```json
{
  "isSuccess": false,
  "message": "Invalid credentials",
  "errors": []
}
```

---

## 3. Refresh Token

Get a new access token using the refresh token.

**Method:** `GET`  
**Endpoint:** `/users/refresh`  
**Authentication:** API Key Guard  
**Status Code:** 200 OK

### Request Headers

```
Cookie: refreshToken=<token>
```

### Success Response (200)

```json
{
  "isSuccess": true,
  "message": "Access token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Cookies Updated

```
Set-Cookie: refreshToken=<new_token>; HttpOnly; Secure; SameSite=Strict
```

### Error Response (401/403)

```json
{
  "isSuccess": false,
  "message": "Invalid or expired refresh token",
  "errors": []
}
```

---

## 4. Get User by ID

Retrieve user profile information.

**Method:** `GET`  
**Endpoint:** `/users/:userId`  
**Authentication:** JWT Guard  
**Status Code:** 200 OK

### Path Parameters

| Parameter | Type | Description                  |
| --------- | ---- | ---------------------------- |
| userId    | UUID | The user's unique identifier |

### Success Response (200)

```json
{
  "isSuccess": true,
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

### Error Response (404/403)

```json
{
  "isSuccess": false,
  "message": "User not found",
  "errors": []
}
```

---

## 5. Update User Password

Update the user's password.

**Method:** `PATCH`  
**Endpoint:** `/users/:userId`  
**Authentication:** JWT Guard  
**Status Code:** 200 OK

### Path Parameters

| Parameter | Type | Description                  |
| --------- | ---- | ---------------------------- |
| userId    | UUID | The user's unique identifier |

### Request Body

```json
{
  "oldPassword": "string",
  "password": "string",
  "confirmPassword": "string"
}
```

### Validation Rules

- `oldPassword` - Required, must match current password
- `password` - Required, minimum 8 characters
- `confirmPassword` - Required, must match password

### Success Response (200)

```json
{
  "isSuccess": true,
  "message": "User updated successfully",
  "data": null
}
```

### Error Response (400/401/404)

```json
{
  "isSuccess": false,
  "message": "Old password is incorrect",
  "errors": []
}
```

---

## 6. Logout

Logout user and invalidate tokens.

**Method:** `DELETE`  
**Endpoint:** `/users/logout/:userId`  
**Authentication:** JWT Guard  
**Status Code:** 200 OK

### Path Parameters

| Parameter | Type | Description                  |
| --------- | ---- | ---------------------------- |
| userId    | UUID | The user's unique identifier |

### Success Response (200)

```json
{
  "isSuccess": true,
  "message": "User logged out successfully",
  "data": null
}
```

### Cookies Cleared

```
Set-Cookie: refreshToken=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly
```

### Error Response (404/403)

```json
{
  "isSuccess": false,
  "message": "User not found",
  "errors": []
}
```

---

## 7. Delete User

Soft delete a user account.

**Method:** `DELETE`  
**Endpoint:** `/users/:userId`  
**Authentication:** JWT Guard  
**Status Code:** 200 OK

### Path Parameters

| Parameter | Type | Description                  |
| --------- | ---- | ---------------------------- |
| userId    | UUID | The user's unique identifier |

### Success Response (200)

```json
{
  "isSuccess": true,
  "message": "User deleted successfully",
  "data": null
}
```

### Error Response (404/403)

```json
{
  "isSuccess": false,
  "message": "User not found",
  "errors": []
}
```

### Notes

- This is a soft delete operation
- User data is preserved in the database
- User will not appear in future queries
- Related CVs will also be soft deleted
