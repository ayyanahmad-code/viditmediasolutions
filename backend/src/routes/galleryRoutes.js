const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const {
  createGalleryItem,
  getAllGalleryItems,
  getGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getByPartner,
  getCategories,
  getFeaturedItems
} = require('../controllers/galleryController');

// Configure file upload
const uploadMiddleware = fileUpload({
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  useTempFiles: false,
  parseNested: true
});

// Routes
router.post('/create', uploadMiddleware, createGalleryItem);
router.get('/all', getAllGalleryItems);
router.get('/categories', getCategories);
router.get('/featured', getFeaturedItems);
router.get('/partner/:partnerId', getByPartner);
router.get('/:id', getGalleryItem);
router.put('/:id', updateGalleryItem);
router.delete('/:id', deleteGalleryItem);

module.exports = router;