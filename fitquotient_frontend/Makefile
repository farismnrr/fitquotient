.PHONY: help install dev build start lint docker-build docker-up docker-down docker-logs docker-clean docker-rebuild

# ============================================================================
# FitQuotient Frontend Commands
# ============================================================================

help:
	@echo "FitQuotient Frontend Commands"
	@echo "=============================="
	@echo ""
	@echo "Setup:"
	@echo "  make setup              - Setup environment (.env file)"
	@echo "  make env                - Copy .env.example to .env"
	@echo "  make install            - Install npm dependencies"
	@echo ""
	@echo "Development:"
	@echo "  make dev                - Start Next.js development server"
	@echo "  make build              - Build Next.js application"
	@echo "  make start              - Start production server"
	@echo "  make lint               - Run ESLint"
	@echo ""
	@echo "Docker Commands:"
	@echo "  make docker-build       - Build Docker image"
	@echo "  make docker-up          - Start UI service (background)"
	@echo "  make docker-logs        - View logs from UI service"
	@echo "  make docker-down        - Stop UI service"
	@echo "  make docker-clean       - Stop service and remove volumes"
	@echo "  make docker-rebuild     - Rebuild and start service"
	@echo ""
	@echo "Service Commands:"
	@echo "  make shell              - Connect to fitquotient-ui container"
	@echo "  make logs               - View UI logs"
	@echo ""
	@echo "Health Check:"
	@echo "  make health             - Check UI service health"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean              - Clean node_modules and build files"
	@echo "  make restart            - Restart Docker service"
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
	@echo "=============================="
	@node --version
	@npm --version
	@docker --version
	@docker-compose --version
	@echo ""
	@echo "✅ Environment configured!"
	@echo "Run 'make install' to install dependencies"

install:
	@echo "📦 Installing dependencies..."
	npm install
	@echo "✅ Dependencies installed!"

# ============================================================================
# Development Commands
# ============================================================================

dev:
	@echo "🚀 Starting Next.js development server..."
	npm run dev

build:
	@echo "🔨 Building Next.js application..."
	npm run build
	@echo "✅ Build complete!"

start:
	@echo "🚀 Starting production server..."
	npm run start

lint:
	@echo "🔍 Running ESLint..."
	npm run lint

# ============================================================================
# Docker Management
# ============================================================================

docker-build:
	@echo "🔨 Building Docker image..."
	docker compose build --no-cache
	@echo "✅ Build complete!"

docker-up:
	@echo "🚀 Starting UI service..."
	docker compose up -d
	@sleep 3
	@docker compose ps
	@echo ""
	@echo "✅ Service started!"
	@echo "   Next.js UI: http://localhost:3000"

docker-down:
	@echo "🛑 Stopping UI service..."
	docker compose down
	@echo "✅ Service stopped!"

docker-logs:
	docker compose logs -f fitquotient-ui

logs:
	docker compose logs -f fitquotient-ui

docker-rebuild:
	@echo "🔄 Rebuilding and restarting service..."
	docker compose down
	docker compose build --no-cache
	docker compose up -d
	@sleep 3
	@echo "✅ Service rebuilt and started!"

docker-clean:
	@echo "🧹 Cleaning up Docker resources..."
	docker compose down -v
	@echo "✅ Cleanup complete!"

# ============================================================================
# Container Access
# ============================================================================

shell:
	@docker compose exec fitquotient-ui sh

# ============================================================================
# Health Check
# ============================================================================

health:
	@echo "🏥 Health Check"
	@echo "==============="
	@echo ""
	@echo "Docker Services:"
	@docker compose ps
	@echo ""
	@echo "Next.js UI Health:"
	@curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000/api/health || echo "❌ Unreachable"

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
	@echo "🔄 Restarting UI service..."
	docker compose restart
	@sleep 3
	@docker compose ps

stop:
	@echo "⏸️  Stopping service..."
	docker compose stop

clean:
	@echo "🧹 Cleaning build files..."
	rm -rf .next
	rm -rf node_modules
	@echo "✅ Clean complete!"

image-clean:
	@echo "Removing dangling images..."
	docker image prune -f

prune-all:
	@echo "🧹 Removing all unused Docker resources..."
	docker system prune -f --volumes

# ============================================================================
# Production
# ============================================================================

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
	@echo "FitQuotient Frontend Information"
	@echo "================================="
	@echo ""
	@echo "Container:"
	@echo "  - fitquotient-ui (Next.js)"
	@echo ""
	@echo "Port:"
	@echo "  - Next.js UI: 3000"
	@echo ""
	@echo "Network: fitquotient"
	@echo ""
	@echo "Environment:"
	@echo "  - NODE_ENV: production (Docker)"
	@echo "  - NEXT_TELEMETRY_DISABLED: 1"
