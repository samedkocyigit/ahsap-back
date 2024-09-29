const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Create Product Route
router.post('/createProduct', productController.uploadProductImages,productController.resizeProductImages, productController.createProduct);

module.exports = router;
