# Vercel Deployment Guide for Pischetola Antiques

This guide provides step-by-step instructions for deploying the Pischetola Antiques application on Vercel.

## Project Structure

The project consists of two separate deployments:

- **Server API**: Deployed at https://antique-shop.vercel.app
- **Client**: Deployed at https://pischetola.vercel.app

## Deployment Steps

### 1. Server Deployment

The server is already deployed at https://antique-shop.vercel.app. If you need to redeploy it:

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Deploy with Vercel CLI:
   ```bash
   vercel --prod
   ```

### 2. Client Deployment

To deploy the client application:

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Deploy with Vercel CLI:

   ```bash
   vercel --prod
   ```

3. If you're deploying through the Vercel dashboard, use these settings:
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install --legacy-peer-deps`

## Environment Variables

### Server Environment Variables

Set these in your Vercel server project settings:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
JWT_SECRET=your_secret_key_here
```

### Client Environment Variables

These are already configured in the client's vercel.json:

```
DISABLE_ESLINT_PLUGIN=true
ESLINT_NO_DEV_ERRORS=true
TSC_COMPILE_ON_ERROR=true
CI=false
REACT_APP_API_URL=https://antique-shop.vercel.app
```

## Troubleshooting

### Client-Side Routing Issues

If you encounter 404 errors with client-side routing:

1. Verify the client's vercel.json has the correct routes configuration:

   ```json
   "routes": [
     { "handle": "filesystem" },
     { "src": "/.*", "dest": "/index.html" }
   ]
   ```

2. Make sure your React Router is properly configured in App.tsx.

### Build Failures

If the client build fails:

1. Check the build logs for specific errors
2. Try building locally first: `cd client && npm run build`
3. Make sure all required files exist in the src directory

### API Connection Issues

If the client can't connect to the API:

1. Verify the REACT_APP_API_URL is correctly set to https://antique-shop.vercel.app
2. Check that CORS is properly configured on the server
3. Test the API endpoint directly: https://antique-shop.vercel.app/health

## Using the Automated Deployment Script

For convenience, you can use the deploy-vercel.sh script from the root directory:

```bash
chmod +x deploy-vercel.sh
./deploy-vercel.sh
```

This script will:

1. Deploy the server
2. Update the client configuration with the server URL
3. Deploy the client

## Important Notes

1. **Monorepo Structure**: This project uses a monorepo structure but deploys the client and server separately.
2. **API URL**: The client is configured to use https://antique-shop.vercel.app as the API URL.
3. **SPA Routing**: The client uses React Router for client-side routing, which requires special configuration in vercel.json.
