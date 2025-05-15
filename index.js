// Direct import of required modules to avoid module resolution issues
const express = require('express');
const cors = require('cors');

// Create a simple Express app for debugging
const app = express();

// Use CORS middleware
app.use(cors());

// Add a debug endpoint
app.get('/debug', (req, res) => {
  res.json({
    status: 'Debug endpoint working',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'not set',
    vercelEnv: process.env.VERCEL_ENV || 'not set',
    nodeVersion: process.version,
  });
});

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

// Try to load the full server
try {
  // Import the server handler
  const serverModule = require('./server/server.js');

  // Forward API requests to the server module
  app.use('/api', (req, res, next) => {
    try {
      return serverModule(req, res);
    } catch (error) {
      console.error('Error in API handler:', error);
      res.status(500).json({
        error: 'API Error',
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  });
} catch (error) {
  console.error('Error loading server module:', error);

  // Add a fallback API endpoint
  app.use('/api', (req, res) => {
    res.status(503).json({
      error: 'API Unavailable',
      message: 'The API is currently unavailable. Please try again later.',
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    error: 'Server Error',
    message: err.message || 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
  });
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
