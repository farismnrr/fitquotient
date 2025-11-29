#!/bin/bash

# ==========================================
# FitQuotient Environment Configuration Script
# ==========================================
# This script automatically generates .env from .env.example
# with proper configuration values

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=========================================="
echo -e "FitQuotient Environment Setup"
echo -e "==========================================${NC}"

# Check if .env.example exists
if [ ! -f .env.example ]; then
    echo -e "${RED}Error: .env.example file not found!${NC}"
    exit 1
fi

# Function to generate random SHA256 hash
generate_random_hash() {
    openssl rand -hex 32
}

# Function to get host IP
get_host_ip() {
    # Try to get the primary network interface IP
    # This works on most Linux systems
    local ip=$(hostname -I | awk '{print $1}')
    
    # Fallback to localhost if no IP found
    if [ -z "$ip" ]; then
        ip="127.0.0.1"
    fi
    
    echo "$ip"
}

echo -e "${YELLOW}Generating configuration values...${NC}"

# Get host IP
HOST_IP=$(get_host_ip)
echo -e "Host IP: ${GREEN}${HOST_IP}${NC}"

# Generate random hashes
CORE_API_KEY=$(generate_random_hash)
JWT_SECRET=$(generate_random_hash)
REDIS_PASS=$(generate_random_hash)
CV_ASSESSOR_API_KEY=$(generate_random_hash)
QDRANT_API_KEY=$(generate_random_hash)

echo -e "${YELLOW}Generated secure random keys${NC}"

# Create .env file from .env.example
echo -e "${YELLOW}Creating .env file...${NC}"

# Copy .env.example to .env
cp .env.example .env

# Replace values in .env file
# Using | as delimiter to avoid issues with / in URLs

# 1. CORE_HOST
sed -i "s|^CORE_HOST=.*|CORE_HOST=0.0.0.0|" .env

# 2. LOG_LEVEL
sed -i "s|^LOG_LEVEL=.*|LOG_LEVEL=info|" .env

# 4. CORE_API_KEY
sed -i "s|^CORE_API_KEY=.*|CORE_API_KEY=${CORE_API_KEY}|" .env

# 4.5. CORE_CORS_ORIGINS (Allow frontend from any host/port)
# Use wildcard to allow all origins, or specify: http://localhost:3000,http://${HOST_IP}:3001
sed -i "s|^CORE_CORS_ORIGINS=.*|CORE_CORS_ORIGINS=*|" .env

# 5. JWT_SECRET
sed -i "s|^JWT_SECRET=.*|JWT_SECRET=${JWT_SECRET}|" .env

# 6. JWT_EXPIRATION
sed -i "s|^JWT_EXPIRATION=.*|JWT_EXPIRATION=10|" .env

# 7. JWT_REFRESH_EXPIRATION
sed -i "s|^JWT_REFRESH_EXPIRATION=.*|JWT_REFRESH_EXPIRATION=604800|" .env

# Database Configuration
sed -i "s|^# CORE_DB_TYPE=.*|CORE_DB_TYPE=sqlite|" .env

# 8. CORE_DB_PATH (use absolute path for Docker compatibility)
sed -i "s|^CORE_DB_PATH=.*|CORE_DB_PATH=/home/appuser/core/sqlite_data/database.sqlite|" .env

# 9. CV_ASSESSOR_HOST
sed -i "s|^CV_ASSESSOR_HOST=.*|CV_ASSESSOR_HOST=0.0.0.0|" .env

# 10. CV_ASSESSOR_API_KEY
sed -i "s|^CV_ASSESSOR_API_KEY=.*|CV_ASSESSOR_API_KEY=${CV_ASSESSOR_API_KEY}|" .env

# 11. CV_ASSESSOR_BASE_URL (Internal - for server-side communication within container)
# Use localhost since CV Assessor runs in the same container
sed -i "s|^CV_ASSESSOR_BASE_URL=.*|CV_ASSESSOR_BASE_URL=http://127.0.0.1:5500|" .env

# 12. REDIS_HOST
sed -i "s|^REDIS_HOST=.*|REDIS_HOST=fitquotient-redis|" .env

# 13. REDIS_PORT
sed -i "s|^REDIS_PORT=.*|REDIS_PORT=6379|" .env

# 14. REDIS_PASS
sed -i "s|^REDIS_PASS=.*|REDIS_PASS=${REDIS_PASS}|" .env

# 15. QDRANT_HOST
sed -i "s|^QDRANT_HOST=.*|QDRANT_HOST=fitquotient-qdrant|" .env

# 16. QDRANT_PORT
sed -i "s|^QDRANT_PORT=.*|QDRANT_PORT=6333|" .env

# QDRANT_URL (for compatibility)
sed -i "s|^QDRANT_URL=.*|QDRANT_URL=http://fitquotient-qdrant:6333|" .env

# 17. QDRANT_API_KEY (fix the existing value in .env.example which seems incorrect)
sed -i "s|^QDRANT_API_KEY=.*|QDRANT_API_KEY=${QDRANT_API_KEY}|" .env

# 18. TZ
sed -i "s|^TZ=.*|TZ=+07:00|" .env

# 19. NODE_ENV
sed -i "s|^NODE_ENV=.*|NODE_ENV=production|" .env

# 20. GIN_MODE
sed -i "s|^GIN_MODE=.*|GIN_MODE=release|" .env

# 21. URL_CORE (Internal - for server-side communication within container)
# Use localhost since all services run in the same container
sed -i "s|^URL_CORE=.*|URL_CORE=http://127.0.0.1:5400|" .env

# 22. NEXT_PUBLIC_URL_CORE (External - for client-side browser access)
# Use host IP and HOST PORT (5401) for external access from browser
sed -i "s|^NEXT_PUBLIC_URL_CORE=.*|NEXT_PUBLIC_URL_CORE=http://${HOST_IP}:5401|" .env

# 23. URL_API_KEY
sed -i "s|^URL_API_KEY=.*|URL_API_KEY=${CORE_API_KEY}|" .env

# Ensure file ends with a newline
printf "\n" >> .env

echo -e "${GREEN}=========================================="
echo -e "✓ .env file created successfully!"
echo -e "==========================================${NC}"
echo ""
echo -e "${YELLOW}Configuration Summary:${NC}"
echo -e "  Host IP: ${GREEN}${HOST_IP}${NC}"
echo ""
echo -e "${YELLOW}Internal URLs (within container):${NC}"
echo -e "  Core Service: ${GREEN}http://127.0.0.1:5400${NC}"
echo -e "  CV Assessor: ${GREEN}http://127.0.0.1:5500${NC}"
echo ""
echo -e "${YELLOW}External URLs (browser access):${NC}"
echo -e "  Core Service: ${GREEN}http://${HOST_IP}:5401${NC}"
echo -e "  CV Assessor: ${GREEN}http://${HOST_IP}:5501${NC}"
echo -e "  UI: ${GREEN}http://${HOST_IP}:3001${NC}"
echo -e "  Redis: ${GREEN}${HOST_IP}:6379${NC}"
echo -e "  Qdrant: ${GREEN}http://${HOST_IP}:6333${NC}"
echo ""
echo -e "${YELLOW}Other Settings:${NC}"
echo -e "  Database: ${GREEN}/home/appuser/core/sqlite_data/database.sqlite${NC}"
echo -e "  Environment: ${GREEN}production${NC}"
echo ""
echo -e "${YELLOW}Security Keys Generated:${NC}"
echo -e "  ✓ CORE_API_KEY"
echo -e "  ✓ JWT_SECRET"
echo -e "  ✓ CV_ASSESSOR_API_KEY"
echo -e "  ✓ REDIS_PASS"
echo -e "  ✓ QDRANT_API_KEY"
echo ""
echo -e "${GREEN}You can now use the .env file for your application!${NC}"
