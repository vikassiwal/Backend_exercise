const express = require('express');
const upload = require('../middleware/upload');
const productController = require('../controllers/productController');

const router = express.Router();

router.post('/upload', upload.single('file'), productController.uploadProducts);
router.get('/products', productController.getProducts);
router.get('/products/search', productController.searchProducts);

module.exports = router;
