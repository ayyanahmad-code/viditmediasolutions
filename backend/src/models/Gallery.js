const { pool } = require('../config/database');

class Gallery {
  // Create new gallery item with multiple media types
  static async create(data) {
    let connection;
    try {
      const {
        title,
        partner_id,
        category,
        instagram_urls = [],
        youtube_urls = [],
        media_urls = []
      } = data;

      console.log('📝 Creating gallery item with:', {
        title,
        partner_id,
        category,
        instagram_count: instagram_urls.length,
        youtube_count: youtube_urls.length,
        media_count: media_urls.length
      });

      connection = await pool.getConnection();
      
      const query = `
        INSERT INTO gallery (
          title, partner_id, category, media_urls, instagram_urls, 
          youtube_urls, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())
      `;

      const [result] = await connection.execute(query, [
        title,
        partner_id,
        category,
        JSON.stringify(media_urls),
        JSON.stringify(instagram_urls),
        JSON.stringify(youtube_urls)
      ]);

      console.log(`✅ Gallery item created with ID: ${result.insertId}`);
      return result.insertId;
      
    } catch (error) {
      console.error('❌ Error in Gallery.create:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  // Get all gallery items with filters
  static async findAll(filters = {}) {
    let connection;
    try {
      const {
        category = 'all',
        search = '',
        limit = 20,
        page = 1,
        partner_id = null
      } = filters;

      const offset = (page - 1) * limit;
      
      connection = await pool.getConnection();
      
      let query = `
        SELECT 
          g.*,
          p.company_name as partner_company_name,
          p.company_logo as partner_logo
        FROM gallery g
        LEFT JOIN partners p ON g.partner_id = p.id
        WHERE g.status = 'active'
      `;
      
      const params = [];

      if (category !== 'all') {
        query += ' AND g.category = ?';
        params.push(category);
      }

      if (partner_id) {
        query += ' AND g.partner_id = ?';
        params.push(partner_id);
      }

      if (search) {
        query += ' AND g.title LIKE ?';
        params.push(`%${search}%`);
      }

      query += ` ORDER BY g.created_at DESC LIMIT ? OFFSET ?`;
      params.push(parseInt(limit), offset);

      const [rows] = await connection.execute(query, params);

      // Parse JSON fields
      const items = rows.map(item => ({
        ...item,
        media_urls: item.media_urls ? JSON.parse(item.media_urls) : [],
        instagram_urls: item.instagram_urls ? JSON.parse(item.instagram_urls) : [],
        youtube_urls: item.youtube_urls ? JSON.parse(item.youtube_urls) : [],
        media: item.media_urls ? JSON.parse(item.media_urls) : []
      }));

      // Get total count
      let countQuery = `
        SELECT COUNT(*) as total FROM gallery g 
        WHERE g.status = 'active'
      `;
      const countParams = [];

      if (category !== 'all') {
        countQuery += ' AND g.category = ?';
        countParams.push(category);
      }

      if (partner_id) {
        countQuery += ' AND g.partner_id = ?';
        countParams.push(partner_id);
      }

      if (search) {
        countQuery += ' AND g.title LIKE ?';
        countParams.push(`%${search}%`);
      }

      const [countResult] = await connection.execute(countQuery, countParams);
      const total = countResult[0].total;

      return {
        items,
        total,
        page,
        pages: Math.ceil(total / limit)
      };
      
    } catch (error) {
      console.error('❌ Error in Gallery.findAll:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  // Get single gallery item by ID
  static async findById(id) {
    let connection;
    try {
      connection = await pool.getConnection();
      
      const query = `
        SELECT 
          g.*,
          p.company_name as partner_company_name,
          p.company_logo as partner_logo
        FROM gallery g
        LEFT JOIN partners p ON g.partner_id = p.id
        WHERE g.id = ? AND g.status = 'active'
      `;

      const [rows] = await connection.execute(query, [id]);
      
      if (rows.length === 0) return null;

      const item = rows[0];
      return {
        ...item,
        media_urls: item.media_urls ? JSON.parse(item.media_urls) : [],
        instagram_urls: item.instagram_urls ? JSON.parse(item.instagram_urls) : [],
        youtube_urls: item.youtube_urls ? JSON.parse(item.youtube_urls) : [],
        media: item.media_urls ? JSON.parse(item.media_urls) : []
      };
      
    } catch (error) {
      console.error('❌ Error in Gallery.findById:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  // Update gallery item
  static async update(id, data) {
    let connection;
    try {
      const updates = [];
      const params = [];

      if (data.title !== undefined) {
        updates.push('title = ?');
        params.push(data.title);
      }
      if (data.category !== undefined) {
        updates.push('category = ?');
        params.push(data.category);
      }
      if (data.instagram_urls !== undefined) {
        updates.push('instagram_urls = ?');
        params.push(JSON.stringify(data.instagram_urls));
      }
      if (data.youtube_urls !== undefined) {
        updates.push('youtube_urls = ?');
        params.push(JSON.stringify(data.youtube_urls));
      }
      if (data.media_urls !== undefined) {
        updates.push('media_urls = ?');
        params.push(JSON.stringify(data.media_urls));
      }
      if (data.status !== undefined) {
        updates.push('status = ?');
        params.push(data.status);
      }

      if (updates.length === 0) return false;

      updates.push('updated_at = NOW()');
      params.push(id);

      connection = await pool.getConnection();
      
      const query = `UPDATE gallery SET ${updates.join(', ')} WHERE id = ?`;
      const [result] = await connection.execute(query, params);

      return result.affectedRows > 0;
      
    } catch (error) {
      console.error('❌ Error in Gallery.update:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  // Delete gallery item (soft delete)
  static async delete(id) {
    let connection;
    try {
      connection = await pool.getConnection();
      
      const query = 'UPDATE gallery SET status = "inactive", updated_at = NOW() WHERE id = ?';
      const [result] = await connection.execute(query, [id]);
      
      return result.affectedRows > 0;
      
    } catch (error) {
      console.error('❌ Error in Gallery.delete:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  // Get featured items
  static async getFeatured(limit = 6) {
    let connection;
    try {
      connection = await pool.getConnection();
      
      const query = `
        SELECT 
          g.*,
          p.company_name as partner_company_name
        FROM gallery g
        LEFT JOIN partners p ON g.partner_id = p.id
        WHERE g.status = 'active' AND g.featured = true
        ORDER BY g.created_at DESC
        LIMIT ?
      `;

      const [rows] = await connection.execute(query, [limit]);
      
      return rows.map(item => ({
        ...item,
        media_urls: item.media_urls ? JSON.parse(item.media_urls) : [],
        instagram_urls: item.instagram_urls ? JSON.parse(item.instagram_urls) : [],
        youtube_urls: item.youtube_urls ? JSON.parse(item.youtube_urls) : []
      }));
      
    } catch (error) {
      console.error('❌ Error in Gallery.getFeatured:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  // Get gallery items by partner
  static async getByPartner(partner_id, limit = 50) {
    let connection;
    try {
      connection = await pool.getConnection();
      
      const query = `
        SELECT * FROM gallery 
        WHERE partner_id = ? AND status = 'active'
        ORDER BY created_at DESC
        LIMIT ?
      `;

      const [rows] = await connection.execute(query, [partner_id, limit]);
      
      return rows.map(item => ({
        ...item,
        media_urls: item.media_urls ? JSON.parse(item.media_urls) : [],
        instagram_urls: item.instagram_urls ? JSON.parse(item.instagram_urls) : [],
        youtube_urls: item.youtube_urls ? JSON.parse(item.youtube_urls) : []
      }));
      
    } catch (error) {
      console.error('❌ Error in Gallery.getByPartner:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  // Get categories
  static async getCategories() {
    let connection;
    try {
      connection = await pool.getConnection();
      
      const query = `
        SELECT DISTINCT category, COUNT(*) as count 
        FROM gallery 
        WHERE status = 'active' AND category IS NOT NULL
        GROUP BY category
      `;
      
      const [rows] = await connection.execute(query);
      return rows;
      
    } catch (error) {
      console.error('❌ Error in Gallery.getCategories:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = Gallery;