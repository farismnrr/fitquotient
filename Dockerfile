# ==========================================================================
# Multi-stage combined Dockerfile (Core + UI + CV Assessor)
# - Builds NestJS core (TypeScript), Go CV Assessor, and Next.js UI
# - Combines into one runtime image that runs all three services using one
#   startup script (no docker-compose used)
# ========================================================================== 

# -----------------------------
# Stage 1: NestJS builder
# -----------------------------
FROM node:20-alpine AS nestjs-builder

WORKDIR /app/core

# Build dependencies
RUN apk add --no-cache python3 make g++ ca-certificates postgresql-client

# Copy package files and install
COPY fitquotient_core/core/package*.json ./
RUN npm ci

# Copy source code and config
COPY fitquotient_core/core/ .
COPY fitquotient_core/core/typeorm.config.js ./

# Prepare and build (same as Dockerfile.core)
RUN mkdir -p migrations && \
    npm run build:tsc && \
    node ./generate-migrations.js || true && \
    npm run build && \
    node obfuscate.js || true


# -----------------------------
# Stage 2: Go builder (CV Assessor)
# -----------------------------
FROM golang:1.24.10-alpine AS go-builder

WORKDIR /app/cv_assessor
RUN apk add --no-cache git ca-certificates
COPY fitquotient_core/cv_assessor/go.mod fitquotient_core/cv_assessor/go.sum* ./
RUN go mod download
COPY fitquotient_core/cv_assessor/ .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o cv_assessor .


# -----------------------------
# Stage 3: UI builder (Next.js)
# -----------------------------
FROM node:20-alpine AS ui-deps
RUN apk add --no-cache libc6-compat
WORKDIR /app/ui
COPY fitquotient_frontend/package.json fitquotient_frontend/package-lock.json* ./
RUN npm ci

FROM node:20-alpine AS ui-builder
WORKDIR /app/ui
COPY --from=ui-deps /app/ui/node_modules ./node_modules
COPY fitquotient_frontend/ .
ARG NEXT_PUBLIC_URL_CORE
ENV NEXT_PUBLIC_URL_CORE=$NEXT_PUBLIC_URL_CORE
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build


# -----------------------------
# Stage 4: Runtime: combine all builds into one image
# -----------------------------
FROM node:20-alpine

# Runtime packages
RUN apk update && apk add --no-cache ca-certificates tzdata curl bash postgresql-client libc6-compat

RUN addgroup -g 1001 appuser && adduser -D -u 1001 -G appuser appuser

WORKDIR /home/appuser

RUN mkdir -p core/migrations core/uploads cv_assessor ui && chown -R appuser:appuser /home/appuser

# Copy NestJS files
COPY --from=nestjs-builder --chown=appuser:appuser /app/core/dist ./core/dist
COPY --from=nestjs-builder --chown=appuser:appuser /app/core/node_modules ./core/node_modules
COPY --from=nestjs-builder --chown=appuser:appuser /app/core/package*.json ./core/
COPY --from=nestjs-builder --chown=appuser:appuser /app/core/generate-migrations.js ./core/
COPY --from=nestjs-builder --chown=appuser:appuser /app/core/migrations ./core/migrations
COPY --chown=appuser:appuser fitquotient_core/core/typeorm.config.js ./core/
RUN rm -f ./core/migrations/init.js || true

# Copy Go CV Assessor binary
COPY --from=go-builder --chown=appuser:appuser /app/cv_assessor/cv_assessor ./cv_assessor/

# Copy UI build outputs (standalone + static + public)
COPY --from=ui-builder --chown=appuser:appuser /app/ui/.next/standalone ./ui/standalone
COPY --from=ui-builder --chown=appuser:appuser /app/ui/.next/static ./ui/.next/static
COPY --from=ui-builder --chown=appuser:appuser /app/ui/public ./ui/public

# Copy startup script and make executable
COPY --chown=appuser:appuser fitquotient_core/docker-startup.sh ./docker-startup.sh
RUN chmod +x ./docker-startup.sh

USER appuser

# Expose ports (default core 5400, cv_assessor 5500, ui 3000)
EXPOSE 5400 5500 3000

# Basic healthcheck: verify core, cv_assessor and UI endpoints (all must succeed)
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -fsS http://127.0.0.1:5400/healthcheck >/dev/null && curl -fsS http://127.0.0.1:5500/healthcheck >/dev/null && curl -fsS http://127.0.0.1:3000/api/health >/dev/null || exit 1

ENTRYPOINT ["/bin/bash"]
CMD ["/home/appuser/docker-startup.sh"]
