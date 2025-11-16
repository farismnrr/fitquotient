FROM node:22-alpine AS core-builder
WORKDIR /app/core
COPY fitquotient_core/core/package*.json ./
RUN npm ci
COPY fitquotient_core/core/ .
RUN npm run build && npm run build:secure

FROM golang:1.24.10-alpine AS cv-builder
RUN apk add --no-cache git ca-certificates
WORKDIR /app/cv_assessor
COPY fitquotient_core/cv_assessor/go.mod fitquotient_core/cv_assessor/go.sum* ./
RUN go mod download
COPY fitquotient_core/cv_assessor/ .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o cv_assessor .

FROM alpine:3.20
RUN apk add --no-cache ca-certificates tzdata dumb-init nodejs npm wget
RUN addgroup -g 1000 appuser && adduser -D -u 1000 -G appuser appuser
WORKDIR /app
RUN mkdir -p /app/core /app/cv_assessor

COPY --from=core-builder --chown=appuser:appuser /app/core/node_modules ./core/node_modules
COPY --from=core-builder --chown=appuser:appuser /app/core/dist ./core/dist
COPY --from=core-builder --chown=appuser:appuser /app/core/package*.json ./core/
COPY --from=core-builder --chown=appuser:appuser /app/core/migrations ./core/migrations

COPY --from=cv-builder --chown=appuser:appuser /app/cv_assessor/cv_assessor ./cv_assessor/

COPY fitquotient_core/core/docker-entrypoint.sh /app/core/docker-entrypoint.sh
RUN chmod +x /app/core/docker-entrypoint.sh
COPY startup.sh /app/startup.sh
RUN chmod +x /app/startup.sh

USER appuser

EXPOSE 5400 5500

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5400/health', (r) => {r.resume()})" || exit 0

ENTRYPOINT ["dumb-init", "--"]
CMD ["/app/startup.sh"]
