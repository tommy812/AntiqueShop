const Theme = require('../models/theme.model');
const fs = require('fs').promises;
const path = require('path');

// Path to theme settings file
const themeFilePath = path.join(__dirname, '../data/theme-settings.json');

// Default theme settings
const defaultTheme = {
  primary: '#9c6644',
  secondary: '#d4a373',
};

// Ensure the data directory exists
const ensureDataDir = async () => {
  const dataDir = path.join(__dirname, '../data');
  try {
    await fs.access(dataDir);
  } catch (error) {
    // Directory doesn't exist, create it
    await fs.mkdir(dataDir, { recursive: true });
  }
};

// Get current theme settings
exports.getThemeSettings = async (req, res) => {
  try {
    await ensureDataDir();
    
    try {
      // Try to read existing theme settings
      const data = await fs.readFile(themeFilePath, 'utf8');
      const theme = JSON.parse(data);
      res.json(theme);
    } catch (error) {
      // If file doesn't exist or is invalid, return default theme
      if (error.code === 'ENOENT' || error instanceof SyntaxError) {
        // Write default theme to file for future use
        await fs.writeFile(themeFilePath, JSON.stringify(defaultTheme, null, 2));
        res.json(defaultTheme);
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error getting theme settings:', error);
    res.status(500).json({ message: 'Error retrieving theme settings' });
  }
};

// Update theme settings
exports.updateThemeSettings = async (req, res) => {
  try {
    await ensureDataDir();
    
    const { primary, secondary } = req.body;
    
    // Validate input
    if (!primary || !secondary) {
      return res.status(400).json({ message: 'Primary and secondary colors are required' });
    }
    
    // Validate color format (simple hex validation)
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(primary) || !hexColorRegex.test(secondary)) {
      return res.status(400).json({ message: 'Invalid color format. Use hex format (e.g., #RRGGBB)' });
    }
    
    // Create theme object
    const theme = { primary, secondary };
    
    // Save to file
    await fs.writeFile(themeFilePath, JSON.stringify(theme, null, 2));
    
    res.json(theme);
  } catch (error) {
    console.error('Error updating theme settings:', error);
    res.status(500).json({ message: 'Error updating theme settings' });
  }
};

// Get active theme
exports.getActiveTheme = async (req, res) => {
  try {
    // Get the active theme or create default if none exists
    let theme = await Theme.findOne({ isActive: true });
    
    if (!theme) {
      // Create default theme if no active theme exists
      theme = await new Theme({
        primaryColor: '#8b4513', // Saddle Brown
        secondaryColor: '#daa520', // Goldenrod
        fontPrimary: 'Playfair Display, serif',
        fontSecondary: 'Roboto, sans-serif',
        isActive: true
      }).save();
    }
    
    res.json(theme);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all themes
exports.getAllThemes = async (req, res) => {
  try {
    const themes = await Theme.find().sort('-createdAt');
    res.json(themes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new theme
exports.createTheme = async (req, res) => {
  try {
    const { primaryColor, secondaryColor, fontPrimary, fontSecondary, logoUrl } = req.body;
    
    // Create new theme
    const theme = new Theme({
      primaryColor,
      secondaryColor,
      fontPrimary,
      fontSecondary,
      logoUrl,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });
    
    // Save new theme
    const savedTheme = await theme.save();
    
    res.status(201).json(savedTheme);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update theme
exports.updateTheme = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id);
    
    if (!theme) {
      return res.status(404).json({ message: 'Theme not found' });
    }
    
    // Update theme properties
    if (req.body.primaryColor) theme.primaryColor = req.body.primaryColor;
    if (req.body.secondaryColor) theme.secondaryColor = req.body.secondaryColor;
    if (req.body.fontPrimary) theme.fontPrimary = req.body.fontPrimary;
    if (req.body.fontSecondary) theme.fontSecondary = req.body.fontSecondary;
    if (req.body.logoUrl) theme.logoUrl = req.body.logoUrl;
    if (req.body.isActive !== undefined) theme.isActive = req.body.isActive;
    
    // Save updated theme
    const updatedTheme = await theme.save();
    
    res.json(updatedTheme);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Set active theme
exports.setActiveTheme = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id);
    
    if (!theme) {
      return res.status(404).json({ message: 'Theme not found' });
    }
    
    // Set theme as active
    theme.isActive = true;
    await theme.save();
    
    res.json({ message: 'Theme activated successfully', theme });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete theme
exports.deleteTheme = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id);
    
    if (!theme) {
      return res.status(404).json({ message: 'Theme not found' });
    }
    
    // Don't allow deleting the active theme
    if (theme.isActive) {
      return res.status(400).json({ message: 'Cannot delete the active theme' });
    }
    
    await theme.deleteOne();
    
    res.json({ message: 'Theme deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 