const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/featured', categoryController.getFeaturedCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected routes - require admin authentication
router.post('/', verifyToken, isAdmin, categoryController.createCategory);
router.put('/:id', verifyToken, isAdmin, categoryController.updateCategory);
router.delete('/:id', verifyToken, isAdmin, categoryController.deleteCategory);
router.patch('/:id/toggle-featured', verifyToken, isAdmin, categoryController.toggleFeatured);

module.exports = router;
