#!/bin/bash

# Script to seed database using Python script
# This script runs the seed_data.py script with your Supabase credentials

set -e

echo "🌱 Task Manager - Database Seeding Script"
echo "=========================================="
echo ""

# Navigate to project root
SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$SCRIPT_DIR/backend"

# Check if virtual environment exists
if [ -d "venv" ]; then
    echo "📦 Activating virtual environment..."
    source venv/bin/activate
elif [ -d ".venv" ]; then
    echo "📦 Activating virtual environment..."
    source .venv/bin/activate
else
    echo "⚠️  No virtual environment found. Using system Python."
    echo "💡 Tip: Create a virtual environment with: python -m venv venv"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found!"
    echo "💡 The script will ask for your Supabase URL and Key"
    echo ""
fi

# Run the seeding script
echo "🚀 Starting database seeding..."
echo ""
python "$SCRIPT_DIR/scripts/seed_data.py"

