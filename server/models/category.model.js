const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true
  },
  image: { 
    type: String
  },
  description: { 
    type: String
  },
  featured: { 
    type: Boolean, 
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);