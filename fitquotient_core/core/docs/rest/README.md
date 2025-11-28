# FitQuotient Core API Documentation

Complete API documentation for FitQuotient Core with endpoints organized by module.

## 📁 Folder Structure

```
docs/rest/
├── README.md (this file)
├── AUTHENTICATION.md
├── COMMON.md
├── endpoints/
│   ├── users.md
│   ├── user-cvs.md
│   ├── jobs.md
│   ├── job-evaluations.md
│   └── llm-api-keys.md
└── examples/
    ├── users-examples.md
    ├── jobs-examples.md
    └── llm-examples.md
```

## 🚀 Quick Start

### Base URL

```
http://localhost:5400
```

### Authentication

- **API Key Guard**: For public endpoints (registration, login)
- **JWT Guard**: For endpoints requiring user authentication

See [AUTHENTICATION.md](./AUTHENTICATION.md) for full details.

## 📚 Endpoint Modules

### 1. [Users](./endpoints/users.md) (7 endpoints)

- Create User
- Login
- Refresh Token
- Get User by ID
- Update Password
- Logout
- Delete User

### 2. [User CVs](./endpoints/user-cvs.md) (3 endpoints)

- Upload CV
- Get CV by ID
- Delete CV

### 3. [Jobs](./endpoints/jobs.md) (4 endpoints)

- Create Job
- Get Job by ID
- Update Job
- Delete Job

### 4. [Job Evaluations](./endpoints/job-evaluations.md) (2 endpoints)

- Evaluate Job
- Get Comparison Result

### 5. [LLM API Keys](./endpoints/llm-api-keys.md) (2 endpoints)

- Create API Key
- Delete API Key

## 📋 Standard Response Format

See [COMMON.md](./COMMON.md) for:

- Standard response format
- HTTP status codes
- Error handling
- Validation rules

## 💡 Examples

Check the [examples/](./examples/) folder for complete implementation examples:

- `users-examples.md` - Examples for user endpoints
- `jobs-examples.md` - Examples for job endpoints
- `llm-examples.md` - Examples for LLM endpoints

## 🔐 Security Notes

- All endpoints use validation pipes
- Input whitelist and transformation enabled
- Case transformation applied to all requests/responses
- HTTP-only cookies for refresh tokens
- JWT for authenticated endpoints

## 📞 Support

For questions or issues, please create an issue in the repository.
