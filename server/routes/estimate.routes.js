const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const estimateController = require('../controllers/estimate.controller');

// Public routes
router.post('/', estimateController.createEstimate);

// Admin-only routes (protected)
router.get('/', [verifyToken, isAdmin], estimateController.getAllEstimates);
router.get('/stats', [verifyToken, isAdmin], estimateController.getEstimateStats);
router.get('/:id', [verifyToken, isAdmin], estimateController.getEstimateById);
router.post('/:id/reply', [verifyToken, isAdmin], estimateController.replyToEstimate);
router.patch('/:id/status', [verifyToken, isAdmin], estimateController.updateEstimateStatus);
router.patch('/:id/toggle-read', [verifyToken, isAdmin], estimateController.toggleReadStatus);
router.patch('/:id/notes', [verifyToken, isAdmin], estimateController.addAdminNotes);
router.delete('/:id', [verifyToken, isAdmin], estimateController.deleteEstimate);

module.exports = router;
