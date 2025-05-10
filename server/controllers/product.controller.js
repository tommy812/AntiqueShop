const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Period = require('../models/period.model');

// Get all products with pagination
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || '-createdAt';
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    // Filter by category
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    // Filter by period
    if (req.query.period) {
      filter.period = req.query.period;
    }
    
    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseInt(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseInt(req.query.maxPrice);
    }
    
    // Search by name or description
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Filter by sold status
    if (req.query.sold !== undefined) {
      filter.sold = req.query.sold === 'true';
    }
    
    // Filter by featured status
    if (req.query.featured !== undefined) {
      filter.featured = req.query.featured === 'true';
    }
    
    // Count total matching documents
    const total = await Product.countDocuments(filter);
    
    // Get filtered products
    const products = await Product.find(filter)
      .populate('category')
      .populate('period')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    res.json({
      products,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        hasNext,
        hasPrev,
        limit
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('period');
      
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Verify category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Count total products in category
    const total = await Product.countDocuments({ category: categoryId });
    
    // Get products
    const products = await Product.find({ category: categoryId })
      .populate('category')
      .populate('period')
      .skip(skip)
      .limit(limit);
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    res.json({
      category,
      products,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        hasNext,
        hasPrev,
        limit
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get products by period
exports.getProductsByPeriod = async (req, res) => {
  try {
    const periodId = req.params.periodId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Verify period exists
    const period = await Period.findById(periodId);
    if (!period) {
      return res.status(404).json({ message: 'Period not found' });
    }
    
    // Count total products in period
    const total = await Product.countDocuments({ period: periodId });
    
    // Get products
    const products = await Product.find({ period: periodId })
      .populate('category')
      .populate('period')
      .skip(skip)
      .limit(limit);
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    res.json({
      period,
      products,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        hasNext,
        hasPrev,
        limit
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const products = await Product.find({ featured: true })
      .populate('category')
      .populate('period')
      .limit(limit);
    
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    console.log('Creating product with data:', req.body);
    console.log('Files received:', req.files);
    
    // Check if name, description and price are present
    if (!req.body.name) console.log('Name is missing in request');
    if (!req.body.description) console.log('Description is missing in request');
    if (!req.body.price) console.log('Price is missing in request');
    
    // Direct access to fields - less nested structure
    const productData = {};
    
    // Basic fields
    productData.name = req.body.name;
    productData.description = req.body.description;
    productData.price = req.body.price ? Number(req.body.price) : 0;
    productData.category = req.body.category;
    productData.period = req.body.period;
    productData.condition = req.body.condition;
    productData.origin = req.body.origin || '';
    
    // Important fields that need direct access
    productData.provenance = req.body.provenance || '';
    productData.history = req.body.history || '';
    productData.delivery = req.body.delivery || '';
    productData.featured = req.body.featured === 'true';
    
    // Process measures - using dot notation from form data
    productData.measures = {
      height: req.body['measures.height'] ? Number(req.body['measures.height']) : 0,
      width: req.body['measures.width'] ? Number(req.body['measures.width']) : 0,
      depth: req.body['measures.depth'] ? Number(req.body['measures.depth']) : 0,
      unit: req.body['measures.unit'] || 'cm'
    };
    
    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => `/uploads/${file.filename}`);
    }
    
    // Check if category exists
    console.log('Looking for category with ID:', req.body.category);
    
    // TEMPORARY FIX: Try to find any category if the provided one doesn't exist
    let categoryExists = await Category.findById(req.body.category);
    
    if (!categoryExists) {
      console.log('Category not found by ID, trying to find first available category');
      // Try to find any category as a fallback
      categoryExists = await Category.findOne();
      
      if (categoryExists) {
        console.log('Using fallback category:', categoryExists);
        productData.category = categoryExists._id;
      } else {
        return res.status(404).json({ message: 'Category not found and no fallback categories available' });
      }
    }
    
    // Check if period exists (if provided)
    if (req.body.period) {
      console.log('Looking for period with ID:', req.body.period);
      let periodExists = await Period.findById(req.body.period);
      
      if (!periodExists) {
        console.log('Period not found by ID, trying to find first available period');
        // Try to find any period as a fallback
        periodExists = await Period.findOne();
        
        if (periodExists) {
          console.log('Using fallback period:', periodExists);
          productData.period = periodExists._id;
        } else {
          return res.status(404).json({ message: 'Period not found and no fallback periods available' });
        }
      }
    }
    
    console.log('Final product data to save:', productData);
    
    // Create new product
    const product = new Product(productData);
    
    const newProduct = await product.save();
    await newProduct.populate('category');
    await newProduct.populate('period');
    
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(400).json({ message: err.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    console.log('Updating product with data:', req.body);
    console.log('Files received:', req.files);
    
    // Check if product exists
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Direct access to fields - less nested structure
    const productData = {};
    
    // Basic fields with fallbacks to existing values
    productData.name = req.body.name || product.name;
    productData.description = req.body.description || product.description;
    productData.price = req.body.price ? Number(req.body.price) : product.price;
    productData.category = req.body.category || product.category;
    productData.period = req.body.period || product.period;
    productData.condition = req.body.condition || product.condition;
    productData.origin = req.body.origin || product.origin || '';
    
    // Important fields that need direct access
    productData.provenance = req.body.provenance || product.provenance || '';
    productData.history = req.body.history || product.history || '';
    productData.delivery = req.body.delivery || product.delivery || '';
    productData.featured = req.body.featured === 'true';
    
    // Process measures - using dot notation from form data
    productData.measures = {
      height: req.body['measures.height'] ? Number(req.body['measures.height']) : product.measures?.height || 0,
      width: req.body['measures.width'] ? Number(req.body['measures.width']) : product.measures?.width || 0,
      depth: req.body['measures.depth'] ? Number(req.body['measures.depth']) : product.measures?.depth || 0,
      unit: req.body['measures.unit'] || product.measures?.unit || 'cm'
    };
    
    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => `/uploads/${file.filename}`);
    } else if (product.images) {
      productData.images = product.images;
    }
    
    // Check if category exists (if being updated)
    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return res.status(404).json({ message: 'Category not found' });
      }
    }
    
    // Check if period exists (if being updated)
    if (req.body.period) {
      const periodExists = await Period.findById(req.body.period);
      if (!periodExists) {
        return res.status(404).json({ message: 'Period not found' });
      }
    }
    
    console.log('Final product data to update:', productData);
    
    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true }
    ).populate('category').populate('period');
    
    res.json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(400).json({ message: err.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.deleteOne();
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product status (sold/featured)
exports.updateProductStatus = async (req, res) => {
  try {
    const { sold, featured } = req.body;
    
    // Make sure at least one field is provided
    if (sold === undefined && featured === undefined) {
      return res.status(400).json({ message: 'Please provide sold or featured status' });
    }
    
    const updateData = {};
    if (sold !== undefined) updateData.sold = sold;
    if (featured !== undefined) updateData.featured = featured;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('category').populate('period');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};