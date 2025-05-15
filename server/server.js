const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files directory for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pischetola_db';
    console.log('Attempting to connect to MongoDB at:', MONGODB_URI);

    // Set mongoose options for better stability in serverless environment
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, options);
      console.log('Connected to MongoDB successfully');
    }
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.error(
      'Please ensure MongoDB is installed and running locally or provide a valid MongoDB Atlas connection string in the .env file.'
    );
    return false;
  }
};

// Simple health check route that doesn't require DB
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Pischetola Antiques API',
    status: 'online',
    timestamp: new Date().toISOString(),
    endpoints: {
      categories: '/api/categories',
      products: '/api/products',
      periods: '/api/periods',
      users: '/api/users',
      theme: '/api/theme',
      messages: '/api/messages',
      settings: '/api/settings',
    },
  });
});

// Wrap route handlers with DB connection check
const withDB = handler => {
  return async (req, res, next) => {
    try {
      const connected = await connectDB();
      if (!connected) {
        return res.status(500).json({
          error: 'Database connection failed',
          message: 'Could not connect to the database. Please try again later.',
        });
      }

      // If handler is an Express router, we need to call it differently
      if (typeof handler === 'function' && handler.name === 'router') {
        // Pass request to the router and let it handle the rest
        return handler(req, res, next);
      } else {
        // Otherwise, treat it as a regular middleware/handler function
        return handler(req, res, next);
      }
    } catch (error) {
      console.error('Error in route handler:', error);
      return res.status(500).json({
        error: 'Server error',
        message: 'An unexpected error occurred',
      });
    }
  };
};

// Try to safely import routes
let categoryRoutes,
  productRoutes,
  periodRoutes,
  userRoutes,
  themeRoutes,
  messageRoutes,
  uploadRoutes,
  settingsRoutes,
  estimateRoutes;

try {
  // Import routes - do this after DB connection setup
  categoryRoutes = require('./routes/category.routes.js');
  productRoutes = require('./routes/product.routes.js');
  periodRoutes = require('./routes/period.routes.js');
  userRoutes = require('./routes/user.routes.js');
  themeRoutes = require('./routes/theme.routes.js');
  messageRoutes = require('./routes/message.routes.js');
  uploadRoutes = require('./routes/upload.routes.js');
  settingsRoutes = require('./routes/settings.routes.js');
  estimateRoutes = require('./routes/estimate.routes.js');

  console.log('Routes imported successfully');
} catch (error) {
  console.error('Error importing routes:', error);
}

// Routes with DB connection check - only set up if routes were imported successfully
// Use a function to wrap each route call
const setupRoute = (path, router) => {
  if (router) {
    app.use(path, async (req, res, next) => {
      try {
        // Ensure DB connection before handling the request
        const connected = await connectDB();
        if (!connected) {
          return res.status(500).json({
            error: 'Database connection failed',
            message: 'Could not connect to the database. Please try again later.',
          });
        }

        // Continue to the router
        router(req, res, next);
      } catch (error) {
        console.error(`Error handling route ${path}:`, error);
        return res.status(500).json({
          error: 'Server error',
          message: 'An unexpected error occurred',
        });
      }
    });
  }
};

// Set up all routes
setupRoute('/api/categories', categoryRoutes);
setupRoute('/api/products', productRoutes);
setupRoute('/api/periods', periodRoutes);
setupRoute('/api/users', userRoutes);
setupRoute('/api/theme', themeRoutes);
setupRoute('/api/messages', messageRoutes);
setupRoute('/api/upload', uploadRoutes);
setupRoute('/api/settings', settingsRoutes);
setupRoute('/api/estimates', estimateRoutes);

// API status check route
app.get(
  '/api',
  withDB((req, res) => {
    res.json({ status: 'API is running', timestamp: new Date().toISOString() });
  })
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({
    message: err.message || 'An unexpected error occurred on the server',
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
});

// Connect to MongoDB if not in serverless environment
if (process.env.VERCEL_ENV !== 'production') {
  connectDB();

  // Start server
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// For Vercel serverless function
const handler = async (req, res) => {
  // Let express handle the request
  return app(req, res);
};

// Export the Express API for Vercel
module.exports = handler;
