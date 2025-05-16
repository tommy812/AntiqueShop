const multer = require('multer');

// Always use memory storage since Vercel Blob handles the storage
const storage = multer.memoryStorage();
console.log('Using memory storage for uploads with Vercel Blob integration');

// Filter function for images
const imageFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

module.exports = upload;
