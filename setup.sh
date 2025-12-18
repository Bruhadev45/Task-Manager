#!/bin/bash

# Setup script to install all dependencies for the Task Manager application
# This script sets up both backend and frontend environments with comprehensive checks

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Setting up Task Manager Application...${NC}"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# ============================================
# Backend Setup
# ============================================
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}📦 Setting up Backend...${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
cd "$SCRIPT_DIR/backend"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed. Please install Python 3.8+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Python found: $(python3 --version)${NC}"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ] && [ ! -d ".venv" ]; then
    echo -e "${BLUE}📦 Creating virtual environment...${NC}"
    python3 -m venv venv
    echo -e "${GREEN}✅ Virtual environment created${NC}"
else
    echo -e "${GREEN}✅ Virtual environment already exists${NC}"
fi

# Activate virtual environment
if [ -d "venv" ]; then
    source venv/bin/activate
elif [ -d ".venv" ]; then
    source .venv/bin/activate
fi

# Upgrade pip
echo -e "${BLUE}📦 Upgrading pip...${NC}"
pip install --upgrade pip > /dev/null 2>&1 || {
    echo -e "${YELLOW}⚠️  Could not upgrade pip, continuing anyway...${NC}"
}

# Install Python dependencies
echo -e "${BLUE}📦 Installing Python dependencies...${NC}"
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ requirements.txt not found!${NC}"
    exit 1
fi

# Setup .env file if it doesn't exist
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo -e "${BLUE}📝 Creating .env file from .env.example...${NC}"
        cp .env.example .env
        echo -e "${YELLOW}⚠️  Please edit backend/.env and add your Supabase credentials:${NC}"
        echo "   SUPABASE_URL=your_project_url"
        echo "   SUPABASE_KEY=your_anon_key"
    else
        echo -e "${YELLOW}⚠️  .env.example not found. Please create .env manually${NC}"
    fi
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

echo ""

# ============================================
# Frontend Setup
# ============================================
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}📦 Setting up Frontend...${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
cd "$SCRIPT_DIR/frontend"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"
echo -e "${GREEN}✅ npm found: $(npm --version)${NC}"

# Install Node.js dependencies
echo -e "${BLUE}📦 Installing Node.js dependencies...${NC}"
if [ -f "package.json" ]; then
    npm install
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ package.json not found!${NC}"
    exit 1
fi

# Setup .env.local file if it doesn't exist
if [ ! -f ".env.local" ]; then
    if [ -f ".env.local.example" ]; then
        echo -e "${BLUE}📝 Creating .env.local file from .env.local.example...${NC}"
        cp .env.local.example .env.local
        echo -e "${GREEN}✅ .env.local created (using default API URL: http://localhost:8000)${NC}"
    else
        echo -e "${YELLOW}⚠️  .env.local.example not found${NC}"
        echo -e "${YELLOW}💡 Frontend will use default API URL: http://localhost:8000${NC}"
    fi
else
    echo -e "${GREEN}✅ .env.local file already exists${NC}"
fi

echo ""

# ============================================
# Make scripts executable
# ============================================
echo -e "${BLUE}📝 Making scripts executable...${NC}"
chmod +x "$SCRIPT_DIR/start.sh" 2>/dev/null || true
chmod +x "$SCRIPT_DIR/start-backend.sh" 2>/dev/null || true
chmod +x "$SCRIPT_DIR/start-frontend.sh" 2>/dev/null || true
chmod +x "$SCRIPT_DIR/stop.sh" 2>/dev/null || true
echo -e "${GREEN}✅ Scripts are executable${NC}"
echo ""

# ============================================
# Summary
# ============================================
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo ""
echo -e "${YELLOW}1. Configure Supabase:${NC}"
echo "   - Create a project at https://supabase.com"
echo "   - Run the SQL from database/schema.sql in Supabase SQL Editor"
echo "   - If you have an existing database, run database/migration_add_subtasks.sql"
echo "   - Get your Supabase URL and API key"
echo ""
echo -e "${YELLOW}2. Configure Backend:${NC}"
echo "   - Edit backend/.env and add your Supabase credentials:"
echo "     SUPABASE_URL=your_project_url"
echo "     SUPABASE_KEY=your_anon_key"
echo ""
echo -e "${YELLOW}3. Start the application:${NC}"
echo "   - Run: ${GREEN}./start.sh${NC} to start both servers"
echo "   - Or run separately:"
echo "     ${GREEN}./start-backend.sh${NC}  (Backend only)"
echo "     ${GREEN}./start-frontend.sh${NC} (Frontend only)"
echo ""
echo -e "${BLUE}🌐 Once running:${NC}"
echo "   - Backend API: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/docs"
echo "   - Frontend: http://localhost:3000"
echo ""
echo -e "${YELLOW}💡 Troubleshooting:${NC}"
echo "   - See QUICK_FIX.md for common issues"
echo "   - See TROUBLESHOOTING.md for detailed help"
echo ""
