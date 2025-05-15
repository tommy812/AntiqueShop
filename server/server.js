const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const periodRoutes = require('./routes/period.routes');
const userRoutes = require('./routes/user.routes');
const themeRoutes = require('./routes/theme.routes');
const messageRoutes = require('./routes/message.routes');
const uploadRoutes = require('./routes/upload.routes');
const settingsRoutes = require('./routes/settings.routes');

// Create Express app
const app = express();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? [process.env.CLIENT_URL || 'https://pischetola.vercel.app', /\.vercel\.app$/]
        : 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files directory for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pischetola_db';
  console.log('Attempting to connect to MongoDB at:', MONGODB_URI);

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.error(
      'Please ensure MongoDB is installed and running locally or provide a valid MongoDB Atlas connection string in the .env file.'
    );
    console.error(
      'The application will continue to run, but database functionality will not work.'
    );
  }
};

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/periods', periodRoutes);
app.use('/api/users', userRoutes);
app.use('/api/theme', themeRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);

// API status check route
app.get('/api', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date().toISOString() });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  const clientBuildPath = path.resolve(__dirname, '../client/build');
  app.use(express.static(clientBuildPath));

  // All routes not handled by API should return the React app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientBuildPath, 'index.html'));
  });
} else {
  // Root route for development
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Pischetola Antiques API' });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'An unexpected error occurred on the server',
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
});

// Connect to MongoDB if not in serverless environment
if (process.env.NODE_ENV !== 'vercel-serverless') {
  connectDB();

  // Start server
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// For Vercel serverless function
const handler = async (req, res) => {
  // Connect to MongoDB if in serverless mode
  if (process.env.NODE_ENV === 'vercel-serverless' && !mongoose.connection.readyState) {
    await connectDB();
  }

  // Let express handle the request
  return app(req, res);
};

// Export the Express API for traditional Node.js environments
module.exports = process.env.NODE_ENV === 'vercel-serverless' ? handler : app;
