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

# Using Makefile
make migrate-generate      # Generate migrations for all DB types (SQLite, PostgreSQL, MySQL)
make migrate-run          # Run pending migrations
make migrate-revert       # Revert last migration
```

### 🗄️ Database Migrations

The project supports multiple database types (SQLite, PostgreSQL, MySQL). Migration generation automatically creates migration files for all three database types:

```bash
make migrate-generate
```

This command will:
1. Build TypeScript entities
2. Generate SQLite migration using in-memory database (no DB connection required)
3. Transform SQLite migration to PostgreSQL and MySQL formats
4. Create separate migration files for each database type:
   - `migrations/init_sqlite.js`
   - `migrations/init_postgres.js`
   - `migrations/init_mysql.js`

**Note**: Migration generation does NOT require actual database connections. The script reads entity definitions from TypeORM entity files and generates appropriate SQL for each database type.

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
