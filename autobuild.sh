#!/bin/bash

set -e

IMAGE_NAME="fitquotient"
IMAGE_TAG="latest"
CONTAINER_NAME="fitquotient-container"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() { echo -e "${BLUE}========================================${NC}\n$1\n${BLUE}========================================${NC}"; }
print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }

check_docker() {
    ! command -v docker &> /dev/null && { print_error "Docker not found"; exit 1; }
    ! docker ps &> /dev/null && { print_error "Docker daemon not running"; exit 1; }
    print_success "Docker ready"
}

stop_container() {
    docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$" && docker stop ${CONTAINER_NAME} 2>/dev/null || true
}

remove_container() {
    stop_container
    docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$" && docker rm ${CONTAINER_NAME}
}

remove_image() {
    docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "^${IMAGE_NAME}:${IMAGE_TAG}$" && docker rmi ${IMAGE_NAME}:${IMAGE_TAG}
}

build_image() {
    local cache=""
    [ "$1" = "--no-cache" ] || [ "$1" = "--rebuild" ] && cache="--no-cache"
    print_header "Building Image"
    docker build $cache -f Dockerfile -t ${IMAGE_NAME}:${IMAGE_TAG} . || { print_error "Build failed"; exit 1; }
    print_success "Build complete"
}

run_container() {
    print_header "Running Container"
    remove_container
    docker run -d --name ${CONTAINER_NAME} -p 5400:5400 -p 5500:5500 --restart unless-stopped ${IMAGE_NAME}:${IMAGE_TAG} || { print_error "Start failed"; exit 1; }
    print_success "Container started"
}

show_logs() { docker logs -f ${CONTAINER_NAME}; }

show_status() {
    echo ""
    print_header "Status"
    docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$" && print_success "Running" || print_error "Not running"
    docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.ID}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null
}

shell_access() {
    docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$" && docker exec -it ${CONTAINER_NAME} /bin/sh || { print_error "Container not running"; exit 1; }
}

case "${1:-}" in
    --help|-h) cat << EOF
Usage: $0 [COMMAND]
Commands:
    (default)       Build & run
    --no-cache      Build without cache
    --rebuild       Force rebuild
    --stop          Stop container
    --remove        Remove container
    --remove-all    Remove all
    --logs          View logs
    --status        Show status
    --shell         Open shell
EOF
    ;;
    --stop) stop_container; show_status ;;
    --remove) remove_container; show_status ;;
    --remove-all) remove_container; remove_image; print_header "Cleanup done" ;;
    --logs) docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$" && show_logs || { print_error "Not running"; exit 1; } ;;
    --status) show_status ;;
    --shell) shell_access ;;
    --no-cache|--rebuild) check_docker; build_image "$1"; run_container; show_status ;;
    *) check_docker; build_image; run_container; show_status ;;
esac
