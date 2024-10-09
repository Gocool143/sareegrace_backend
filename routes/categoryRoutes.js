const express = require('express');
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } 
= require('../controllers/categoryController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware'); // Middleware for authentication
const router = express.Router();
const { categoryUpload } = require('../utils/clouninary_cat');
// Create a new category (Admin only)
router.post('/',categoryUpload.single('image'), createCategory);

// Get all categories
router.get('/', getAllCategories);

// Get a category by ID
router.get('/:categoryId', getCategoryById);

// Update a category (Admin only)
router.put('/:categoryId', isAuthenticated, isAdmin, updateCategory);

// Delete a category (Admin only)
router.delete('/:categoryId', isAuthenticated, isAdmin, deleteCategory);

module.exports = router;
