// Direct import of required modules to avoid module resolution issues
const express = require('express');
const cors = require('cors');
const path = require('path');

// Create a simple Express app for debugging
const app = express();

// Use CORS middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Pischetola Antiques API',
    status: 'online',
    timestamp: new Date().toISOString(),
  });
});

// Import the server module - this is the main server implementation
const serverHandler = require('./server/server.js');

// Use the server for all requests instead of just /api
// This ensures all the routes defined in server.js are accessible
app.all('*', (req, res) => {
  return serverHandler(req, res);
});

// Start server if not in Vercel
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
