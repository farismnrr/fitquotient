# Makefile for fitquotient_core NestJS project

.PHONY: help build build-secure start start-dev start-debug start-prod start-secure format lint test test-watch test-cov test-debug test-e2e migrate clean
.DEFAULT_GOAL := help

help:
	@echo "Usage: make <target>"
	@echo
	@echo "Build:"
	@echo "  build                     Build the project"
	@echo "  build-secure              Build and obfuscate the project"
	@echo
	@echo "Development:"
	@echo "  start                     Start the application"
	@echo "  start-dev                 Start in development mode with watch"
	@echo "  start-debug               Start in debug mode with watch"
	@echo
	@echo "Production:"
	@echo "  start-prod                Start production build"
	@echo "  start-secure              Start secure production build"
	@echo
	@echo "Code Quality:"
	@echo "  format                    Format code with Prettier"
	@echo "  lint                      Run ESLint with auto-fix"
	@echo
	@echo "Testing:"
	@echo "  test                      Run tests once"
	@echo "  test-watch                Run tests in watch mode"
	@echo "  test-cov                  Run tests with coverage"
	@echo "  test-debug                Debug tests"
	@echo "  test-e2e                  Run end-to-end tests"
	@echo
	@echo "Database Migrations:"
	@echo "  migrate-generate          Generate new migration"
	@echo "  migrate-run               Run pending migrations"
	@echo "  migrate-revert            Revert last migration"
	@echo
	@echo "Utilities:"
	@echo "  clean                     Clean build artifacts"

# Build targets
build:
	npm run build

build-secure:
	npm run build:secure

# Development targets
start:
	npm run start

start-dev:
	npm run start:dev

start-debug:
	npm run start:debug

start-prod:
	npm run start:prod

start-secure:
	npm run start:secure

# Code quality targets
format:
	npm run format

lint:
	npm run lint

# Testing targets
test:
	npm run test

test-watch:
	npm run test:watch

test-cov:
	npm run test:cov

test-debug:
	npm run test:debug

test-e2e:
	npm run test:e2e

# Database migration targets
migrate-generate:
	@echo "Cleaning old migrations..."
	@rm -f migrations/*.ts
	@echo "✓ Old migrations removed"
	@echo "Creating new migration..."
	@npx typeorm-ts-node-commonjs migration:create migrations/init
	@echo "✓ Migration created at migrations/init.ts"

migrate-run:
	npm run migration:run

migrate-revert:
	npm run migration:revert

# Clean target
clean:
	@echo "Cleaning build artifacts..."
	@rm -rf dist/
	@rm -rf coverage/
	@rm -rf node_modules/
	@echo "✓ Clean complete"
