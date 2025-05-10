const fs = require('fs');
const path = require('path');

// Upload single image
exports.uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Create path relative to server
    const relativePath = `/uploads/${req.file.filename}`;
    
    res.json({
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: relativePath,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upload multiple images
exports.uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
    // Create response with file details
    const fileDetails = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      path: `/uploads/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype
    }));
    
    res.json({
      message: `${req.files.length} file(s) uploaded successfully`,
      files: fileDetails
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a file
exports.deleteFile = async (req, res) => {
  try {
    const filename = req.params.filename;
    
    if (!filename) {
      return res.status(400).json({ message: 'Filename is required' });
    }
    
    // Create full file path
    const filePath = path.join(__dirname, '../uploads', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Delete file
    fs.unlinkSync(filePath);
    
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 