const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Verify JWT token
exports.verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Add user ID to request
    req.userId = decoded.id;
    
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Check if user is admin
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required' });
    }
    
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}; 