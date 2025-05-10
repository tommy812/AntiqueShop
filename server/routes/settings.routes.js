const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// Public route - Get site settings
router.get('/', settingsController.getSettings);

// Protected routes - Admin only
router.put('/', authenticateToken, isAdmin, settingsController.updateSettings);
router.post('/reset', authenticateToken, isAdmin, settingsController.resetSettings);

module.exports = router; 