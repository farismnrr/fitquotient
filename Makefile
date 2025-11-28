#############################################
# FitQuotient Makefile (Full Version)
#############################################

IMAGE_NAME ?= fitquotient
TAG ?= dev

UI_PORT ?= 3000
CORE_PORT ?= 5400
CV_ASSESSOR_PORT ?= 5500

NEXT_PUBLIC_URL_CORE ?= http://localhost:$(CORE_PORT)

# Load .env from repo root
-include .env

#############################################
# GHCR SETTINGS
#############################################

GHCR_OWNER ?= farismnrr
GHCR_IMAGE ?= ghcr.io/$(GHCR_OWNER)/fitquotient
GHCR_TAG ?= $(TAG)

GHCR_USER ?= $(GHCR_USERNAME)
GHCR_TOKEN ?= $(GITHUB_PAT_TOKEN)

.PHONY: ghcr-login build-ghcr push-ghcr publish push create-deployment-zip
.PHONY: docker-build docker-up docker-down docker-down-volumes docker-logs docker-rebuild docker-clean docker-restart docker-ps docker-shell
.PHONY: update


#############################################
# GHCR LOGIN (ONLY FOR PUSH)
#############################################
ghcr-login:
	@if [ -z "$(GHCR_USER)" ] || [ -z "$(GHCR_TOKEN)" ]; then \
		echo "❌ ERROR: GHCR_USER / GHCR_TOKEN are missing."; \
		echo "Set GHCR_USERNAME and GITHUB_PAT_TOKEN inside .env"; \
		exit 1; \
	fi
	@echo "🔐 Logging in to GHCR as $(GHCR_USER)"
	@echo "$(GHCR_TOKEN)" | docker login ghcr.io -u "$(GHCR_USER)" --password-stdin


#############################################
# BUILD GHCR IMAGE
#############################################
build-ghcr:
	@echo "🏗  Building GHCR image → $(GHCR_IMAGE):$(GHCR_TAG)"
	docker build \
		-t $(GHCR_IMAGE):$(GHCR_TAG) \
		-f Dockerfile .


#############################################
# PUSH TO GHCR
#############################################
push-ghcr: ghcr-login build-ghcr
	@echo "📤 Pushing to GHCR → $(GHCR_IMAGE):$(GHCR_TAG)"
	docker push $(GHCR_IMAGE):$(GHCR_TAG)


#############################################
# PUBLISH IMAGE
#############################################
publish: push-ghcr
	@echo "🚀 Image published: $(GHCR_IMAGE):$(GHCR_TAG)"


#############################################
# CREATE DEPLOYMENT ZIP
#############################################
create-deployment-zip:
	@echo "📦 Creating deployment package..."
	@mkdir -p dist
	@rm -f dist/fitquotient-deployment.zip
	@echo "📁 Creating temporary fitquotient directory structure..."
	@rm -rf dist/fitquotient
	@mkdir -p dist/fitquotient
	@echo "📋 Copying deployment files to fitquotient folder..."
	@cp .env.example dist/fitquotient/
	@cp docker-compose.yml dist/fitquotient/
	@cp docker-startup.sh dist/fitquotient/
	@cp Dockerfile dist/fitquotient/
	@cp env-config.sh dist/fitquotient/
	@cp init.sql dist/fitquotient/
	@cp Makefile dist/fitquotient/
	@echo "🗜️  Creating zip archive..."
	@cd dist && zip -r fitquotient-deployment.zip fitquotient/
	@echo "🧹 Cleaning up temporary directory..."
	@rm -rf dist/fitquotient
	@echo "✅ Deployment package created: dist/fitquotient-deployment.zip"



#############################################
# MAIN PUSH COMMAND
#############################################
# Examples:
#    make push TAG=latest
#    make push TAG=v1.2.3
#    make push        # defaults to TAG=dev
push: create-deployment-zip publish
	@echo "✅ Push completed → $(GHCR_IMAGE):$(GHCR_TAG)"


#############################################
# DOCKER COMPOSE COMMANDS
#############################################

docker-build:
	@echo "🔨 Building docker-compose services..."
	docker compose -f docker-compose.yml build --no-cache
	@echo "✅ Build complete."

docker-up:
	@echo "🚀 Starting docker-compose services..."
	docker compose -f docker-compose.yml up -d
	@sleep 5
	@docker compose -f docker-compose.yml ps
	@echo "✅ Services running."

docker-down:
	@echo "🛑 Stopping docker-compose services..."
	docker compose -f docker-compose.yml down
	@echo "✅ Services stopped."

docker-down-volumes:
	@echo "🛑 Stopping services & removing volumes..."
	docker compose -f docker-compose.yml down -v
	@echo "✅ All stopped and volumes removed."

docker-logs:
	docker compose -f docker-compose.yml logs -f

docker-rebuild:
	@echo "🔄 Rebuilding services..."
	docker compose -f docker-compose.yml down
	docker compose -f docker-compose.yml build --no-cache
	docker compose -f docker-compose.yml up -d
	@sleep 5
	@echo "✅ Services rebuilt."

docker-clean:
	@echo "🧹 Cleaning docker-compose..."
	docker compose -f docker-compose.yml down -v
	@echo "✅ Cleanup done."

docker-restart:
	@echo "🔄 Restarting services..."
	docker compose -f docker-compose.yml restart
	@sleep 3
	@docker compose -f docker-compose.yml ps

docker-ps:
	docker compose -f docker-compose.yml ps

docker-shell:
	docker compose -f docker-compose.yml exec fitquotient sh


#############################################
# WATCHTOWER — ONE SHOT UPDATE (DEFAULT TAG=dev)
#############################################
update:
	@echo "🔍 Updating container using tag: $(TAG)"

	@echo "📥 Pulling image → $(GHCR_IMAGE):$(TAG)"
	docker pull $(GHCR_IMAGE):$(TAG) || true

	@echo "🚀 Running Watchtower (one-shot mode, forced API 1.44)..."
	docker run --rm \
		--name watchtower_fitquotient_update \
		-v /var/run/docker.sock:/var/run/docker.sock \
		-e DOCKER_API_VERSION=1.44 \
		containrrr/watchtower:latest \
		fitquotient \
		--run-once \
		--cleanup \
		--debug

	@echo "✅ Update completed for tag: $(TAG)"