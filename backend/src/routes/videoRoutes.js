const express = require('express');
const router = express.Router();
const { 
  uploadVideoJSON,
  getAllVideos,
  getVideosBySliderType,
  getVideoById,
  updateVideoJSON,
  deleteVideo
} = require('../controllers/videoController');
const { protect } = require('../middleware/auth');

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
router.post('/upload', protect, uploadVideoJSON);
router.put('/:id', protect, updateVideoJSON);
router.delete('/:id', protect, deleteVideo);

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Video routes are working!' });
});

console.log('✅ Video Routes loaded');

module.exports = router;