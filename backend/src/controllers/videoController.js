// backend/src/controllers/videoController.js
const { pool } = require('../config/database');
const path = require('path');
const fs = require('fs');

// Helper function to get YouTube ID
const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Get all videos
exports.getAllVideos = async (req, res) => {
  try {
    console.log('📋 Fetching all videos...');
    
    const sql = `SELECT id, title, thumbnail, youtube_url, youtube_id, 
                        slider_type, display_order, status, 
                        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
                 FROM videos 
                 WHERE status = 'active'
                 ORDER BY display_order ASC, created_at DESC`;
    
    const [videos] = await pool.query(sql);
    
    console.log(`✅ Found ${videos.length} videos`);
    
    res.json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (error) {
    console.error('❌ Error fetching videos:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Get videos by slider type
exports.getVideosBySliderType = async (req, res) => {
  try {
    const { slider_type } = req.params;
    
    console.log(`📋 Fetching videos for slider: ${slider_type}`);
    
    const sql = `SELECT id, title, thumbnail, youtube_url, youtube_id, 
                        slider_type, display_order, status, 
                        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
                 FROM videos 
                 WHERE status = 'active' AND slider_type = ?
                 ORDER BY display_order ASC, created_at DESC`;
    
    const [videos] = await pool.query(sql, [slider_type]);
    
    console.log(`✅ Found ${videos.length} videos for slider ${slider_type}`);
    
    res.json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (error) {
    console.error('❌ Error fetching videos by type:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Get single video by ID
exports.getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT * FROM videos WHERE id = ?`;
    const [video] = await pool.query(sql, [id]);
    
    if (video.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    res.json({
      success: true,
      data: video[0]
    });
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Upload video (Create)
exports.uploadVideo = async (req, res) => {
  try {
    const { title, youtube_url, slider_type, display_order } = req.body;
    const thumbnailFile = req.file;

    console.log('📝 Video Upload Request:', { title, youtube_url, slider_type, display_order });

    // Validation
    if (!title || !youtube_url || !slider_type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, youtube_url and slider_type'
      });
    }

    if (!thumbnailFile) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a thumbnail image'
      });
    }

    // Get YouTube ID
    const youtube_id = getYouTubeId(youtube_url);
    if (!youtube_id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube URL'
      });
    }

    // Save thumbnail path as URL (accessible from browser)
    const thumbnailUrl = `/thumbnails/${thumbnailFile.filename}`;

    // Insert into database
    const sql = `INSERT INTO videos 
      (title, thumbnail, youtube_url, youtube_id, slider_type, display_order, status) 
      VALUES (?, ?, ?, ?, ?, ?, 'active')`;
    
    const [result] = await pool.query(sql, [
      title.trim(),
      thumbnailUrl,
      youtube_url.trim(),
      youtube_id,
      slider_type,
      display_order || 0
    ]);

    console.log('✅ Video saved! ID:', result.insertId);
    console.log('📸 Thumbnail saved at:', thumbnailUrl);

    res.status(200).json({
      success: true,
      message: 'Video uploaded successfully',
      data: {
        id: result.insertId,
        title,
        youtube_id,
        slider_type,
        thumbnail: thumbnailUrl
      }
    });

  } catch (error) {
    console.error('❌ Video upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Update video
exports.updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, youtube_url, slider_type, display_order, status } = req.body;
    const thumbnailFile = req.file;

    console.log('📝 Update Video Request for ID:', id);

    // Check if video exists
    const [existing] = await pool.query('SELECT * FROM videos WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    // Get YouTube ID if URL provided
    let youtube_id = existing[0].youtube_id;
    if (youtube_url && youtube_url !== existing[0].youtube_url) {
      youtube_id = getYouTubeId(youtube_url);
      if (!youtube_id) {
        return res.status(400).json({
          success: false,
          message: 'Invalid YouTube URL'
        });
      }
    }

    // Build update query
    let sql = `UPDATE videos SET 
      title = COALESCE(?, title),
      youtube_url = COALESCE(?, youtube_url),
      youtube_id = COALESCE(?, youtube_id),
      slider_type = COALESCE(?, slider_type),
      display_order = COALESCE(?, display_order),
      status = COALESCE(?, status)`;
    
    const values = [
      title || null,
      youtube_url || null,
      youtube_id || null,
      slider_type || null,
      display_order !== undefined ? display_order : null,
      status || null
    ];

    // Add thumbnail if provided
    if (thumbnailFile) {
      const thumbnailUrl = `/thumbnails/${thumbnailFile.filename}`;
      sql += `, thumbnail = ?`;
      values.push(thumbnailUrl);
      
      // Delete old thumbnail file
      if (existing[0].thumbnail) {
        const oldThumbnailPath = path.join(__dirname, '../../public', existing[0].thumbnail);
        if (fs.existsSync(oldThumbnailPath)) {
          fs.unlinkSync(oldThumbnailPath);
          console.log('✅ Old thumbnail deleted');
        }
      }
    }

    sql += ` WHERE id = ?`;
    values.push(id);

    await pool.query(sql, values);

    console.log('✅ Video updated! ID:', id);

    res.json({
      success: true,
      message: 'Video updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating video:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Delete video
exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get thumbnail path to delete file
    const [video] = await pool.query('SELECT thumbnail FROM videos WHERE id = ?', [id]);
    
    // Delete thumbnail file if exists
    if (video.length > 0 && video[0].thumbnail) {
      const thumbnailPath = path.join(__dirname, '../../public', video[0].thumbnail);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
        console.log('✅ Thumbnail file deleted');
      }
    }
    
    const sql = 'DELETE FROM videos WHERE id = ?';
    await pool.query(sql, [id]);
    
    res.json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};