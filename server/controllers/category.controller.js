const Category = require('../models/category.model');
const Product = require('../models/product.model');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort('name');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get featured categories
exports.getFeaturedCategories = async (req, res) => {
  try {
    const categories = await Category.find({ featured: true }).sort('name');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    // Check if category already exists
    const existingCategory = await Category.findOne({ name: req.body.name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    
    // Create new category
    const category = new Category(req.body);
    const newCategory = await category.save();
    
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    // Check if category exists
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if name is being changed and already exists
    if (req.body.name && req.body.name !== category.name) {
      const existingCategory = await Category.findOne({ name: req.body.name });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category with this name already exists' });
      }
    }
    
    // Update category
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    // Check if category exists
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if category is used in any products
    const productsWithCategory = await Product.countDocuments({ category: req.params.id });
    if (productsWithCategory > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category that is used by ${productsWithCategory} product(s). Reassign or delete these products first.`
      });
    }
    
    // Delete category
    await category.deleteOne();
    
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle featured status
exports.toggleFeatured = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Toggle featured status
    category.featured = !category.featured;
    await category.save();
    
    res.json({
      message: `Category ${category.featured ? 'marked as featured' : 'removed from featured'}`,
      category
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};