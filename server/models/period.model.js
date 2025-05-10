const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true
  },
  description: { 
    type: String
  },
  yearStart: { 
    type: Number
  },
  yearEnd: { 
    type: Number
  },
  featured: { 
    type: Boolean, 
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Period', periodSchema); 