const mongoose = require('mongoose');
const User = require('./models/user.model');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pischetola_db';

// Admin user data
const adminUser = {
  username: 'admin',
  email: 'admin@pischetola.com',
  password: 'admin123', // This will be hashed by the pre-save hook
  role: 'admin',
  isActive: true
};

// Connect to MongoDB and create admin user
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Check if admin user already exists
      const existingUser = await User.findOne({ email: adminUser.email });
      
      if (existingUser) {
        console.log('Admin user already exists');
      } else {
        // Create new admin user
        const user = new User(adminUser);
        await user.save();
        console.log('Admin user created successfully');
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
    } finally {
      // Disconnect from MongoDB
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 