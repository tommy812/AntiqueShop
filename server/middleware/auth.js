const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'pischetola_secret_key_change_in_production';

// Verify JWT token
exports.verifyToken = async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user info to request
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
}; 