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
sed -i "s|^CORE_HOST=.*|CORE_HOST=${HOST_IP}|" .env

# 2. CORE_PORT
sed -i "s|^CORE_PORT=.*|CORE_PORT=5400|" .env

# 3. LOG_LEVEL
sed -i "s|^LOG_LEVEL=.*|LOG_LEVEL=info|" .env

# 4. CORE_API_KEY
sed -i "s|^CORE_API_KEY=.*|CORE_API_KEY=${CORE_API_KEY}|" .env

# 5. JWT_SECRET
sed -i "s|^JWT_SECRET=.*|JWT_SECRET=${JWT_SECRET}|" .env

# 6. JWT_EXPIRATION
sed -i "s|^JWT_EXPIRATION=.*|JWT_EXPIRATION=10|" .env

# 7. JWT_REFRESH_EXPIRATION
sed -i "s|^JWT_REFRESH_EXPIRATION=.*|JWT_REFRESH_EXPIRATION=604800|" .env

# 8. CORE_DB_PATH
sed -i "s|^CORE_DB_PATH=.*|CORE_DB_PATH=./database.sqlite|" .env

# 9. CV_ASSESSOR_HOST
sed -i "s|^CV_ASSESSOR_HOST=.*|CV_ASSESSOR_HOST=${HOST_IP}|" .env

# 10. CV_ASSESSOR_PORT
sed -i "s|^CV_ASSESSOR_PORT=.*|CV_ASSESSOR_PORT=5500|" .env

# 11. CV_ASSESSOR_API_KEY
sed -i "s|^CV_ASSESSOR_API_KEY=.*|CV_ASSESSOR_API_KEY=${CV_ASSESSOR_API_KEY}|" .env

# 12. CV_ASSESSOR_BASE_URL
sed -i "s|^CV_ASSESSOR_BASE_URL=.*|CV_ASSESSOR_BASE_URL=http://${HOST_IP}:5500|" .env

# 13. REDIS_HOST
sed -i "s|^REDIS_HOST=.*|REDIS_HOST=${HOST_IP}|" .env

# 14. REDIS_PORT
sed -i "s|^REDIS_PORT=.*|REDIS_PORT=6379|" .env

# 15. REDIS_PASS
sed -i "s|^REDIS_PASS=.*|REDIS_PASS=${REDIS_PASS}|" .env

# 16. QDRANT_URL
sed -i "s|^QDRANT_URL=.*|QDRANT_URL=http://${HOST_IP}:6333|" .env

# 17. QDRANT_API_KEY (fix the existing value in .env.example which seems incorrect)
sed -i "s|^QDRANT_API_KEY=.*|QDRANT_API_KEY=${QDRANT_API_KEY}|" .env

# 18. TZ
sed -i "s|^TZ=.*|TZ=+07:00|" .env

# 19. NODE_ENV
sed -i "s|^NODE_ENV=.*|NODE_ENV=production|" .env

# 20. GIN_MODE
sed -i "s|^GIN_MODE=.*|GIN_MODE=release|" .env

# 21. URL_CORE
sed -i "s|^URL_CORE=.*|URL_CORE=http://${HOST_IP}:5400|" .env

# 22. NEXT_PUBLIC_URL_CORE
sed -i "s|^NEXT_PUBLIC_URL_CORE=.*|NEXT_PUBLIC_URL_CORE=http://${HOST_IP}:5400|" .env

# 23. URL_API_KEY
sed -i "s|^URL_API_KEY=.*|URL_API_KEY=${CORE_API_KEY}|" .env

echo -e "${GREEN}=========================================="
echo -e "✓ .env file created successfully!"
echo -e "==========================================${NC}"
echo ""
echo -e "${YELLOW}Configuration Summary:${NC}"
echo -e "  Host IP: ${GREEN}${HOST_IP}${NC}"
echo -e "  Core Service: ${GREEN}http://${HOST_IP}:5400${NC}"
echo -e "  CV Assessor: ${GREEN}http://${HOST_IP}:5500${NC}"
echo -e "  Redis: ${GREEN}${HOST_IP}:6379${NC}"
echo -e "  Qdrant: ${GREEN}http://${HOST_IP}:6333${NC}"
echo -e "  Database: ${GREEN}./database.sqlite${NC}"
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
