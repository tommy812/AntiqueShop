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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files directory for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://pischetola:pischetola123@cluster0.mongodb.net/pischetola_db?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/periods', periodRoutes);
app.use('/api/users', userRoutes);
app.use('/api/theme', themeRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Pischetola Antiques API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'An unexpected error occurred on the server',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});