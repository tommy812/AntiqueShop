const express = require('express');
const router = express.Router();
const periodController = require('../controllers/period.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', periodController.getAllPeriods);
router.get('/featured', periodController.getFeaturedPeriods);
router.get('/:id', periodController.getPeriodById);

// Protected routes - require admin authentication
router.post('/', verifyToken, isAdmin, periodController.createPeriod);
router.put('/:id', verifyToken, isAdmin, periodController.updatePeriod);
router.delete('/:id', verifyToken, isAdmin, periodController.deletePeriod);
router.patch('/:id/toggle-featured', verifyToken, isAdmin, periodController.toggleFeatured);

module.exports = router;
