const Category = require('../models/Category'); // Assuming you have created a Category model
const cloudinary = require('cloudinary').v2; // Assuming you're using Cloudinary for image uploads
// Create a new category (with image upload)
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name,
      description,
      image: req.file ? req.file.path : null, // Use Cloudinary file path if image is uploaded
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category', error });
  }
};

// Update a category (with image upload)
const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.name = name || category.name;
    category.description = description || category.description;
    if (req.file) {
      category.image = req.file.path; // Update image if a new one is uploaded
    }

    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update category', error });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    console.log('inside=>');
    
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve categories', error });
  }
};

// Get a category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve category', error });
  }
};



// Delete a category (Admin only)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.remove();
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category', error });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
