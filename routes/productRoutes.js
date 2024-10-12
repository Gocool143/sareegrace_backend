const express = require('express');
const { getAllProducts, getProductById, getNewArrivals, getBestSelling, getRelatedProducts ,deleteProduct,searchProducts} = require('../controllers/productController');
const router = express.Router();

const { createOrUpdateProduct } = require('../controllers/productController');
const { upload } = require('../utils/cloudinary');

// Create or Update Product
router.post('/', upload.array('images', 10), createOrUpdateProduct);
router.put('/:id', upload.array('images', 10), createOrUpdateProduct);

// All Products
router.get('/', getAllProducts);

// Single Product by ID
router.get('/:id', getProductById);

// New Arrivals
router.get('/new-arrivals', getNewArrivals);

// Best Selling Products
router.get('/best-selling', getBestSelling);

// Related Products
// router.get('/related/:categoryId', getRelatedProducts);

router.delete('/:id', deleteProduct);
router.get('/related/:id',getRelatedProducts )
router.get('/product/search',searchProducts)
module.exports = router;
