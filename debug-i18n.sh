#!/bin/bash
# Script to run the client with i18n debugging enabled

# Set environment variables
export NODE_ENV=development
export DEBUG=i18next*

echo "Starting client with i18n debugging enabled..."
cd client && npm run dev 