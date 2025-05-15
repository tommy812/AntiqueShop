#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting client deployment to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "Installing Vercel CLI..."
  npm install -g vercel
fi

# Login check (this will skip if already logged in)
echo "Checking Vercel login..."
vercel whoami &> /dev/null || vercel login

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!" 