const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes - require authentication
router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);
router.put('/change-password', verifyToken, userController.changePassword);

// Admin-only routes
router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

module.exports = router;
