const Gallery = require('../models/Gallery');
const path = require('path');
const fs = require('fs');

// Helper function to ensure upload directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
};

// Upload multiple files helper
const uploadMultipleFiles = async (files, subFolder) => {
  const uploadedPaths = [];
  const uploadDir = path.join(__dirname, '../../public/uploads', subFolder);
  
  ensureDirectoryExists(uploadDir);

  const fileArray = Array.isArray(files) ? files : [files];
  
  for (const file of fileArray) {
    try {
      const fileExt = path.extname(file.name);
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substr(2, 9);
      const filename = `${timestamp}_${randomStr}${fileExt}`;
      const uploadPath = path.join(uploadDir, filename);
      
      await file.mv(uploadPath);
      uploadedPaths.push(`/uploads/${subFolder}/${filename}`);
      console.log(`✅ Uploaded: ${filename}`);
    } catch (err) {
      console.error(`❌ Error uploading file ${file.name}:`, err.message);
    }
  }

  return uploadedPaths;
};

// @desc    Create new gallery item with multiple media types
exports.createGalleryItem = async (req, res) => {
  try {
    console.log('📝 Received gallery creation request');
    console.log('Body:', req.body);
    console.log('Files:', req.files ? Object.keys(req.files) : 'No files');
    
    const { 
      title, 
      partner_id, 
      category,
      instagram_urls,
      youtube_urls
    } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    if (!partner_id) {
      return res.status(400).json({
        success: false,
        message: 'Partner ID is required'
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }

    let imagePaths = [];
    let videoPaths = [];

    // Handle multiple image uploads
    if (req.files && req.files.images) {
      console.log('📸 Processing images...');
      imagePaths = await uploadMultipleFiles(req.files.images, 'gallery/images');
    }

    // Handle multiple video uploads
    if (req.files && req.files.videos) {
      console.log('🎥 Processing videos...');
      videoPaths = await uploadMultipleFiles(req.files.videos, 'gallery/videos');
    }

    // Process Instagram URLs
    let instagramUrlsArray = [];
    if (instagram_urls) {
      instagramUrlsArray = Array.isArray(instagram_urls) ? instagram_urls : [instagram_urls];
      console.log(`📸 Instagram URLs: ${instagramUrlsArray.length}`);
    }

    // Process YouTube URLs
    let youtubeUrlsArray = [];
    if (youtube_urls) {
      youtubeUrlsArray = Array.isArray(youtube_urls) ? youtube_urls : [youtube_urls];
      console.log(`▶️ YouTube URLs: ${youtubeUrlsArray.length}`);
    }

    // Combine all media URLs
    const allMediaUrls = [...imagePaths, ...videoPaths];

    const galleryId = await Gallery.create({
      title: title.trim(),
      partner_id: parseInt(partner_id),
      category,
      instagram_urls: instagramUrlsArray,
      youtube_urls: youtubeUrlsArray,
      media_urls: allMediaUrls,
      images: imagePaths,
      videos: videoPaths
    });

    console.log(`✅ Gallery item created with ID: ${galleryId}`);

    res.status(201).json({
      success: true,
      message: 'Gallery item created successfully',
      data: {
        id: galleryId,
        image_count: imagePaths.length,
        video_count: videoPaths.length,
        instagram_count: instagramUrlsArray.length,
        youtube_count: youtubeUrlsArray.length
      }
    });
  } catch (error) {
    console.error('❌ Error creating gallery item:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Get all gallery items
exports.getAllGalleryItems = async (req, res) => {
  try {
    console.log('📋 Fetching gallery items...');
    const { 
      category = 'all', 
      search = '', 
      limit = 20, 
      page = 1,
      partner_id = null 
    } = req.query;

    const result = await Gallery.findAll({
      category,
      search,
      limit: parseInt(limit),
      page: parseInt(page),
      partner_id: partner_id ? parseInt(partner_id) : null
    });

    console.log(`✅ Found ${result.items.length} gallery items`);

    res.status(200).json({
      success: true,
      data: result.items,
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching gallery:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single gallery item
exports.getGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('❌ Error fetching gallery item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update gallery item
exports.updateGalleryItem = async (req, res) => {
  try {
    const { title, category, instagram_urls, youtube_urls, status } = req.body;

    const updated = await Gallery.update(req.params.id, {
      title,
      category,
      instagram_urls,
      youtube_urls,
      status
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Gallery item updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating gallery:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete gallery item
exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    // Delete files from server
    const mediaUrls = item.media_urls || [];
    for (const mediaUrl of mediaUrls) {
      if (mediaUrl) {
        const filePath = path.join(__dirname, '../../public', mediaUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`🗑️ Deleted file: ${filePath}`);
        }
      }
    }

    await Gallery.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting gallery:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get gallery items by partner
exports.getByPartner = async (req, res) => {
  try {
    const items = await Gallery.getByPartner(req.params.partnerId, req.query.limit || 50);
    
    res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('❌ Error fetching partner gallery:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Gallery.getCategories();
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get featured items
exports.getFeaturedItems = async (req, res) => {
  try {
    const items = await Gallery.getFeatured(req.query.limit || 6);
    
    res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('❌ Error fetching featured items:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};