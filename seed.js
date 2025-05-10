const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'server', '.env') });

// Import models
const Category = require('./server/models/category.model');
const Period = require('./server/models/period.model');
const Product = require('./server/models/product.model');
const User = require('./server/models/user.model');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pischetola_db';

// Connect to MongoDB with higher timeout
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000, // 45 seconds
})
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Seed data
const seedData = async () => {
  try {
    // Clear existing data
    await Category.deleteMany({});
    await Period.deleteMany({});
    await Product.deleteMany({});
    
    console.log('Cleared existing data');

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
      },
      {
        name: 'Jewelry',
        description: 'Antique jewelry with historical significance and beauty',
        featured: false,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'Ceramics',
        description: 'Fine porcelain and ceramic works from around the world',
        featured: false,
        image: 'https://images.unsplash.com/photo-1565193298357-c5b51e39da82?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
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
      },
      {
        name: 'Art Deco',
        description: 'A style of visual arts, architecture and design that first appeared in France just before World War I',
        yearStart: 1910,
        yearEnd: 1939,
        featured: false,
        image: 'https://images.unsplash.com/photo-1561751139-77e0b0e4a79c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'Mid-Century Modern',
        description: 'A design movement in interior, product, graphic design, architecture, and urban development',
        yearStart: 1945,
        yearEnd: 1975,
        featured: false,
        image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      }
    ]);
    
    console.log(`Created ${periods.length} periods`);

    // Create sample products
    const products = await Product.insertMany([
      {
        name: 'Antique Victorian Mahogany Dining Table',
        description: 'Beautiful Victorian era mahogany dining table with intricate carvings and original finish.',
        price: 3500,
        images: ['https://images.unsplash.com/photo-1581428982868-e410dd047a90?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
        category: categories[0]._id, // Furniture
        period: periods[2]._id, // Victorian
        dimensions: {
          width: 180,
          height: 75,
          depth: 90,
          unit: 'cm'
        },
        condition: 'Good - minor wear consistent with age',
        provenance: 'Private collection, London',
        featured: true,
        status: 'available'
      },
      {
        name: 'Renaissance Oil Painting - Landscape',
        description: 'Stunning landscape oil painting from the late Renaissance period, depicting a pastoral scene.',
        price: 12000,
        images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
        category: categories[1]._id, // Paintings
        period: periods[0]._id, // Renaissance
        dimensions: {
          width: 90,
          height: 70,
          depth: 5,
          unit: 'cm'
        },
        condition: 'Excellent - recently restored',
        provenance: 'Private collection, Florence',
        featured: true,
        status: 'available'
      },
      {
        name: 'Baroque Silver Candelabra',
        description: 'Exquisite silver candelabra with intricate Baroque styling and detailing.',
        price: 2800,
        images: ['https://images.unsplash.com/photo-1544127932-56d5f92c0b19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
        category: categories[2]._id, // Decorative Arts
        period: periods[1]._id, // Baroque
        dimensions: {
          width: 30,
          height: 45,
          depth: 30,
          unit: 'cm'
        },
        condition: 'Very good - minor tarnishing',
        provenance: 'Estate sale, Vienna',
        featured: true,
        status: 'available'
      },
      {
        name: 'Art Deco Diamond and Sapphire Ring',
        description: 'Stunning Art Deco ring featuring diamonds and sapphires in platinum setting.',
        price: 5600,
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
        category: categories[3]._id, // Jewelry
        period: periods[3]._id, // Art Deco
        condition: 'Excellent',
        provenance: 'Private collection, New York',
        featured: false,
        status: 'available'
      },
      {
        name: 'Mid-Century Modern Ceramic Vase',
        description: 'Iconic mid-century modern ceramic vase with distinctive glaze and form.',
        price: 950,
        images: ['https://images.unsplash.com/photo-1584589167171-541ce45f1eea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
        category: categories[4]._id, // Ceramics
        period: periods[4]._id, // Mid-Century Modern
        dimensions: {
          width: 20,
          height: 35,
          depth: 20,
          unit: 'cm'
        },
        condition: 'Excellent - no chips or cracks',
        provenance: 'Estate sale, Copenhagen',
        featured: false,
        status: 'available'
      }
    ]);
    
    console.log(`Created ${products.length} products`);

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await User.findOneAndUpdate(
      { email: 'admin@pischetola.com' },
      {
        username: 'admin',
        email: 'admin@pischetola.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true
      },
      { upsert: true, new: true }
    );
    
    console.log('Created admin user');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData(); 