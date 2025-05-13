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

# Function to check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

case "$1" in
  setup)
    print_message "Setting up development environment..." "$BLUE"
    npm install
    cd client && npm install && cd ..
    print_message "Setup complete!" "$GREEN"
    ;;
    
  start)
    print_message "Starting development servers..." "$BLUE"
    # Start backend and frontend concurrently
    if command_exists concurrently; then
      concurrently "npm run server" "cd client && npm start"
    else
      print_message "concurrently not found. Installing..." "$YELLOW"
      npm install -g concurrently
      concurrently "npm run server" "cd client && npm start"
    fi
    ;;
    
  build)
    print_message "Building project..." "$BLUE"
    cd client && npm run build && cd ..
    print_message "Build complete!" "$GREEN"
    ;;
    
  deploy)
    print_message "Deploying to production..." "$BLUE"
    git checkout main
    git merge fast-dev
    git push origin main
    print_message "Deployment complete!" "$GREEN"
    ;;
    
  deploy-vercel)
    print_message "Deploying to Vercel..." "$BLUE"
    ./deploy-vercel.sh
    ;;
    
  feature)
    if [ -z "$2" ]; then
      print_message "Please provide a feature name: ./dev.sh feature feature-name" "$RED"
      exit 1
    fi
    print_message "Creating new feature branch: $2..." "$BLUE"
    git checkout -b "feature/$2"
    print_message "Feature branch created!" "$GREEN"
    ;;
    
  save)
    if [ -z "$2" ]; then
      print_message "Please provide a commit message: ./dev.sh save \"your commit message\"" "$RED"
      exit 1
    fi
    print_message "Saving changes..." "$BLUE"
    git add .
    git commit -m "$2"
    print_message "Changes saved!" "$GREEN"
    ;;
    
  push)
    print_message "Pushing to remote..." "$BLUE"
    git push origin $(git branch --show-current)
    print_message "Push complete!" "$GREEN"
    ;;
    
  *)
    print_message "Pischetola Development Helper" "$BLUE"
    print_message "Usage: ./dev.sh [command]" "$YELLOW"
    print_message "Commands:" "$YELLOW"
    print_message "  setup   - Install all dependencies" "$GREEN"
    print_message "  start   - Start development servers" "$GREEN"
    print_message "  build   - Build the client app" "$GREEN"
    print_message "  deploy  - Deploy to production (GitHub)" "$GREEN"
    print_message "  deploy-vercel - Deploy to Vercel" "$GREEN"
    print_message "  feature [name] - Create a new feature branch" "$GREEN"
    print_message "  save [message] - Add and commit changes" "$GREEN"
    print_message "  push    - Push current branch to remote" "$GREEN"
    ;;
esac 