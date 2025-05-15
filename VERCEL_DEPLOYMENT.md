# Vercel Deployment Guide for Pischetola Antiques

This document outlines the deployment process for both the server and client components of the Pischetola Antiques website on Vercel.

## Project Structure

The project consists of two main components:

- **Server**: Node.js/Express API backend
- **Client**: React/TypeScript frontend

## Deployment Configuration

### Server Deployment

The server is deployed as a serverless Node.js function on Vercel with the following configuration:

1. **vercel.json** (in server directory):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [{ "src": "/(.*)", "dest": "/server.js" }],
  "functions": {
    "server.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

2. **Root index.js**:
   - Acts as the main entry point for the Vercel deployment
   - Provides basic health check endpoints
   - Attempts to load and use the server module
   - Includes fallback error handling

### Client Deployment

The client is deployed as a static site with the following configuration:

1. **vercel.json** (in client directory):

```json
{
  "version": 2,
  "buildCommand": "npm run vercel-build",
  "outputDirectory": "build",
  "framework": "create-react-app",
  "env": {
    "DISABLE_ESLINT_PLUGIN": "true",
    "ESLINT_NO_DEV_ERRORS": "true",
    "TSC_COMPILE_ON_ERROR": "true",
    "CI": "false",
    "REACT_APP_API_URL": "https://pischetola-antiques.vercel.app"
  },
  "routes": [
    // Routes configuration for static assets and SPA routing
  ]
}
```

2. **build-client.js**:
   - Ensures all necessary files exist before building
   - Creates fallback files if needed
   - Sets environment variables to bypass build errors

## Deployment Process

### Manual Deployment

1. **Server Deployment**:

   ```bash
   cd server
   vercel
   ```

2. **Client Deployment**:
   ```bash
   cd client
   vercel
   ```

### Automated Deployment

The repository is configured for continuous deployment:

1. Push to the `main` branch triggers deployment
2. Vercel automatically runs the build process defined in vercel.json
3. The build process executes:
   - For server: `npm run vercel-build`
   - For client: `node build-client.js`

## Environment Variables

Ensure the following environment variables are set in your Vercel project:

1. **Server**:

   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret for JWT token generation
   - `NODE_ENV`: Set to "production"

2. **Client**:
   - `REACT_APP_API_URL`: URL of the deployed server API

## Troubleshooting

### Common Issues

1. **Build Failures**:

   - Check build logs for specific errors
   - Ensure all dependencies are properly installed
   - Verify that all required files exist

2. **API Connection Issues**:

   - Verify the `REACT_APP_API_URL` is correctly set
   - Check CORS configuration in the server

3. **Missing Dependencies**:
   - Run `npm install` in both client and server directories
   - Check for version conflicts in package.json

### Debug Endpoints

- `/debug`: Returns environment information
- `/health`: Simple health check endpoint
- `/`: Root endpoint with basic API information

## Production URLs

- **Server API**: https://antique-shop.vercel.app
- **Client**: https://pischetola.vercel.app
