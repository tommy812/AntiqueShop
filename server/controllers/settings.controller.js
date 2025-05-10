const Settings = require('../models/settings.model');

// Get site settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSiteSettings();
    res.json(settings);
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
};

// Update site settings
exports.updateSettings = async (req, res) => {
  try {
    console.log('Received settings update request. Body:', req.body);
    console.log('User authentication:', req.user ? 'Authenticated' : 'Not authenticated');
    console.log('User admin status:', req.user ? (req.user.role === 'admin' ? 'Admin' : 'Not admin') : 'No user');
    
    // Auth check is now handled by middleware
    console.log('Authorization passed, updating settings');
    const updatedSettings = await Settings.updateSettings(req.body);
    console.log('Settings updated successfully:', updatedSettings);
    res.json(updatedSettings);
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ message: 'Failed to update settings' });
  }
};

// Reset settings to default values
exports.resetSettings = async (req, res) => {
  try {
    // Auth check is now handled by middleware
    
    // Delete existing settings
    await Settings.deleteMany({});
    
    // Create new default settings
    const defaultSettings = await Settings.create({});
    
    res.json(defaultSettings);
  } catch (err) {
    console.error('Error resetting settings:', err);
    res.status(500).json({ message: 'Failed to reset settings' });
  }
}; 