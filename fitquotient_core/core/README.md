# FitQuotient Core

**FitQuotient Core** is a robust backend API built with NestJS that powers the FitQuotient platform. It provides comprehensive endpoints for user management, job processing, CV evaluation, and LLM API key management. The system leverages advanced AI/ML capabilities through LLM integrations to deliver intelligent job matching and evaluation services.

## 🎯 Overview

This project serves as the core backend infrastructure for the FitQuotient ecosystem, handling:

- **User Management**: Registration, authentication, and profile management
- **Job Processing**: Job creation, retrieval, and updates
- **CV Analysis**: Resume/CV upload and storage
- **Job Evaluations**: AI-powered job candidate matching and evaluation
- **LLM Integration**: Support for multiple LLM providers via API keys

## 🏗️ Architecture

The project follows a modular architecture with clear separation of concerns:

- **Users Module**: User authentication, profile management
- **Jobs Module**: Job posting and management
- **CVs Module**: Resume/CV handling
- **LLMs Module**: AI/ML service integrations
- **Common Module**: Shared utilities, guards, filters, and infrastructure

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development
npm run start:dev

# Production
npm run build
npm run start:prod

# Testing
npm run test
npm run test:integration
npm run test:e2e
```

## 📚 Documentation

Complete API documentation is available in the `/docs` folder:

- **[API Reference](./docs/rest/README.md)** - Complete endpoint documentation
- **[Authentication Guide](./docs/rest/AUTHENTICATION.md)** - Authentication methods and security
- **[Common Patterns](./docs/rest/COMMON.md)** - Response formats, status codes, and error handling
- **[API Structure](./docs/rest/STRUCTURE.md)** - API design patterns and conventions

### Endpoints Documentation

- **[Users API](./docs/rest/endpoints/users.md)** - User management endpoints
- **[User CVs API](./docs/rest/endpoints/user-cvs.md)** - CV upload and retrieval
- **[Jobs API](./docs/rest/endpoints/jobs.md)** - Job management endpoints
- **[Job Evaluations API](./docs/rest/endpoints/job-evaluations.md)** - Evaluation and comparison
- **[LLM API Keys](./docs/rest/endpoints/llm-api-keys.md)** - LLM provider configuration

### Examples

Implementation examples are available for each module:

- **[User Examples](./docs/rest/examples/users-examples.md)** - User operations examples
- **[Job Examples](./docs/rest/examples/jobs-examples.md)** - Job operations examples
- **[LLM Examples](./docs/rest/examples/llm-examples.md)** - LLM integration examples

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **API Key Guard**: Public endpoint protection
- **Rate Limiting**: Request throttling and DDoS protection
- **Input Validation**: Whitelist-based validation with class-validator
- **Data Transformation**: Automatic case transformation
- **HTTP-Only Cookies**: Secure refresh token storage

## 📊 Database Support

The system supports multiple database backends:

- MySQL
- PostgreSQL
- SQLite (development)

### Database Migrations

The project includes a powerful migration system that generates migrations for all supported database types:

```bash
# Generate migrations for all database types (sqlite, postgres, mysql)
make migrate-generate

# Run migrations
make migrate-run

# Revert last migration
make migrate-revert
```

**Key Features:**
- ✅ **No Database Connection Required**: Generates migration files without needing running database instances
- ✅ **Multi-Database Support**: Creates migrations for SQLite, PostgreSQL, and MySQL simultaneously
- ✅ **DB-Specific Syntax**: Automatically adjusts SQL syntax for each database type (e.g., DATETIME for SQLite, TIMESTAMP for PostgreSQL/MySQL)
- ✅ **Safe Migrations**: Includes IF NOT EXISTS / IF EXISTS clauses to prevent conflicts
- ✅ **Customizable**: Generated migrations can be modified before running

The `migrate-generate.sh` script creates empty migration skeletons with basic schema structure. You can customize these migrations before running them with `make migrate-run`.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: NestJS
- **Language**: TypeScript
- **Database ORM**: TypeORM
- **API Format**: REST
- **Testing**: Jest
- **API Server**: Fastify / Express

## 📦 Project Structure

```
fitquotient_core/
├── src/
│   ├── app.module.ts           # Main application module
│   ├── main.ts                 # Application entry point
│   ├── Common/                 # Shared modules & utilities
│   ├── Users/                  # User management module
│   ├── Jobs/                   # Job management module
│   ├── Llms/                   # LLM integration module
│   └── ...
├── docs/
│   └── rest/                   # Complete API documentation
├── test/                       # Test suite
├── migrations/                 # Database migrations
└── package.json               # Dependencies and scripts
```

## 📝 Available Scripts

```bash
npm run build              # Build the project
npm run build:secure       # Build with obfuscation
npm run start             # Start the application
npm run start:dev         # Start in development mode
npm run start:prod        # Start in production mode
npm run lint              # Run ESLint
npm run format            # Format code with Prettier
npm run test              # Run unit tests
npm run test:cov          # Run tests with coverage
npm run test:integration  # Run integration tests
npm run test:e2e          # Run end-to-end tests
npm run migration:run     # Run database migrations
npm run migration:generate # Generate migrations
```

## 🔄 Environment Configuration

The project supports environment-based configuration:

- **.env.development** - Development environment settings
- **.env.production** - Production environment settings
- **global.config.ts** - Application configuration
- **global-secure.config.ts** - Secure configuration

## 🤝 Contributing

Please follow the project's code style and structure when contributing. Ensure all tests pass before submitting pull requests.

## 📄 License

MIT

---

For detailed API documentation and examples, navigate to the [docs/rest](./docs/rest) folder.
