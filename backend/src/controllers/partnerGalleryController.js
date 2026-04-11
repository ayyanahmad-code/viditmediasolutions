const { pool } = require('../config/database');

// Get all active partners with their gallery items
exports.getPartnersWithGallery = async (req, res) => {
  try {
    // Get all active partners
    const [partners] = await pool.query(`
      SELECT id, company_name, company_logo, contact_person, email, phone
      FROM partners 
      WHERE status = 'active'
      ORDER BY company_name
    `);

    // For each partner, get gallery items grouped by category
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
      const parsedItems = galleryItems.map(item => ({
        ...item,
        media_urls: item.media_urls ? JSON.parse(item.media_urls) : [],
        instagram_urls: item.instagram_urls ? JSON.parse(item.instagram_urls) : [],
        youtube_urls: item.youtube_urls ? JSON.parse(item.youtube_urls) : []
      }));

      // Group items by category
      const groupedItems = {
        images: parsedItems.filter(item => item.category === 'images'),
        instagram_video: parsedItems.filter(item => item.category === 'instagram_video'),
        youtube_video: parsedItems.filter(item => item.category === 'youtube_video'),
        event_video: parsedItems.filter(item => item.category === 'event_video')
      };

      return {
        ...partner,
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
    console.error('Error fetching partners with gallery:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get gallery items by partner and category
exports.getPartnerGalleryByCategory = async (req, res) => {
  try {
    const { partnerId, category } = req.params;
    
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
    const parsedItems = items.map(item => ({
      ...item,
      media_urls: item.media_urls ? JSON.parse(item.media_urls) : [],
      instagram_urls: item.instagram_urls ? JSON.parse(item.instagram_urls) : [],
      youtube_urls: item.youtube_urls ? JSON.parse(item.youtube_urls) : []
    }));
    
    res.json({
      success: true,
      data: parsedItems,
      count: parsedItems.length,
      category: category
    });
  } catch (error) {
    console.error('Error fetching partner gallery by category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get single partner with their gallery
exports.getPartnerWithGallery = async (req, res) => {
  try {
    const { partnerId } = req.params;
    
    // Get partner details
    const [partners] = await pool.query(`
      SELECT id, company_name, company_logo, contact_person, email, phone, address, website
      FROM partners 
      WHERE id = ? AND status = 'active'
    `, [partnerId]);
    
    if (partners.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }
    
    const partner = partners[0];
    
    // Get all gallery items for this partner
    const [galleryItems] = await pool.query(`
      SELECT 
        id, title, description, category, media_urls, instagram_urls, 
        youtube_urls, thumbnail_url, featured, likes, views, created_at
      FROM gallery 
      WHERE partner_id = ? AND status = 'active'
      ORDER BY created_at DESC
    `, [partnerId]);
    
    // Parse JSON fields
    const parsedItems = galleryItems.map(item => ({
      ...item,
      media_urls: item.media_urls ? JSON.parse(item.media_urls) : [],
      instagram_urls: item.instagram_urls ? JSON.parse(item.instagram_urls) : [],
      youtube_urls: item.youtube_urls ? JSON.parse(item.youtube_urls) : []
    }));
    
    // Group by category
    const groupedItems = {
      all: parsedItems,
      images: parsedItems.filter(item => item.category === 'images'),
      instagram_video: parsedItems.filter(item => item.category === 'instagram_video'),
      youtube_video: parsedItems.filter(item => item.category === 'youtube_video'),
      event_video: parsedItems.filter(item => item.category === 'event_video')
    };
    
    res.json({
      success: true,
      data: {
        partner: partner,
        gallery: groupedItems,
        counts: {
          total: parsedItems.length,
          images: groupedItems.images.length,
          instagram_video: groupedItems.instagram_video.length,
          youtube_video: groupedItems.youtube_video.length,
          event_video: groupedItems.event_video.length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching partner with gallery:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};