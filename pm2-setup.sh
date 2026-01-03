#!/bin/bash

# PM2 Setup Script for Thai Lottery API

echo "🚀 Setting up PM2 for Thai Lottery API"
echo "======================================"

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 is not installed. Installing PM2..."
    npm install -g pm2
    echo "✅ PM2 installed successfully"
else
    echo "✅ PM2 is already installed"
fi

# Create logs directory
mkdir -p logs
echo "✅ Logs directory created"

# Stop any existing process
echo "🛑 Stopping existing processes..."
pm2 delete thai-lottery-api 2>/dev/null || true

# Start the application with PM2
echo "▶️  Starting application with PM2..."
pm2 start ecosystem.config.js

# Save PM2 process list
echo "💾 Saving PM2 process list..."
pm2 save

# Setup PM2 to start on system boot
echo "🔧 Setting up PM2 startup script..."
pm2 startup

echo ""
echo "======================================"
echo "✅ PM2 Setup Complete!"
echo ""
echo "📋 Useful PM2 Commands:"
echo "  pm2 status              - Check application status"
echo "  pm2 logs                - View logs"
echo "  pm2 restart thai-lottery-api - Restart application"
echo "  pm2 stop thai-lottery-api    - Stop application"
echo "  pm2 delete thai-lottery-api  - Remove from PM2"
echo "  pm2 monit               - Monitor in real-time"
echo ""
echo "🌐 Your API should now be running at: http://localhost:3000"
echo ""
