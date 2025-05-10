const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller.js');

router.get('/', productController.getAllProducts);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.post('/', productController.createProduct);

module.exports = router;