const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  primaryColor: { 
    type: String, 
    default: '#8b4513' // Saddle Brown
  },
  secondaryColor: { 
    type: String, 
    default: '#daa520' // Goldenrod
  },
  fontPrimary: { 
    type: String, 
    default: 'Playfair Display, serif'
  },
  fontSecondary: { 
    type: String, 
    default: 'Roboto, sans-serif'
  },
  logoUrl: { 
    type: String
  },
  isActive: { 
    type: Boolean, 
    default: true
  }
}, {
  timestamps: true
});

// Ensure only one active theme
themeSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

module.exports = mongoose.model('Theme', themeSchema); 