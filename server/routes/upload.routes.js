const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const upload = require('../middleware/upload.middleware');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Determine if we're in a serverless environment (like Vercel)
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION;

// Upload a single image (admin only)
router.post('/', verifyToken, isAdmin, upload.single('image'), uploadController.uploadSingleImage);

// Upload multiple images (admin only)
router.post(
  '/multiple',
  verifyToken,
  isAdmin,
  upload.array('images', 10),
  uploadController.uploadMultipleImages
);

// Delete a file (admin only)
router.delete('/:filename', verifyToken, isAdmin, uploadController.deleteFile);

// Add route to serve files from memory in serverless environments
if (isServerless) {
  router.get('/file/:fileId', uploadController.serveFile);
}

module.exports = router;
