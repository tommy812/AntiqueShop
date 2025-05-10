const express = require('express');
const router = express.Router();
const themeController = require('../controllers/theme-settings.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', themeController.getThemeSettings);

// Protected routes - require admin authentication
router.put('/', authenticateToken, isAdmin, themeController.updateThemeSettings);

module.exports = router; 