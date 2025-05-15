# Vercel Deployment Guide

This document provides instructions for deploying the Pischetola Antiques application on Vercel.

## Prerequisites

- A [Vercel](https://vercel.com/) account
- MongoDB Atlas cluster (for production database)

## Deployment Steps

### 1. Configure Environment Variables in Vercel

Set the following environment variables in your Vercel project settings:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
JWT_SECRET=your_secret_key_here
CLIENT_URL=https://your-vercel-app-url.vercel.app
```

Replace the placeholders with your actual MongoDB connection string and other values.

### 2. Deploy to Vercel

You can deploy in two ways:

#### Option 1: Deploy through GitHub Integration

1. Connect your GitHub repository to Vercel
2. Configure the project as follows:
   - **Build Command**: `cd client && npm install --legacy-peer-deps && npm run build`
   - **Output Directory**: `client/build`
   - **Install Command**: `npm install`

#### Option 2: Deploy using Vercel CLI

1. Install Vercel CLI: `npm i -g vercel`
2. Run from the project root: `vercel`
3. Follow the CLI prompts

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Make sure your `vercel.json` is correctly configured:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "cd client && npm install --legacy-peer-deps && npm run build",
        "outputDirectory": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/build/$1"
    }
  ]
}
```

2. Check your deployment logs in the Vercel dashboard

### API Connection Issues

If your frontend can't connect to the API:

1. Verify the API endpoint URLs in your client code
2. Check CORS settings in `server/server.js` to ensure your client domain is allowed
3. Make sure environment variables are correctly set

## Production Considerations

- **MongoDB Connection**: Ensure your MongoDB connection string is properly set up with the correct credentials and database name
- **JWT Secret**: Use a strong, unique JWT secret for production
- **Static Files**: Uploaded files will not persist in Vercel's serverless functions. Consider using a cloud storage solution like AWS S3 for file uploads
