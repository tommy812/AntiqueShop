const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id', productController.getProductById);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/period/:periodId', productController.getProductsByPeriod);

// Protected routes - require admin authentication
router.post('/', verifyToken, isAdmin, upload.array('images', 10), productController.createProduct);
router.put(
  '/:id',
  verifyToken,
  isAdmin,
  upload.array('images', 10),
  productController.updateProduct
);
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);
router.patch('/:id/status', verifyToken, isAdmin, productController.updateProductStatus);

module.exports = router;
