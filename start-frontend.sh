#!/bin/bash

# Script to start the Next.js frontend server
# This script installs dependencies if needed and starts the dev server

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Task Manager Frontend...${NC}"
echo ""

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# Navigate to frontend directory
cd "$FRONTEND_DIR"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is not installed${NC}"
    echo -e "${YELLOW}💡 Please install Node.js 18+ from https://nodejs.org/${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
echo -e "${GREEN}✅ npm: $(npm --version)${NC}"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📥 Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
    echo ""
fi

# Check if .env.local exists (optional, not required)
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local file not found${NC}"
    if [ -f ".env.local.example" ]; then
        read -p "Create from .env.local.example? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cp .env.local.example .env.local
            echo -e "${GREEN}✅ Created .env.local (using default API URL: http://localhost:8000)${NC}"
        fi
    else
        echo -e "${YELLOW}💡 Using default API URL: http://localhost:8000${NC}"
        echo -e "${YELLOW}💡 Create .env.local if you need to change the API URL${NC}"
    fi
    echo ""
fi

# Function to find an available port
find_available_port() {
    local start_port=$1
    local port=$start_port
    while lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; do
        port=$((port + 1))
        if [ $port -gt 65535 ]; then
            echo -e "${RED}❌ Error: No available ports found${NC}"
            exit 1
        fi
    done
    echo $port
}

# Check if port 3000 is already in use and find alternative
FRONTEND_PORT=3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠️  Port 3000 is already in use${NC}"
    FRONTEND_PORT=$(find_available_port 3001)
    echo -e "${GREEN}✅ Using alternative port: $FRONTEND_PORT${NC}"
    echo ""
fi

# Save frontend port to file for other scripts
echo "$FRONTEND_PORT" > "$SCRIPT_DIR/.frontend_port"

# Check backend port from file if it exists, otherwise use default
BACKEND_PORT=8000
if [ -f "$SCRIPT_DIR/.backend_port" ]; then
    BACKEND_PORT=$(cat "$SCRIPT_DIR/.backend_port")
fi

# Check if backend is running (optional check)
if ! curl -s http://localhost:$BACKEND_PORT/ >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Warning: Backend server doesn't seem to be running on http://localhost:$BACKEND_PORT${NC}"
    echo -e "${YELLOW}💡 Make sure to start the backend first with: ./start-backend.sh${NC}"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    echo ""
fi

# Start the development server
echo -e "${GREEN}✅ Starting Next.js development server...${NC}"
echo -e "${BLUE}🌐 Frontend: http://localhost:$FRONTEND_PORT${NC}"
echo ""
echo -e "${YELLOW}💡 Press Ctrl+C to stop the server${NC}"
echo ""

# Start Next.js dev server with custom port
PORT=$FRONTEND_PORT npm run dev || {
    echo ""
    echo -e "${RED}❌ Failed to start frontend server${NC}"
    echo -e "${YELLOW}💡 Check the error messages above for details${NC}"
    exit 1
}
