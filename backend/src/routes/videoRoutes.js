// backend/src/routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { 
  uploadVideo,
  getAllVideos,
  getVideosBySliderType,
  getVideoById,
  updateVideo,
  deleteVideo
} = require('../controllers/videoController');
const { protect } = require('../middleware/auth');

// Configure multer for thumbnail upload to public folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save to public/thumbnails folder (accessible via URL)
    const uploadDir = path.join(__dirname, '../../public/thumbnails');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'thumbnail-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, JPG, WEBP, GIF are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Debug middleware
router.use((req, res, next) => {
  console.log(`📡 Video Route: ${req.method} ${req.originalUrl}`);
  next();
});

// Public routes - Get videos (no authentication needed)
router.get('/all', getAllVideos);
router.get('/slider/:slider_type', getVideosBySliderType);
router.get('/:id', getVideoById);

// Protected routes - Require authentication (for admin)
router.post('/upload', protect, upload.single('thumbnail'), uploadVideo);
router.put('/:id', protect, upload.single('thumbnail'), updateVideo);
router.delete('/:id', protect, deleteVideo);

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Video routes are working!' });
});

console.log('✅ Video Routes loaded');

module.exports = router;