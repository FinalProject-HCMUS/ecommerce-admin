#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN} Starting Ecommerce Admin Development Environment${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED} Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}  .env file not found. Creating from template...${NC}"
    cp .env.example .env 2>/dev/null || echo -e "${RED} .env.example not found. Please create .env file manually.${NC}"
fi

# Stop any existing containers
echo -e "${YELLOW} Stopping existing containers...${NC}"
docker-compose -f docker-compose.dev.yaml down

# Build and start the development environment
echo -e "${GREEN}  Building and starting development containers...${NC}"
docker-compose -f docker-compose.dev.yaml up --build

# If the above command fails, try to run without build
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}  Build failed, trying to start existing containers...${NC}"
    docker-compose -f docker-compose.dev.yaml up
fi