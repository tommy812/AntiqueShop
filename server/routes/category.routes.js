const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/featured', categoryController.getFeaturedCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected routes - require admin authentication
router.post('/', authenticateToken, isAdmin, categoryController.createCategory);
router.put('/:id', authenticateToken, isAdmin, categoryController.updateCategory);
router.delete('/:id', authenticateToken, isAdmin, categoryController.deleteCategory);
router.patch('/:id/toggle-featured', authenticateToken, isAdmin, categoryController.toggleFeatured);

module.exports = router; 