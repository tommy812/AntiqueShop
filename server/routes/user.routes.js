const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes - require authentication
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);
router.put('/change-password', authenticateToken, userController.changePassword);

// Admin-only routes
router.get('/', authenticateToken, isAdmin, userController.getAllUsers);
router.delete('/:id', authenticateToken, isAdmin, userController.deleteUser);

module.exports = router; 