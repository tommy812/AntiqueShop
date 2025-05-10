const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  title: { 
    type: String, 
    default: 'Pischetola Antiques'
  },
  address: {
    street: { type: String, default: '123 Antique Street' },
    city: { type: String, default: 'Milan' },
    postalCode: { type: String, default: '20121' },
    country: { type: String, default: 'Italy' }
  },
  contact: {
    phone: { type: String, default: '+39 02 1234 5678' },
    email: { type: String, default: 'info@pischetola.com' }
  },
  hours: [
    {
      days: { type: String, default: 'Monday - Friday' },
      hours: { type: String, default: '10:00 - 18:00' },
      _id: false
    },
    {
      days: { type: String, default: 'Saturday' },
      hours: { type: String, default: '11:00 - 16:00' },
      _id: false
    },
    {
      days: { type: String, default: 'Sunday' },
      hours: { type: String, default: 'Closed' },
      _id: false
    }
  ],
  social: {
    instagram: { type: String, default: 'https://instagram.com/pischetola' },
    facebook: { type: String, default: 'https://facebook.com/pischetola' },
    twitter: { type: String, default: '' }
  },
  footer: {
    copyright: { type: String, default: '© 2024 Pischetola Antiques. All rights reserved.' },
    shortDescription: { 
      type: String, 
      default: 'Pischetola Antiques specializes in rare and unique antique furniture, art, and decorative items from various historical periods.'
    }
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
});

// Only allow one settings document in the collection
settingsSchema.statics.getSiteSettings = async function() {
  let settings = await this.findOne();
  
  // If no settings exist, create default settings
  if (!settings) {
    settings = await this.create({});
  }
  
  return settings;
};

// Update settings method
settingsSchema.statics.updateSettings = async function(newSettings) {
  const settings = await this.getSiteSettings();
  
  // Deep merge existing settings with new values
  for (const key in newSettings) {
    if (typeof newSettings[key] === 'object' && newSettings[key] !== null && !Array.isArray(newSettings[key])) {
      // If it's an object, merge with existing
      settings[key] = { ...settings[key], ...newSettings[key] };
    } else {
      // Otherwise replace with new value
      settings[key] = newSettings[key];
    }
  }
  
  settings.lastUpdated = new Date();
  return settings.save();
};

module.exports = mongoose.model('Settings', settingsSchema); 