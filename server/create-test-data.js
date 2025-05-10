/**
 * Script to create test data for the Pischetola Antiques application
 * Run with: node create-test-data.js
 */

const mongoose = require('mongoose');
const Category = require('./models/category.model');
const Period = require('./models/period.model');
require('dotenv').config();

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pischetola');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Create test categories
const createCategories = async () => {
  try {
    // Delete existing categories
    await Category.deleteMany({});
    
    const categories = [
      {
        name: 'Furniture',
        description: 'Antique furniture pieces',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        featured: true
      },
      {
        name: 'Paintings',
        description: 'Fine art and paintings',
        image: 'https://images.unsplash.com/photo-1578926288207-32356a2b4241?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        featured: true
      },
      {
        name: 'Silver',
        description: 'Antique silver items',
        image: 'https://images.unsplash.com/photo-1618333258404-f509733839c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        featured: false
      },
      {
        name: 'Ceramics',
        description: 'Porcelain and ceramic pieces',
        image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        featured: false
      }
    ];
    
    const result = await Category.insertMany(categories);
    console.log(`${result.length} categories created`);
    return result;
  } catch (error) {
    console.error('Error creating categories:', error);
    throw error;
  }
};

// Create test periods
const createPeriods = async () => {
  try {
    // Delete existing periods
    await Period.deleteMany({});
    
    const periods = [
      {
        name: 'Renaissance',
        description: 'The Renaissance period from 14th to 17th century',
        yearStart: 1400,
        yearEnd: 1700,
        featured: true
      },
      {
        name: 'Baroque',
        description: 'The Baroque period from late 16th to early 18th century',
        yearStart: 1580,
        yearEnd: 1750,
        featured: true
      },
      {
        name: 'Rococo',
        description: 'The Rococo period from early to late 18th century',
        yearStart: 1700,
        yearEnd: 1790,
        featured: false
      },
      {
        name: 'Neoclassical',
        description: 'The Neoclassical period from late 18th to mid 19th century',
        yearStart: 1760,
        yearEnd: 1850,
        featured: false
      },
      {
        name: 'Art Nouveau',
        description: 'The Art Nouveau period from 1890 to 1910',
        yearStart: 1890,
        yearEnd: 1910,
        featured: true
      }
    ];
    
    const result = await Period.insertMany(periods);
    console.log(`${result.length} periods created`);
    return result;
  } catch (error) {
    console.error('Error creating periods:', error);
    throw error;
  }
};

// Main function to run the script
const seedData = async () => {
  const conn = await connectDB();
  
  try {
    const categories = await createCategories();
    const periods = await createPeriods();
    
    console.log('Test data created successfully!');
    console.log('Categories:', categories.map(c => ({ _id: c._id, name: c.name })));
    console.log('Periods:', periods.map(p => ({ _id: p._id, name: p.name })));
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the script
seedData(); 