const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'server', '.env') });

// Import Category model
const Category = require('./server/models/category.model');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pischetola_db';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Create a single category
      const category = new Category({
        name: 'Furniture',
        description: 'Exquisite antique furniture pieces from various periods',
        featured: true,
        image: 'https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      });
      
      await category.save();
      console.log('Category created successfully!');
      
      // Close connection
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
      process.exit(0);
    } catch (error) {
      console.error('Error creating category:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 