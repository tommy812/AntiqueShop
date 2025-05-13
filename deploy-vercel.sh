#!/bin/bash

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
  echo -e "${2}${1}${NC}"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  print_message "Vercel CLI is not installed. Installing..." "$YELLOW"
  npm install -g vercel
fi

# Check if user is logged in to Vercel
vercel whoami &> /dev/null
if [ $? -ne 0 ]; then
  print_message "Please log in to Vercel:" "$BLUE"
  vercel login
fi

# Commit any pending changes
print_message "Checking for pending changes..." "$BLUE"
if [[ -n $(git status -s) ]]; then
  print_message "You have uncommitted changes. Do you want to commit them? (y/n)" "$YELLOW"
  read -r response
  if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    print_message "Enter commit message:" "$BLUE"
    read -r commit_message
    git add .
    git commit -m "$commit_message"
  else
    print_message "Continuing without committing changes..." "$YELLOW"
  fi
fi

# Push to GitHub
print_message "Pushing to GitHub..." "$BLUE"
git push origin $(git branch --show-current)

# Deploy to Vercel
print_message "Deploying to Vercel..." "$BLUE"
vercel

print_message "Deployment process completed!" "$GREEN"
print_message "If this was your first deployment, you may need to set up environment variables in the Vercel dashboard." "$YELLOW"
print_message "Don't forget to set up MongoDB connection string in Vercel environment variables." "$YELLOW" 