.PHONY: build clean start docker-start docker-stop test test-e2e

# Load .env file if exists
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

AIR := $(shell command -v air)

build:
	mkdir -p dist
	go build -o dist/cv_assessor .

clean:
	rm -rf dist

AIR := $(shell command -v air 2>/dev/null || echo $(HOME)/go/bin/air)

start:
	@if [ ! -x "$(AIR)" ]; then \
		echo "Error: air not found. Install with: go install github.com/air-verse/air@latest"; \
		exit 1; \
	fi
	$(AIR)

docker-start:
	docker compose up -d

docker-stop:
	docker compose down

test:
	go test -v ./...

test-e2e:
	cd tests && npm run test:run
