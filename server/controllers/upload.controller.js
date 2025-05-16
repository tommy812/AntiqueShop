const { put, del, list } = require('@vercel/blob');

// Maximum number of images per product
const MAX_IMAGES_PER_PRODUCT = 15;

// Helper to get in-memory image count for a product
const getProductImageCount = async productId => {
  try {
    const { blobs } = await list({
      prefix: `products/${productId}/`,
    });
    return blobs.length;
  } catch (error) {
    console.error('Error counting product images:', error);
    return 0;
  }
};

// Upload category image
exports.uploadCategoryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const categoryId = req.body.categoryId || 'general';

    // Create filename with path structure for categories
    const filename = `categories/${categoryId}/${Date.now()}-${req.file.originalname}`;

    // Upload to Vercel Blob
    const blob = await put(filename, req.file.buffer, {
      access: 'public',
      contentType: req.file.mimetype,
    });

    return res.json({
      message: 'Category image uploaded successfully',
      file: {
        id: blob.pathname,
        filename: blob.pathname,
        originalname: req.file.originalname,
        path: blob.url,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (err) {
    console.error('Category image upload error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Upload single image
exports.uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const productId = req.body.productId || 'general';

    // Check image count for this product if a productId is provided
    if (productId !== 'general') {
      const currentCount = await getProductImageCount(productId);
      if (currentCount >= MAX_IMAGES_PER_PRODUCT) {
        return res.status(400).json({
          message: `Maximum of ${MAX_IMAGES_PER_PRODUCT} images allowed per product. Please delete some images first.`,
        });
      }
    }

    // Create filename with path structure
    const filename = `products/${productId}/${Date.now()}-${req.file.originalname}`;

    // Upload to Vercel Blob
    const blob = await put(filename, req.file.buffer, {
      access: 'public',
      contentType: req.file.mimetype,
    });

    return res.json({
      message: 'File uploaded successfully',
      file: {
        id: blob.pathname,
        filename: blob.pathname,
        originalname: req.file.originalname,
        path: blob.url,
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

    const productId = req.body.productId || 'general';

    // Check existing image count for this product
    if (productId !== 'general') {
      const currentCount = await getProductImageCount(productId);
      const totalAfterUpload = currentCount + req.files.length;

      if (totalAfterUpload > MAX_IMAGES_PER_PRODUCT) {
        return res.status(400).json({
          message: `Maximum of ${MAX_IMAGES_PER_PRODUCT} images allowed per product. You can upload ${MAX_IMAGES_PER_PRODUCT - currentCount} more.`,
        });
      }
    }

    // Limit the number of files to process
    const filesToProcess = req.files.slice(0, MAX_IMAGES_PER_PRODUCT);

    // Upload each file to Vercel Blob
    const uploadPromises = filesToProcess.map(async file => {
      const filename = `products/${productId}/${Date.now()}-${file.originalname}`;

      const blob = await put(filename, file.buffer, {
        access: 'public',
        contentType: file.mimetype,
      });

      return {
        id: blob.pathname,
        filename: blob.pathname,
        originalname: file.originalname,
        path: blob.url,
        size: file.size,
        mimetype: file.mimetype,
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    return res.json({
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      files: uploadedFiles,
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

    // Delete from Vercel Blob
    await del(filename);

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: err.message });
  }
};

// List images for a product
exports.listProductImages = async (req, res) => {
  try {
    const productId = req.params.productId;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const { blobs } = await list({
      prefix: `products/${productId}/`,
    });

    const files = blobs.map(blob => ({
      id: blob.pathname,
      filename: blob.pathname,
      path: blob.url,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
    }));

    return res.json({
      message: `Found ${files.length} image(s) for product ${productId}`,
      files,
    });
  } catch (err) {
    console.error('List images error:', err);
    res.status(500).json({ message: err.message });
  }
};
