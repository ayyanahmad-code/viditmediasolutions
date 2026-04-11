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
const { pool } = require('../config/database');

// ============= NEW ENDPOINTS FOR COMPANY GALLERY =============

// Get all partners with their gallery items
router.get('/partners-with-gallery', async (req, res) => {
  try {
    console.log('✅ Partners-with-gallery endpoint called');
    
    // Get all active partners
    const [partners] = await pool.query(`
      SELECT id, company_name, company_logo, contact_person, email, phone
      FROM partners 
      WHERE status = 'active'
      ORDER BY company_name
    `);

    console.log(`Found ${partners.length} partners`);

    // If no partners found, return empty array
    if (partners.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'No partners found'
      });
    }

    // For each partner, get gallery items
    const partnersWithGallery = await Promise.all(partners.map(async (partner) => {
      const [galleryItems] = await pool.query(`
        SELECT 
          id, title, description, category, media_urls, instagram_urls, 
          youtube_urls, thumbnail_url, featured, likes, views, created_at
        FROM gallery 
        WHERE partner_id = ? AND status = 'active'
        ORDER BY created_at DESC
      `, [partner.id]);

      // Parse JSON fields for each item
      const parsedItems = galleryItems.map(item => {
        let mediaUrls = [];
        let instagramUrls = [];
        let youtubeUrls = [];
        
        try {
          mediaUrls = item.media_urls ? 
            (typeof item.media_urls === 'string' ? JSON.parse(item.media_urls) : item.media_urls) : [];
        } catch(e) { mediaUrls = []; }
        
        try {
          instagramUrls = item.instagram_urls ? 
            (typeof item.instagram_urls === 'string' ? JSON.parse(item.instagram_urls) : item.instagram_urls) : [];
        } catch(e) { instagramUrls = []; }
        
        try {
          youtubeUrls = item.youtube_urls ? 
            (typeof item.youtube_urls === 'string' ? JSON.parse(item.youtube_urls) : item.youtube_urls) : [];
        } catch(e) { youtubeUrls = []; }
        
        return {
          ...item,
          media_urls: mediaUrls,
          instagram_urls: instagramUrls,
          youtube_urls: youtubeUrls
        };
      });

      // Group items by category
      const groupedItems = {
        images: parsedItems.filter(item => item.category === 'images'),
        instagram_video: parsedItems.filter(item => item.category === 'instagram_video'),
        youtube_video: parsedItems.filter(item => item.category === 'youtube_video'),
        event_video: parsedItems.filter(item => item.category === 'event_video')
      };

      return {
        id: partner.id,
        company_name: partner.company_name,
        company_logo: partner.company_logo,
        contact_person: partner.contact_person,
        email: partner.email,
        phone: partner.phone,
        gallery: {
          all: parsedItems,
          by_category: groupedItems,
          counts: {
            total: parsedItems.length,
            images: groupedItems.images.length,
            instagram_video: groupedItems.instagram_video.length,
            youtube_video: groupedItems.youtube_video.length,
            event_video: groupedItems.event_video.length
          }
        }
      };
    }));

    res.json({
      success: true,
      data: partnersWithGallery,
      message: 'Partners with gallery fetched successfully'
    });
  } catch (error) {
    console.error('Error in partners-with-gallery:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get gallery items by partner and category
router.get('/partner/:partnerId/gallery/category/:category', async (req, res) => {
  try {
    const { partnerId, category } = req.params;
    
    console.log(`Fetching gallery for partner ${partnerId}, category: ${category}`);
    
    let query = `
      SELECT 
        g.*,
        p.company_name as partner_company_name,
        p.company_logo as partner_logo
      FROM gallery g
      LEFT JOIN partners p ON g.partner_id = p.id
      WHERE g.partner_id = ? AND g.status = 'active'
    `;
    
    const params = [partnerId];
    
    if (category !== 'all') {
      query += ' AND g.category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY g.created_at DESC';
    
    const [items] = await pool.query(query, params);
    
    // Parse JSON fields
    const parsedItems = items.map(item => {
      let mediaUrls = [];
      let instagramUrls = [];
      let youtubeUrls = [];
      
      try {
        mediaUrls = item.media_urls ? 
          (typeof item.media_urls === 'string' ? JSON.parse(item.media_urls) : item.media_urls) : [];
      } catch(e) { mediaUrls = []; }
      
      try {
        instagramUrls = item.instagram_urls ? 
          (typeof item.instagram_urls === 'string' ? JSON.parse(item.instagram_urls) : item.instagram_urls) : [];
      } catch(e) { instagramUrls = []; }
      
      try {
        youtubeUrls = item.youtube_urls ? 
          (typeof item.youtube_urls === 'string' ? JSON.parse(item.youtube_urls) : item.youtube_urls) : [];
      } catch(e) { youtubeUrls = []; }
      
      return {
        ...item,
        media_urls: mediaUrls,
        instagram_urls: instagramUrls,
        youtube_urls: youtubeUrls
      };
    });
    
    console.log(`Found ${parsedItems.length} items`);
    
    res.json({
      success: true,
      data: parsedItems,
      count: parsedItems.length,
      category: category
    });
  } catch (error) {
    console.error('Error fetching partner gallery:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============= EXISTING ROUTES =============

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