# CV Assessor

A Go-based server application using Gin framework for CV assessment.

## Setup

1. Copy `.env.example` to `.env` and configure your environment variables.
2. Install dependencies:
   ```bash
   go mod download
   ```

## Running the Server

### Development with Hot Reload

Use `air` for automatic server restart on code changes:

```bash
# Install air (if not already installed)
go install github.com/air-verse/air@latest

# Run with hot reload
air
```

The server will start on the configured host and port (default: 0.0.0.0:8080) and automatically restart when you make changes to `.go` files.

### Manual Run

```bash
go run .
```

## API Endpoints

- `GET /healthcheck` - Health check endpoint

## Configuration

Environment variables in `.env`:

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSLMODE` - Database configuration
- `SERVER_HOST`, `SERVER_PORT` - Server configuration
- `LOG_LEVEL` - Logging level
