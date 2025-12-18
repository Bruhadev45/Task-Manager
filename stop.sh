#!/bin/bash

# Script to stop all running backend and frontend servers

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🛑 Stopping Task Manager servers...${NC}"
echo ""

# Function to kill process on a port
kill_port() {
    local port=$1
    local name=$2
    
    # Find process using the port
    local pid=$(lsof -ti:$port 2>/dev/null)
    
    if [ -n "$pid" ]; then
        echo -e "${YELLOW}Stopping $name on port $port (PID: $pid)...${NC}"
        kill $pid 2>/dev/null || {
            # Try force kill if regular kill doesn't work
            kill -9 $pid 2>/dev/null || true
        }
        sleep 1
        
        # Verify it's stopped
        if ! lsof -ti:$port >/dev/null 2>&1; then
            echo -e "${GREEN}✅ $name stopped${NC}"
        else
            echo -e "${RED}❌ Failed to stop $name${NC}"
        fi
    else
        echo -e "${YELLOW}ℹ️  $name is not running on port $port${NC}"
    fi
}

# Stop backend (port 8000)
kill_port 8000 "Backend server"

# Stop frontend (port 3000)
kill_port 3000 "Frontend server"

# Try to kill by process name as fallback
echo ""
echo -e "${BLUE}Checking for remaining processes...${NC}"

# Kill uvicorn processes
UVICORN_PIDS=$(pgrep -f "uvicorn main:app" 2>/dev/null || true)
if [ -n "$UVICORN_PIDS" ]; then
    echo -e "${YELLOW}Stopping uvicorn processes...${NC}"
    echo "$UVICORN_PIDS" | xargs kill 2>/dev/null || true
    echo -e "${GREEN}✅ Uvicorn processes stopped${NC}"
fi

# Kill Next.js processes
NEXTJS_PIDS=$(pgrep -f "next dev" 2>/dev/null || true)
if [ -n "$NEXTJS_PIDS" ]; then
    echo -e "${YELLOW}Stopping Next.js processes...${NC}"
    echo "$NEXTJS_PIDS" | xargs kill 2>/dev/null || true
    echo -e "${GREEN}✅ Next.js processes stopped${NC}"
fi

# Clean up PID file if it exists
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$SCRIPT_DIR/.server_pids" ]; then
    PIDS=$(cat "$SCRIPT_DIR/.server_pids" 2>/dev/null || true)
    if [ -n "$PIDS" ]; then
        echo -e "${YELLOW}Stopping processes from PID file...${NC}"
        for pid in $PIDS; do
            kill $pid 2>/dev/null || true
        done
        rm "$SCRIPT_DIR/.server_pids" 2>/dev/null || true
    fi
fi

# Clean up port files
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$SCRIPT_DIR/.backend_port" ]; then
    rm "$SCRIPT_DIR/.backend_port" 2>/dev/null || true
fi
if [ -f "$SCRIPT_DIR/.frontend_port" ]; then
    rm "$SCRIPT_DIR/.frontend_port" 2>/dev/null || true
fi

echo ""
echo -e "${GREEN}✅ All servers stopped${NC}"
echo ""
