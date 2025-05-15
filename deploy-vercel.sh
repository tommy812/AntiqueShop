#!/bin/bash

# Pischetola Antiques - Vercel Deployment Script
# This script automates the deployment process to Vercel

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
  echo -e "${2}${1}${NC}"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  print_message "Vercel CLI not found. Installing..." "$YELLOW"
  npm install -g vercel
fi

# Verify we're in the root directory
if [ ! -d "./client" ] || [ ! -d "./server" ]; then
  print_message "Error: Please run this script from the project root directory." "$RED"
  exit 1
fi

print_message "🚀 Starting Pischetola Antiques Vercel Deployment" "$BLUE"

# Deploy server
print_message "\n📡 Deploying server..." "$BLUE"
cd server
print_message "Running server deployment..." "$YELLOW"
vercel --prod
SERVER_URL="https://antique-shop.vercel.app"
cd ..

print_message "✅ Server deployed successfully to: $SERVER_URL" "$GREEN"

# Ensure client configuration has correct API URL
print_message "\n🔄 Verifying client configuration..." "$BLUE"
if ! grep -q "\"REACT_APP_API_URL\": \"$SERVER_URL\"" client/vercel.json; then
  print_message "Updating client API URL configuration..." "$YELLOW"
  sed -i.bak "s|\"REACT_APP_API_URL\": \".*\"|\"REACT_APP_API_URL\": \"$SERVER_URL\"|g" client/vercel.json
  print_message "✅ Client configuration updated" "$GREEN"
else
  print_message "✅ Client configuration already correct" "$GREEN"
fi

# Deploy client
print_message "\n🖥️ Deploying client..." "$BLUE"
cd client
print_message "Running client deployment..." "$YELLOW"
vercel --prod
CLIENT_URL="https://pischetola.vercel.app"
cd ..

print_message "✅ Client deployed successfully to: $CLIENT_URL" "$GREEN"

# Summary
print_message "\n✨ Deployment Complete! ✨" "$GREEN"
print_message "Server URL: $SERVER_URL" "$BLUE"
print_message "Client URL: $CLIENT_URL" "$BLUE"
print_message "\nPlease verify that both deployments are working correctly." "$YELLOW"

exit 0 