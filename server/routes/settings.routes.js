const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Public route - Get site settings
router.get('/', settingsController.getSettings);

// Protected routes - Admin only
router.put('/', verifyToken, isAdmin, settingsController.updateSettings);
router.post('/reset', verifyToken, isAdmin, settingsController.resetSettings);

module.exports = router;
