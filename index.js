// This file is a wrapper for the server.js module
try {
  // Import the server handler
  const serverHandler = require('./server/server.js');

  // Export the handler for Vercel serverless functions
  module.exports = async (req, res) => {
    // Simple debug endpoint that doesn't require Express
    if (req.url === '/debug') {
      return res.json({
        status: 'Debug endpoint working',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'not set',
        vercelEnv: process.env.VERCEL_ENV || 'not set',
        nodeVersion: process.version,
      });
    }

    try {
      return await serverHandler(req, res);
    } catch (error) {
      console.error('Error in serverless handler:', error);
      res.status(500).json({
        error: 'Server error',
        message: 'An unexpected error occurred in the serverless function',
        timestamp: new Date().toISOString(),
      });
    }
  };
} catch (error) {
  console.error('Fatal error loading server module:', error);

  // Export a fallback handler that returns an error
  module.exports = (req, res) => {
    // Return detailed error information to help debugging
    res.status(500).json({
      error: 'Server initialization error',
      message: 'The server failed to initialize properly',
      errorMessage: error.message,
      errorStack: error.stack,
      timestamp: new Date().toISOString(),
    });
  };
}
