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