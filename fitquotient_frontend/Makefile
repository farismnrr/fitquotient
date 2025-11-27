.PHONY: help docker-build docker-up docker-run docker-down docker-logs docker-clean docker-rebuild docker-down-volumes docker-compose-down setup env shell push-ghcr-ui logs-frontend health info
docker-run: docker-up
docker-compose-down: docker-down

# ============================================================================
# Docker Compose Commands (frontend)
# ============================================================================

COMPOSE_FILE ?= docker-compose.yml
SERVICE_NAME ?= frontend
IMAGE ?= fitquotient-ui
TAG ?= latest
CONTAINER_NAME ?= fitquotient-ui
PORT ?= 3000
ENV_VARS ?= # space separated: KEY=VAL KEY2=VAL2 (e.g. URL_CORE=https://api.example.com URL_API_KEY=abc123)


help:
	@echo "FitQuotient Frontend Docker Commands"
	@echo "============================"
	@echo ""
	@echo "Setup:"
	@echo "  make setup              - Setup environment (.env file)"
	@echo "  make env                - Copy .env.example to .env"
	@echo ""
	@echo "Docker Commands:"
	@echo "  make docker-build       - Build Docker images (compose build --no-cache)"
	@echo "  make docker-up          - Start frontend service (background)"
	@echo "  make docker-logs        - View logs from all services (compose)"
	@echo "  make docker-down        - Stop all services"
	@echo "  make docker-down-volumes- Stop services and remove volumes"
	@echo "  make docker-clean       - Stop services and remove volumes"
	@echo "  make docker-rebuild     - Rebuild and start services (no cache)"
	@echo "  make clean              - Remove local build artifacts (.next)"
	@echo "  make build-local        - Run a local Next.js build (npm run build)"
	@echo ""
	@echo "Service Commands:"
	@echo "  make shell              - Connect to frontend container"
	@echo ""
	@echo "Logs:"
	@echo "  make logs-frontend      - View frontend container logs"
	@echo ""
	@echo "Deployment:"
	@echo "  make push-ghcr-ui       - Build and push frontend image to ghcr (fitquotient-ui)"
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
	@echo "📦 FitQuotient Frontend Setup"
	@echo "===================="
	@docker --version
	@docker compose version
	@echo ""
	@echo "✅ Environment configured!"
	@echo "Run 'make docker-up' to start services"

# ============================================================================
# Docker Management
# ============================================================================

docker-build:
	@echo "🔨 Building Docker images (compose: build --no-cache) : $(IMAGE):$(TAG)"
	DOCKER_IMAGE=$(IMAGE):$(TAG) $(ENV_VARS) docker compose -f $(COMPOSE_FILE) build --no-cache
	@echo "✅ Build complete!"

docker-up:
	@echo "🚀 Starting services (frontend) using docker compose"
	DOCKER_IMAGE=$(IMAGE):$(TAG) $(ENV_VARS) docker compose -f $(COMPOSE_FILE) up -d --build
	@sleep 3
	@docker compose -f $(COMPOSE_FILE) ps
	@echo ""
	@echo "✅ Services started!"
	@echo "   Frontend: http://localhost:$(PORT)"
	@echo "   (Ensure URL_CORE and URL_API_KEY are set in your .env or pass as ENV_VARS)"

docker-down:
	@echo "🛑 Stopping services..."
	@docker compose -f $(COMPOSE_FILE) down
	@echo "✅ Services stopped!"

docker-down-volumes:
	@echo "🛑 Stopping services and removing volumes..."
	@docker compose -f $(COMPOSE_FILE) down -v
	@echo "✅ Services stopped and volumes removed!"

docker-rebuild:
	@echo "🔄 Rebuilding and restarting services (no cache)..."
	@docker compose -f $(COMPOSE_FILE) down
	DOCKER_IMAGE=$(IMAGE):$(TAG) $(ENV_VARS) docker compose -f $(COMPOSE_FILE) build --no-cache
	DOCKER_IMAGE=$(IMAGE):$(TAG) $(ENV_VARS) docker compose -f $(COMPOSE_FILE) up -d --build
	@sleep 3
	@echo "✅ Services rebuilt and started!"

docker-clean:
	@echo "🧹 Cleaning up Docker resources..."
	@docker compose -f $(COMPOSE_FILE) down -v
	@echo "✅ Cleanup complete!"

# ============================================================================
# Local dev helpers
# ============================================================================

clean:
	@echo "🧹 Cleaning local build artifacts (.next)"
	@rm -rf .next
	@echo "✅ Cleaned .next"

build-local:
	@echo "🔨 Local Next.js build (npm run build)"
	npm ci || true
	npm run build
	@echo "✅ Local build complete"

docker-logs:
	@docker compose -f $(COMPOSE_FILE) logs -f

# ============================================================================
# Container Access
# ============================================================================

shell:
	@docker compose -f $(COMPOSE_FILE) exec $(SERVICE_NAME) sh

# ============================================================================
# Service Logs
# ============================================================================

logs-frontend:
	docker compose -f $(COMPOSE_FILE) logs -f $(SERVICE_NAME)

# ============================================================================
# Health Check
# ============================================================================

health:
	@echo "🏥 Health Check"
	@echo "==============="
	@echo "Docker Services:"
	@docker compose -f $(COMPOSE_FILE) ps
	@echo ""
	@echo "Frontend Health:"
	@curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:$(PORT)/api/health || echo "❌ Unreachable"

# ============================================================================
# Push to GHCR wrapper for frontend
# ============================================================================

push:
	@echo "Pushing to GHCR as image: ghcr.io/${GITHUB_OWNER:-${GHCR_NAMESPACE:-${GHCR_USERNAME:-farismnrr}}}/fitquotient-ui:$(TAG)"
	@./push-ghcr-ui.sh $(TAG)

# ==========================================================================
# Useful Info
# ============================================================================

info:
	@echo "FitQuotient Frontend Information"
	@echo "=================================="
	@echo ""
	@echo "Service: $(SERVICE_NAME)"
	@echo "Image: $(IMAGE):$(TAG)"
	@echo "Container: $(CONTAINER_NAME)"
	@echo "Port: $(PORT)"

