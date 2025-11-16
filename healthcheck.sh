#!/bin/sh
set -e

CORE_HOST="localhost"
CORE_PORT="5400"
CORE_ENDPOINT="/health"
CV_HOST="localhost"
CV_PORT="5500"
CV_ENDPOINT="/healthcheck"
TIMEOUT=10

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_core() {
    echo "Checking Core (${CORE_HOST}:${CORE_PORT}${CORE_ENDPOINT})..."
    if node -e "
        const http = require('http');
        const req = http.get('http://${CORE_HOST}:${CORE_PORT}${CORE_ENDPOINT}', { timeout: ${TIMEOUT} * 1000 }, (res) => {
            process.exit(res.statusCode === 200 ? 0 : 1);
        });
        req.on('error', () => process.exit(1));
        req.on('timeout', () => process.exit(1));
    " 2>/dev/null; then
        echo -e "${GREEN}✓ Core healthy${NC}"
        return 0
    else
        echo -e "${RED}✗ Core unhealthy${NC}"
        return 1
    fi
}

check_cv() {
    echo "Checking CV Assessor (${CV_HOST}:${CV_PORT}${CV_ENDPOINT})..."
    if wget --no-verbose --tries=1 --timeout=${TIMEOUT} --spider http://${CV_HOST}:${CV_PORT}${CV_ENDPOINT} 2>/dev/null; then
        echo -e "${GREEN}✓ CV Assessor healthy${NC}"
        return 0
    else
        echo -e "${RED}✗ CV Assessor unhealthy${NC}"
        return 1
    fi
}

core_ok=0
cv_ok=0
check_core || core_ok=$?
echo ""
check_cv || cv_ok=$?

if [ $core_ok -eq 0 ] && [ $cv_ok -eq 0 ]; then
    echo ""
    echo -e "${GREEN}All services healthy${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}Health check failed${NC}"
    exit 1
fi
