const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.post('/', messageController.createMessage);

// Protected routes - require admin authentication
router.get('/', verifyToken, isAdmin, messageController.getAllMessages);
router.get('/stats', verifyToken, isAdmin, messageController.getMessageStats);
router.get('/:id', verifyToken, isAdmin, messageController.getMessageById);
router.post('/:id/reply', verifyToken, isAdmin, messageController.replyToMessage);
router.patch('/:id/status', verifyToken, isAdmin, messageController.updateMessageStatus);
router.patch('/:id/toggle-read', verifyToken, isAdmin, messageController.toggleReadStatus);
router.delete('/:id', verifyToken, isAdmin, messageController.deleteMessage);

module.exports = router;
