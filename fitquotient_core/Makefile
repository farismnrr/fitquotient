.PHONY: help docker-build docker-up docker-down docker-logs docker-clean docker-rebuild test

# ============================================================================
# Docker Compose Commands
# ============================================================================

help:
	@echo "FitQuotient Docker Commands"
	@echo "============================"
	@echo ""
	@echo "Setup:"
	@echo "  make setup              - Setup environment (.env file)"
	@echo "  make env                - Copy .env.example to .env"
	@echo ""
	@echo "Docker Commands:"
	@echo "  make docker-build       - Build Docker images"
	@echo "  make docker-up          - Start all services (background)"
	@echo "  make docker-logs        - View logs from all services"
	@echo "  make docker-down        - Stop all services"
	@echo "  make docker-clean       - Stop services and remove volumes"
	@echo "  make docker-rebuild     - Rebuild and start services"
	@echo ""
	@echo "Service Commands:"
	@echo "  make shell              - Connect to fitquotient-core container"
	@echo "  make db-shell           - Connect to PostgreSQL"
	@echo "  make redis-cli          - Connect to Redis"
	@echo ""
	@echo "Logs:"
	@echo "  make logs-core          - View NestJS Core logs"
	@echo "  make logs-db            - View PostgreSQL logs"
	@echo "  make logs-redis         - View Redis logs"
	@echo "  make logs-qdrant        - View Qdrant logs"
	@echo ""
	@echo "Health Check:"
	@echo "  make health             - Check all services health"
	@echo ""

# ============================================================================
# Setup Commands
# ============================================================================

env:
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "✅ .env file created from .env.example"; \
		echo "⚠️  Please update .env with your settings"; \
	else \
		echo "✅ .env file already exists"; \
	fi

setup: env
	@echo "📦 FitQuotient Setup"
	@echo "===================="
	@docker --version
	@docker-compose --version
	@echo ""
	@echo "✅ Environment configured!"
	@echo "Run 'make docker-up' to start services"

# ============================================================================
# Docker Management
# ============================================================================

docker-build:
	@echo "🔨 Building Docker images..."
	docker compose build --no-cache
	@echo "✅ Build complete!"

docker-up:
	@echo "🚀 Starting services..."
	docker compose up -d
	@sleep 5
	@docker compose ps
	@echo ""
	@echo "✅ Services started!"
	@echo "   NestJS Core: http://localhost:5400"
	@echo "   CV Assessor: http://localhost:5500"
	@echo "   Qdrant: http://localhost:6333"

docker-down:
	@echo "🛑 Stopping services..."
	docker compose down
	@echo "✅ Services stopped!"

docker-logs:
	docker compose logs -f
docker-rebuild:
	@echo "🔄 Rebuilding and restarting services..."
	docker compose down
	docker compose build --no-cache
	docker compose up -d
	@sleep 5
	@echo "✅ Services rebuilt and started!"

docker-clean:
	@echo "🧹 Cleaning up Docker resources..."
	docker compose down -v
	@echo "✅ Cleanup complete!"

# ============================================================================
# Container Access
# ============================================================================

shell:
	@docker compose exec fitquotient-core sh

db-shell:
	@docker compose exec postgres psql -U $${DB_USER:-fitquotient_user} -d $${DB_NAME:-fitquotient}

redis-cli:
	@docker compose exec redis redis-cli -a $${REDIS_PASS:-redis_password}

# ============================================================================
# Service Logs
# ============================================================================

logs-core:
	docker compose logs -f fitquotient-core

logs-db:
	docker compose logs -f postgres

logs-redis:
	docker compose logs -f redis

logs-qdrant:
	docker compose logs -f qdrant

# ============================================================================
# Database Commands
# ============================================================================

db-migrate:
	@echo "Running database migrations..."
	docker-compose exec fitquotient-core npm run migration:run

db-revert:
	@echo "Reverting last migration..."
	docker-compose exec fitquotient-core npm run migration:revert

db-generate:
	@echo "Generating new migration..."
	docker-compose exec fitquotient-core npm run migration:generate

# ============================================================================
# Health Check
# ============================================================================

health:
	@echo "🏥 Health Check"
	@echo "==============="
	@echo ""
	@echo "Docker Services:"
	@docker-compose ps
	@echo ""
	@echo "NestJS Core Health:"
	@curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000/health || echo "❌ Unreachable"
	@echo ""
	@echo "CV Assessor Health:"
	@curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:8080/healthcheck || echo "❌ Unreachable"
	@echo ""
	@echo "Qdrant Health:"
	@curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:6333/health || echo "❌ Unreachable"

# ============================================================================
# Testing
# ============================================================================

test-unit:
	@echo "Running unit tests..."
	docker compose exec fitquotient-core npm run test

test-integration:
	@echo "Running integration tests..."
	docker compose exec fitquotient-core npm run test:integration
test-e2e:
	@echo "Running e2e tests..."
	docker compose exec fitquotient-core npm run test:e2e

# ============================================================================
# Stats & Monitoring
# ============================================================================

stats:
	docker stats

ps:
	docker compose ps

logs-tail:
	docker compose logs --tail=50 -f

# ============================================================================
# Maintenance
# ============================================================================

restart:
	@echo "🔄 Restarting all services..."
	docker compose restart
	@sleep 3
	@docker compose ps

stop:
	@echo "⏸️  Pausing services..."
	docker compose stop
pause: stop

volume-list:
	docker volume ls | grep fitquotient

volume-clean:
	@echo "Removing all fitquotient volumes..."
	docker volume prune -f

image-clean:
	@echo "Removing dangling images..."
	docker image prune -f

prune-all:
	@echo "🧹 Removing all unused Docker resources..."
	docker system prune -f --volumes

# ============================================================================
# Development
# ============================================================================

dev:
	@echo "🚀 Starting in development mode..."
	docker compose -f docker-compose.yml up -d
	@sleep 3
	@docker compose logs -f fitquotient-core

prod:
	@echo "🚀 Starting in production mode..."
	export NODE_ENV=production
	docker compose up -d
	@sleep 3
	@docker compose ps

# ============================================================================
# Useful Info
# ============================================================================

info:
	@echo "FitQuotient Services Information"
	@echo "=================================="
	@echo ""
	@echo "Containers:"
	@echo "  - fitquotient-core:postgres (NestJS + Go)"
	@echo "  - fitquotient-postgres"
	@echo "  - fitquotient-redis"
	@echo "  - fitquotient-qdrant"
	@echo ""
	@echo "Ports:"
	@echo "  - NestJS Core: 3000"
	@echo "  - CV Assessor: 8080"
	@echo "  - PostgreSQL: 5432"
	@echo "  - Redis: 6379"
	@echo "  - Qdrant: 6333"
	@echo ""
	@echo "Volumes:"
	@echo "  - postgres_data"
	@echo "  - redis_data"
	@echo "  - qdrant_data"
	@echo "  - uploads"
	@echo ""
	@echo "Network: fitquotient"
