const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const upload = require('../middleware/upload.middleware');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Upload a single image (admin only)
router.post('/', verifyToken, isAdmin, upload.single('image'), uploadController.uploadSingleImage);

// Upload category image (admin only)
router.post(
  '/category',
  verifyToken,
  isAdmin,
  upload.single('image'),
  uploadController.uploadCategoryImage
);

// Upload multiple images (admin only, limit to 15 per upload)
router.post(
  '/multiple',
  verifyToken,
  isAdmin,
  upload.array('images', 15),
  uploadController.uploadMultipleImages
);

// Delete a file (admin only)
router.delete('/:filename', verifyToken, isAdmin, uploadController.deleteFile);

// List images for a product
router.get('/product/:productId', uploadController.listProductImages);

module.exports = router;
