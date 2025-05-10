const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/category.model');
const Period = require('./models/period.model');
const Product = require('./models/product.model');
const User = require('./models/user.model');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pischetola_db';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Seed data
const seedData = async () => {
  try {
    // Create categories
    const categories = await Category.insertMany([
      {
        name: 'Furniture',
        description: 'Exquisite antique furniture pieces from various periods',
        featured: true,
        image: 'https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'Paintings',
        description: 'Beautiful paintings and artwork from renowned artists',
        featured: true,
        image: 'https://images.unsplash.com/photo-1581404917879-53e19259fdda?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'Decorative Arts',
        description: 'Unique decorative pieces that add character to any space',
        featured: true,
        image: 'https://images.unsplash.com/photo-1592837634593-87f4e0673db6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      }
    ]);
    
    console.log(`Created ${categories.length} categories`);

    // Create periods
    const periods = await Period.insertMany([
      {
        name: 'Renaissance',
        description: 'The period of European history marking the transition from the Middle Ages to modernity',
        yearStart: 1400,
        yearEnd: 1600,
        featured: true,
        image: 'https://images.unsplash.com/photo-1566159266959-25827afc1c32?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'Baroque',
        description: 'A highly ornate and extravagant style of architecture, art and music',
        yearStart: 1600,
        yearEnd: 1750,
        featured: true,
        image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'Victorian',
        description: 'The period of Queen Victoria\'s reign, from 1837 until her death in 1901',
        yearStart: 1837,
        yearEnd: 1901,
        featured: true,
        image: 'https://images.unsplash.com/photo-1543489822-c49534f3271f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      }
    ]);
    
    console.log(`Created ${periods.length} periods`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData(); 