#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="ecommerce-admin"
TAG=${1:-latest}
REGISTRY=${2:-""}

echo -e "${GREEN}  Building Ecommerce Admin Application${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED} Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Build development image
echo -e "${BLUE} Building development image...${NC}"
docker build -f Dockerfile.dev -t ${IMAGE_NAME}:dev-${TAG} .

if [ $? -eq 0 ]; then
    echo -e "${GREEN} Development image built successfully: ${IMAGE_NAME}:dev-${TAG}${NC}"
else
    echo -e "${RED} Failed to build development image${NC}"
    exit 1
fi

# Build production image
echo -e "${BLUE} Building production image...${NC}"
docker build -f Dockerfile.prod -t ${IMAGE_NAME}:prod-${TAG} .

if [ $? -eq 0 ]; then
    echo -e "${GREEN} Production image built successfully: ${IMAGE_NAME}:prod-${TAG}${NC}"
else
    echo -e "${RED} Failed to build production image${NC}"
    exit 1
fi

# Tag as latest if not specified
if [ "$TAG" = "latest" ]; then
    docker tag ${IMAGE_NAME}:dev-${TAG} ${IMAGE_NAME}:dev-latest
    docker tag ${IMAGE_NAME}:prod-${TAG} ${IMAGE_NAME}:prod-latest
fi

# Push to registry if specified
if [ ! -z "$REGISTRY" ]; then
    echo -e "${BLUE} Pushing images to registry: ${REGISTRY}${NC}"
    
    # Tag for registry
    docker tag ${IMAGE_NAME}:dev-${TAG} ${REGISTRY}/${IMAGE_NAME}:dev-${TAG}
    docker tag ${IMAGE_NAME}:prod-${TAG} ${REGISTRY}/${IMAGE_NAME}:prod-${TAG}
    
    # Push to registry
    docker push ${REGISTRY}/${IMAGE_NAME}:dev-${TAG}
    docker push ${REGISTRY}/${IMAGE_NAME}:prod-${TAG}
    
    echo -e "${GREEN} Images pushed to registry successfully${NC}"
fi

echo -e "${GREEN} Build completed successfully!${NC}"
echo -e "${BLUE} Available images:${NC}"
docker images | grep ${IMAGE_NAME}