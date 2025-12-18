#!/bin/bash

# Script to start both backend and frontend servers
# Opens two terminal windows (macOS) or runs in background (Linux)

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Task Manager Application...${NC}"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Check OS and start servers accordingly
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - open new terminal windows
    echo -e "${GREEN}📱 Detected macOS - opening separate terminal windows${NC}"
    echo ""
    
    # Make scripts executable
    chmod +x "$SCRIPT_DIR/start-backend.sh"
    chmod +x "$SCRIPT_DIR/start-frontend.sh"
    
    # Start backend in new terminal window
    echo -e "${BLUE}📦 Starting backend...${NC}"
    osascript -e "tell application \"Terminal\" to do script \"cd '$SCRIPT_DIR' && ./start-backend.sh\"" 2>/dev/null || {
        echo -e "${YELLOW}⚠️  Could not open Terminal window. Trying alternative method...${NC}"
        open -a Terminal "$SCRIPT_DIR/start-backend.sh"
    }
    
    # Wait a moment before starting frontend
    sleep 3
    
    # Start frontend in new terminal window
    echo -e "${BLUE}📦 Starting frontend...${NC}"
    osascript -e "tell application \"Terminal\" to do script \"cd '$SCRIPT_DIR' && ./start-frontend.sh\"" 2>/dev/null || {
        echo -e "${YELLOW}⚠️  Could not open Terminal window. Trying alternative method...${NC}"
        open -a Terminal "$SCRIPT_DIR/start-frontend.sh"
    }
    
    echo ""
    echo -e "${GREEN}✅ Backend and Frontend servers are starting in separate terminal windows${NC}"
    
    # Wait a moment for ports to be determined
    sleep 2
    
    # Read ports from files if they exist
    BACKEND_PORT=8000
    FRONTEND_PORT=3000
    if [ -f "$SCRIPT_DIR/.backend_port" ]; then
        BACKEND_PORT=$(cat "$SCRIPT_DIR/.backend_port")
    fi
    if [ -f "$SCRIPT_DIR/.frontend_port" ]; then
        FRONTEND_PORT=$(cat "$SCRIPT_DIR/.frontend_port")
    fi
    
    echo -e "${BLUE}🌐 Backend: http://localhost:$BACKEND_PORT${NC}"
    echo -e "${BLUE}🌐 Frontend: http://localhost:$FRONTEND_PORT${NC}"
    echo ""
    echo -e "${YELLOW}💡 Close the terminal windows to stop the servers${NC}"
    echo -e "${YELLOW}💡 Or run ./stop.sh to stop all servers${NC}"
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux - run in background
    echo -e "${GREEN}🐧 Detected Linux - running servers in background${NC}"
    echo ""
    
    # Make scripts executable
    chmod +x "$SCRIPT_DIR/start-backend.sh"
    chmod +x "$SCRIPT_DIR/start-frontend.sh"
    
    # Start backend in background
    echo -e "${BLUE}📦 Starting backend...${NC}"
    cd "$SCRIPT_DIR/backend"
    nohup ./start-backend.sh > backend.log 2>&1 &
    BACKEND_PID=$!
    echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
    
    # Wait a moment
    sleep 3
    
    # Start frontend in background
    echo -e "${BLUE}📦 Starting frontend...${NC}"
    cd "$SCRIPT_DIR/frontend"
    nohup ./start-frontend.sh > frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
    
    # Wait a moment for ports to be determined
    sleep 2
    
    # Read ports from files if they exist
    BACKEND_PORT=8000
    FRONTEND_PORT=3000
    if [ -f "$SCRIPT_DIR/.backend_port" ]; then
        BACKEND_PORT=$(cat "$SCRIPT_DIR/.backend_port")
    fi
    if [ -f "$SCRIPT_DIR/.frontend_port" ]; then
        FRONTEND_PORT=$(cat "$SCRIPT_DIR/.frontend_port")
    fi
    
    echo ""
    echo -e "${BLUE}🌐 Backend: http://localhost:$BACKEND_PORT${NC}"
    echo -e "${BLUE}🌐 Frontend: http://localhost:$FRONTEND_PORT${NC}"
    echo ""
    echo -e "${GREEN}📝 Logs:${NC}"
    echo "   Backend:  tail -f $SCRIPT_DIR/backend/backend.log"
    echo "   Frontend: tail -f $SCRIPT_DIR/frontend/frontend.log"
    echo ""
    echo -e "${YELLOW}🛑 To stop servers:${NC}"
    echo "   kill $BACKEND_PID $FRONTEND_PID"
    echo "   Or run: ./stop.sh"
    
    # Save PIDs to file for stop script
    echo "$BACKEND_PID $FRONTEND_PID" > "$SCRIPT_DIR/.server_pids"
    
else
    # Windows or other - provide instructions
    echo -e "${YELLOW}⚠️  Unsupported OS or unable to auto-start${NC}"
    echo ""
    echo "Please run these commands in separate terminals:"
    echo "  Terminal 1: ./start-backend.sh"
    echo "  Terminal 2: ./start-frontend.sh"
    echo ""
    exit 1
fi
