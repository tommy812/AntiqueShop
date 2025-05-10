const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.post('/', messageController.createMessage);

// Protected routes - require admin authentication
router.get('/', authenticateToken, isAdmin, messageController.getAllMessages);
router.get('/stats', authenticateToken, isAdmin, messageController.getMessageStats);
router.get('/:id', authenticateToken, isAdmin, messageController.getMessageById);
router.patch('/:id/status', authenticateToken, isAdmin, messageController.updateMessageStatus);
router.patch('/:id/toggle-read', authenticateToken, isAdmin, messageController.toggleReadStatus);
router.delete('/:id', authenticateToken, isAdmin, messageController.deleteMessage);

module.exports = router; 