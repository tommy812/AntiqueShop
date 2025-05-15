const fs = require('fs');
const path = require('path');

// Determine if we're in a serverless environment (like Vercel)
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION;

// In-memory storage for serverless environments
const memoryStorage = {
  files: [],
};

// Helper to get file path for the client
const getFilePath = file => {
  if (isServerless) {
    // For memory storage, we'll use a virtual path
    return `/uploads/${file.originalname}-${Date.now()}`;
  } else {
    // For disk storage, use the actual file path
    return `/uploads/${file.filename}`;
  }
};

// Upload single image
exports.uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Handle storage based on environment
    if (isServerless) {
      // Store file in memory for serverless environments
      const fileId = Date.now().toString();
      const memFile = {
        id: fileId,
        originalname: req.file.originalname,
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };

      // Store in memory
      memoryStorage.files.push(memFile);

      // Create virtual path
      const virtualPath = `/uploads/${fileId}-${req.file.originalname}`;

      return res.json({
        message: 'File uploaded successfully (memory storage)',
        file: {
          id: fileId,
          originalname: req.file.originalname,
          path: virtualPath,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    }

    // For disk storage environments
    const relativePath = `/uploads/${req.file.filename}`;

    res.json({
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: relativePath,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Upload multiple images
exports.uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Handle storage based on environment
    if (isServerless) {
      // Store files in memory
      const uploadedFiles = req.files.map(file => {
        const fileId = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const memFile = {
          id: fileId,
          originalname: file.originalname,
          buffer: file.buffer,
          mimetype: file.mimetype,
          size: file.size,
        };

        // Store in memory
        memoryStorage.files.push(memFile);

        return {
          id: fileId,
          originalname: file.originalname,
          path: `/uploads/${fileId}-${file.originalname}`,
          size: file.size,
          mimetype: file.mimetype,
        };
      });

      return res.json({
        message: `${req.files.length} file(s) uploaded successfully (memory storage)`,
        files: uploadedFiles,
      });
    }

    // For disk storage environments
    const fileDetails = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      path: `/uploads/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
    }));

    res.json({
      message: `${req.files.length} file(s) uploaded successfully`,
      files: fileDetails,
    });
  } catch (err) {
    console.error('Upload error:', err);
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

    // Handle storage based on environment
    if (isServerless) {
      // For memory storage
      const fileIndex = memoryStorage.files.findIndex(
        file => file.id === filename || `${file.id}-${file.originalname}` === filename
      );

      if (fileIndex === -1) {
        return res.status(404).json({ message: 'File not found in memory storage' });
      }

      // Remove from memory
      memoryStorage.files.splice(fileIndex, 1);

      return res.json({ message: 'File deleted successfully from memory' });
    }

    // For disk storage
    const filePath = path.join(__dirname, '../uploads', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete file
    fs.unlinkSync(filePath);

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Serve a file from memory storage (for serverless environments)
exports.serveFile = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    if (!fileId) {
      return res.status(400).json({ message: 'File ID is required' });
    }

    // For serverless environment, find file in memory
    if (isServerless) {
      const file = memoryStorage.files.find(
        file => file.id === fileId || `${file.id}-${file.originalname}` === fileId
      );

      if (!file) {
        return res.status(404).json({ message: 'File not found in memory storage' });
      }

      // Set content type
      res.setHeader('Content-Type', file.mimetype);

      // Send buffer
      return res.send(file.buffer);
    }

    // For disk storage (this shouldn't be called, but just in case)
    res.status(400).json({ message: 'This endpoint is only for serverless environments' });
  } catch (err) {
    console.error('Serve file error:', err);
    res.status(500).json({ message: err.message });
  }
};
