#!/bin/bash

# Script to fix CSS loading issues in Next.js
# Clears the build cache and restarts the dev server

echo "🔧 Fixing CSS loading issue..."

cd "$(dirname "$0")/frontend"

# Stop any running Next.js processes
echo "🛑 Stopping Next.js dev server..."
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Clear Next.js cache
echo "🧹 Clearing Next.js build cache..."
rm -rf .next
echo "✅ Cache cleared"

# Verify CSS file exists
if [ ! -f "app/globals.css" ]; then
    echo "❌ Error: app/globals.css not found!"
    exit 1
fi

echo "✅ CSS file exists"
echo ""
echo "🚀 Restarting dev server..."
echo "💡 Run this in a new terminal: cd frontend && npm run dev"
echo ""
echo "Or use: ./start-frontend.sh"

