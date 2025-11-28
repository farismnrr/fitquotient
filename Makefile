IMAGE_NAME ?= fitquotient
TAG ?= dev

UI_PORT ?= 3000
CORE_PORT ?= 5400
CV_ASSESSOR_PORT ?= 5500

NEXT_PUBLIC_URL_CORE ?= http://localhost:$(CORE_PORT)

-include .env

# --- GHCR SETTINGS ---
GHCR_OWNER ?= farismnrr
GHCR_IMAGE ?= ghcr.io/$(GHCR_OWNER)/fitquotient
GHCR_TAG ?= $(TAG)

GHCR_USER ?= $(GHCR_USERNAME)
GHCR_TOKEN ?= $(GITHUB_PAT_TOKEN)

.PHONY: ghcr-login build-ghcr push-ghcr publish push
.PHONY: docker-build docker-up docker-down docker-down-volumes docker-logs docker-rebuild docker-clean docker-restart docker-ps docker-shell

# ========== GHCR LOGIN ==========
ghcr-login:
	@if [ -z "$(GHCR_USER)" ] || [ -z "$(GHCR_TOKEN)" ]; then \
		echo "❌ ERROR: GHCR_USER / GHCR_TOKEN tidak ditemukan"; \
		echo "Set environment variable GHCR_USERNAME dan GITHUB_PAT_TOKEN"; \
		exit 1; \
	fi
	@echo "🔐 Login GHCR sebagai $(GHCR_USER)"
	@echo "$(GHCR_TOKEN)" | docker login ghcr.io -u "$(GHCR_USER)" --password-stdin

# ========== BUILD ==========
build-ghcr:
	@echo "🏗  Building GHCR image: $(GHCR_IMAGE):$(GHCR_TAG)"
	docker build \
		-t $(GHCR_IMAGE):$(GHCR_TAG) \
		--build-arg NEXT_PUBLIC_URL_CORE=$(NEXT_PUBLIC_URL_CORE) \
		-f Dockerfile .

# ========== PUSH ==========
push-ghcr: ghcr-login build-ghcr
	@echo "📤 Pushing to GHCR: $(GHCR_IMAGE):$(GHCR_TAG)"
	docker push $(GHCR_IMAGE):$(GHCR_TAG)

# ========== PUBLISH ==========
publish: push-ghcr
	@echo "🚀 Published: $(GHCR_IMAGE):$(GHCR_TAG)"

# ========== MAIN COMMAND ==========
# Usage:
#    make push TAG=latest
#    make push TAG=v2.0.1
push: publish
	@echo "✅ Push completed → $(GHCR_IMAGE):$(GHCR_TAG)"

# =============================
# Docker Compose (root)
# =============================
docker-build:
	@echo "🔨 Building Compose images (root docker-compose.yml)..."
	docker compose -f docker-compose.yml build --no-cache
	@echo "✅ Build complete"

docker-up:
	@echo "🚀 Starting Compose services (root docker-compose.yml)..."
	docker compose -f docker-compose.yml up -d
	@sleep 5
	@docker compose -f docker-compose.yml ps
	@echo "✅ Services started"

docker-down:
	@echo "🛑 Stopping Compose services (root docker-compose.yml)..."
	docker compose -f docker-compose.yml down
	@echo "✅ Services stopped"

docker-down-volumes:
	@echo "🛑 Stopping Compose services and removing volumes..."
	docker compose -f docker-compose.yml down -v
	@echo "✅ Services stopped and volumes removed"

docker-logs:
	@docker compose -f docker-compose.yml logs -f

docker-rebuild:
	@echo "🔄 Rebuilding and restarting Compose services..."
	docker compose -f docker-compose.yml down
	docker compose -f docker-compose.yml build --no-cache
	docker compose -f docker-compose.yml up -d
	@sleep 5
	@echo "✅ Services rebuilt and started"

docker-clean:
	@echo "🧹 Cleaning up Compose resources..."
	docker compose -f docker-compose.yml down -v
	@echo "✅ Cleanup complete"

docker-restart:
	@echo "🔄 Restarting services..."
	docker compose -f docker-compose.yml restart
	@sleep 3
	@docker compose -f docker-compose.yml ps

docker-ps:
	@docker compose -f docker-compose.yml ps

docker-shell:
	@docker compose -f docker-compose.yml exec fitquotient sh
