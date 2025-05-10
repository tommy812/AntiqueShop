const Period = require('../models/period.model');
const Product = require('../models/product.model');

// Get all periods
exports.getAllPeriods = async (req, res) => {
  try {
    // Sort by year if specified, or by name
    const sort = req.query.sort === 'year' ? 'yearStart' : 'name';
    const periods = await Period.find().sort(sort);
    res.json(periods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get period by ID
exports.getPeriodById = async (req, res) => {
  try {
    const period = await Period.findById(req.params.id);
    
    if (!period) {
      return res.status(404).json({ message: 'Period not found' });
    }
    
    res.json(period);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get featured periods
exports.getFeaturedPeriods = async (req, res) => {
  try {
    const periods = await Period.find({ featured: true }).sort('name');
    res.json(periods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new period
exports.createPeriod = async (req, res) => {
  try {
    // Check if period already exists
    const existingPeriod = await Period.findOne({ name: req.body.name });
    if (existingPeriod) {
      return res.status(400).json({ message: 'Period with this name already exists' });
    }
    
    // Create new period
    const period = new Period(req.body);
    const newPeriod = await period.save();
    
    res.status(201).json(newPeriod);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a period
exports.updatePeriod = async (req, res) => {
  try {
    // Check if period exists
    const period = await Period.findById(req.params.id);
    if (!period) {
      return res.status(404).json({ message: 'Period not found' });
    }
    
    // Check if name is being changed and already exists
    if (req.body.name && req.body.name !== period.name) {
      const existingPeriod = await Period.findOne({ name: req.body.name });
      if (existingPeriod) {
        return res.status(400).json({ message: 'Period with this name already exists' });
      }
    }
    
    // Validate year range if both years are provided
    if (req.body.yearStart && req.body.yearEnd && 
        parseInt(req.body.yearStart) > parseInt(req.body.yearEnd)) {
      return res.status(400).json({ message: 'Start year must be before end year' });
    }
    
    // Update period
    const updatedPeriod = await Period.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedPeriod);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a period
exports.deletePeriod = async (req, res) => {
  try {
    // Check if period exists
    const period = await Period.findById(req.params.id);
    if (!period) {
      return res.status(404).json({ message: 'Period not found' });
    }
    
    // Check if period is used in any products
    const productsWithPeriod = await Product.countDocuments({ period: req.params.id });
    if (productsWithPeriod > 0) {
      return res.status(400).json({ 
        message: `Cannot delete period that is used by ${productsWithPeriod} product(s). Reassign or delete these products first.`
      });
    }
    
    // Delete period
    await period.deleteOne();
    
    res.json({ message: 'Period deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle featured status
exports.toggleFeatured = async (req, res) => {
  try {
    const period = await Period.findById(req.params.id);
    
    if (!period) {
      return res.status(404).json({ message: 'Period not found' });
    }
    
    // Toggle featured status
    period.featured = !period.featured;
    await period.save();
    
    res.json({
      message: `Period ${period.featured ? 'marked as featured' : 'removed from featured'}`,
      period
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 