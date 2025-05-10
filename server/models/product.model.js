const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  measures: {
    height: { type: Number },
    width: { type: Number },
    depth: { type: Number },
    unit: { type: String, default: 'cm' }
  },
  condition: {
    type: String,
    enum: ['Excellent', 'Very Good', 'Good', 'Fair'],
    default: 'Good'
  },
  featured: { type: Boolean, default: false },
  sold: { type: Boolean, default: false },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  period: { type: mongoose.Schema.Types.ObjectId, ref: 'Period' },
  origin: { type: String },
  provenance: { type: String },
  history: { type: String },
  delivery: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);