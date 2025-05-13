const express = require('express');
const router = express.Router();
const { authJwt } = require('../middleware');
const estimateController = require('../controllers/estimate.controller');

// Public routes
router.post('/', estimateController.createEstimate);

// Admin-only routes (protected)
router.get('/', [authJwt.verifyToken, authJwt.isAdmin], estimateController.getAllEstimates);
router.get('/stats', [authJwt.verifyToken, authJwt.isAdmin], estimateController.getEstimateStats);
router.get('/:id', [authJwt.verifyToken, authJwt.isAdmin], estimateController.getEstimateById);
router.post('/:id/reply', [authJwt.verifyToken, authJwt.isAdmin], estimateController.replyToEstimate);
router.patch('/:id/status', [authJwt.verifyToken, authJwt.isAdmin], estimateController.updateEstimateStatus);
router.patch('/:id/toggle-read', [authJwt.verifyToken, authJwt.isAdmin], estimateController.toggleReadStatus);
router.patch('/:id/notes', [authJwt.verifyToken, authJwt.isAdmin], estimateController.addAdminNotes);
router.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], estimateController.deleteEstimate);

module.exports = router; 