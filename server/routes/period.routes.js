const express = require('express');
const router = express.Router();
const periodController = require('../controllers/period.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', periodController.getAllPeriods);
router.get('/featured', periodController.getFeaturedPeriods);
router.get('/:id', periodController.getPeriodById);

// Protected routes - require admin authentication
router.post('/', authenticateToken, isAdmin, periodController.createPeriod);
router.put('/:id', authenticateToken, isAdmin, periodController.updatePeriod);
router.delete('/:id', authenticateToken, isAdmin, periodController.deletePeriod);
router.patch('/:id/toggle-featured', authenticateToken, isAdmin, periodController.toggleFeatured);

module.exports = router; 