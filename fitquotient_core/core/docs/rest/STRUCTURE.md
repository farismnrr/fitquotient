# API Documentation Structure

## 📁 Complete Directory Layout

```
docs/rest/
│
├── README.md                          ⭐ START HERE
│   Overview and navigation guide
│
├── AUTHENTICATION.md                  🔐 Auth Guide
│   - API Key Guard
│   - JWT Guard
│   - Token flows
│   - Security best practices
│
├── COMMON.md                          📋 Common Info
│   - Response format
│   - HTTP status codes
│   - Data types
│   - Validation rules
│   - Error handling
│
├── endpoint.md                        (Index/Redirect to this folder structure)
│
├── endpoints/                         📚 Endpoint Documentation
│   │
│   ├── users.md                       👤 User Management (7 endpoints)
│   │   ├── Create User (POST /users)
│   │   ├── Login (POST /users/login)
│   │   ├── Refresh Token (GET /users/refresh)
│   │   ├── Get Current User (GET /users)
│   │   ├── Update Password (PATCH /users)
│   │   ├── Logout (DELETE /users/logout)
│   │   └── Delete User (DELETE /users)
│   │
│   ├── user-cvs.md                   📄 CV Management (3 endpoints)
│   │   ├── Upload CV (POST /users/cvs)
│   │   ├── Get CV by ID (GET /users/cvs/:cvId)
│   │   └── Delete CV (DELETE /users/cvs/:cvId)
│   │
│   ├── jobs.md                        💼 Job Management (4 endpoints)
│   │   ├── Create Job (POST /jobs)
│   │   ├── Get Job by ID (GET /jobs/:id)
│   │   ├── Update Job (PUT /jobs/:id)
│   │   └── Delete Job (DELETE /jobs/:id)
│   │
│   ├── job-evaluations.md             🤖 AI Evaluations (2 endpoints)
│   │   ├── Evaluate Job (POST /jobs/evaluate)
│   │   └── Get Comparison Result (GET /jobs/result/:cvId-:jobId)
│   │
│   └── llm-api-keys.md               🔑 LLM Keys Management (2 endpoints)
│       ├── Create API Key (POST /llms)
│       └── Delete API Key (DELETE /llms/:id)
│
└── examples/                          💡 Code Examples
    │
    ├── users-examples.md              Complete user flows with:
    │   - cURL examples
    │   - Fetch API examples
    │   - Axios examples
    │   - Error examples
    │
    ├── jobs-examples.md               Complete job flows with:
    │   - Job creation & evaluation
    │   - Fetch & Axios examples
    │   - Full workflow examples
    │
    └── llm-examples.md                LLM API key examples with:
        - Provider setup for all LLMs
        - cURL examples
        - Node.js/JavaScript examples
        - Environment setup
```

## 🚀 Total: 18 Files

| Category      | Files | Content                                              |
| ------------- | ----- | ---------------------------------------------------- |
| **Core**      | 3     | README, AUTHENTICATION, COMMON                       |
| **Endpoints** | 5     | users, user-cvs, jobs, job-evaluations, llm-api-keys |
| **Examples**  | 3     | users, jobs, llm                                     |
| **Index**     | 1     | endpoint.md (redirect)                               |
| **Total**     | 12    | (3 directories)                                      |

## 📖 Reading Path

### For First-Time Users

1. Start with **README.md**
2. Read **AUTHENTICATION.md** to understand auth
3. Read **COMMON.md** for response formats
4. Check the specific endpoint file you need
5. Look at **examples/** for code samples

### For Developers

1. Jump to the specific **endpoints/** file you need
2. Check **examples/** for usage patterns
3. Reference **COMMON.md** for errors and validation

### For Integration

1. Read **AUTHENTICATION.md** to set up auth
2. Follow the **examples/** files
3. Keep **COMMON.md** as reference

---

## 🎯 Quick References

### By Module

- **Users**: [endpoints/users.md](./endpoints/users.md) + [examples/users-examples.md](./examples/users-examples.md)
- **Jobs**: [endpoints/jobs.md](./endpoints/jobs.md) + [examples/jobs-examples.md](./examples/jobs-examples.md)
- **CVs**: [endpoints/user-cvs.md](./endpoints/user-cvs.md)
- **Evaluations**: [endpoints/job-evaluations.md](./endpoints/job-evaluations.md)
- **LLM Keys**: [endpoints/llm-api-keys.md](./endpoints/llm-api-keys.md) + [examples/llm-examples.md](./examples/llm-examples.md)

### By Topic

- **Authentication**: [AUTHENTICATION.md](./AUTHENTICATION.md)
- **Response Formats**: [COMMON.md](./COMMON.md)
- **Code Examples**: [examples/](./examples/)

---

## 📊 Endpoint Summary

### By HTTP Method

| Method    | Count  | Endpoints                                                                              |
| --------- | ------ | -------------------------------------------------------------------------------------- |
| POST      | 7      | Create User, Login, Create Job, Evaluate Job, Upload CV, Create API Key, Refresh Token |
| GET       | 4      | Get User, Get Job, Get CV, Get Result                                                  |
| PUT       | 1      | Update Job                                                                             |
| PATCH     | 1      | Update Password                                                                        |
| DELETE    | 4      | Logout, Delete User, Delete Job, Delete CV, Delete API Key                             |
| **Total** | **18** |                                                                                        |

### By Authentication

| Guard   | Count | Endpoints                         |
| ------- | ----- | --------------------------------- |
| API Key | 3     | Create User, Login, Refresh Token |
| JWT     | 15    | All others                        |

### By Module

| Module      | Endpoints | Status Codes                      |
| ----------- | --------- | --------------------------------- |
| Users       | 7         | 200, 201, 400, 401, 403, 404, 409 |
| CVs         | 3         | 200, 201, 400, 403, 404, 413      |
| Jobs        | 4         | 200, 201, 400, 403, 404           |
| Evaluations | 2         | 200, 400, 403, 404                |
| LLM Keys    | 2         | 200, 201, 400, 403, 404, 409      |

---

## ✨ Key Features

- ✅ **Split into modules** - Easy to find what you need
- ✅ **Consistent format** - Every endpoint has same structure
- ✅ **Complete examples** - cURL, Fetch, Axios examples
- ✅ **Error handling** - Real error responses documented
- ✅ **Best practices** - Security and usage tips included
- ✅ **Quick references** - Jump links and navigation

---

## 🔗 Base URL

```
http://localhost:3000/api
```

All examples use this base URL. Update for your environment (dev, staging, production).

---

## 📞 Questions?

If you can't find what you're looking for:

1. Check the **README.md**
2. Search the specific endpoint file
3. Look at **examples/**
4. Check **COMMON.md** for errors
5. Review **AUTHENTICATION.md** for auth issues
