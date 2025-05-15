const express = require('express');
const router = express.Router();
const themeController = require('../controllers/theme-settings.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', themeController.getThemeSettings);

// Protected routes - require admin authentication
router.put('/', verifyToken, isAdmin, themeController.updateThemeSettings);

module.exports = router;
