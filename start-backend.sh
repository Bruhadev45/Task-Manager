#!/bin/bash

# Script to start the FastAPI backend server
# This script activates the virtual environment and starts the server with proper error handling

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Task Manager Backend...${NC}"
echo ""

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"

# Navigate to backend directory
cd "$BACKEND_DIR"

# Check if virtual environment exists
VENV_ACTIVATED=false
if [ -d "venv" ]; then
    echo -e "${GREEN}📦 Activating virtual environment...${NC}"
    source venv/bin/activate
    VENV_ACTIVATED=true
elif [ -d ".venv" ]; then
    echo -e "${GREEN}📦 Activating virtual environment...${NC}"
    source .venv/bin/activate
    VENV_ACTIVATED=true
else
    echo -e "${YELLOW}⚠️  No virtual environment found. Using system Python.${NC}"
    echo -e "${YELLOW}💡 Tip: Create a virtual environment with: python3 -m venv venv${NC}"
    echo ""
    read -p "Continue with system Python? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo -e "${YELLOW}💡 Create .env file with your Supabase credentials:${NC}"
    echo "   SUPABASE_URL=your_supabase_project_url"
    echo "   SUPABASE_KEY=your_supabase_anon_key"
    echo ""
    if [ -f ".env.example" ]; then
        read -p "Copy from .env.example? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cp .env.example .env
            echo -e "${GREEN}✅ Created .env file. Please edit it with your Supabase credentials.${NC}"
            exit 1
        fi
    fi
    exit 1
fi

# Validate .env file has required variables
if ! grep -q "SUPABASE_URL=" .env || ! grep -q "SUPABASE_KEY=" .env; then
    echo -e "${RED}❌ Error: .env file is missing SUPABASE_URL or SUPABASE_KEY${NC}"
    echo -e "${YELLOW}💡 Please edit backend/.env and add your Supabase credentials${NC}"
    exit 1
fi

# Check if dependencies are installed
if ! python -c "import fastapi" 2>/dev/null; then
    echo -e "${YELLOW}📥 Installing dependencies...${NC}"
    pip install -r requirements.txt
    echo -e "${GREEN}✅ Dependencies installed${NC}"
fi

# Check if port 8000 is already in use
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠️  Port 8000 is already in use${NC}"
    echo -e "${YELLOW}💡 Another backend server might be running. Stop it first or use a different port.${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Start the server
echo ""
echo -e "${GREEN}✅ Starting FastAPI server...${NC}"
echo -e "${BLUE}🌐 Backend API: http://localhost:8000${NC}"
echo -e "${BLUE}📚 API Docs: http://localhost:8000/docs${NC}"
echo -e "${BLUE}💚 Health Check: http://localhost:8000/${NC}"
echo ""
echo -e "${YELLOW}💡 Press Ctrl+C to stop the server${NC}"
echo ""

# Start uvicorn with error handling
uvicorn main:app --reload --host 0.0.0.0 --port 8000 || {
    echo ""
    echo -e "${RED}❌ Failed to start backend server${NC}"
    echo -e "${YELLOW}💡 Check the error messages above for details${NC}"
    exit 1
}
