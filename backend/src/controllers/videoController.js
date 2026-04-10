const { pool } = require('../config/database');

// Helper function to get YouTube ID
const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Get all videos (including inactive ones for admin)
exports.getAllVideos = async (req, res) => {
  try {
    console.log('📋 Fetching all videos...');
    
    // Check if request is from admin (has token)
    const isAdmin = req.headers.authorization ? true : false;
    
    let sql;
    if (isAdmin) {
      // Admin can see all videos including inactive
      sql = `SELECT id, title, youtube_url, youtube_id, 
                      slider_type, status, 
                      DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
               FROM videos 
               ORDER BY created_at DESC`;
    } else {
      // Public only sees active videos
      sql = `SELECT id, title, youtube_url, youtube_id, 
                      slider_type, status, 
                      DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
               FROM videos 
               WHERE status = 'active'
               ORDER BY created_at DESC`;
    }
    
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
    
    const sql = `SELECT id, title, youtube_url, youtube_id, 
                        slider_type, status, 
                        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
                 FROM videos 
                 WHERE status = 'active' AND slider_type = ?
                 ORDER BY created_at DESC`;
    
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

// Upload video (JSON version)
exports.uploadVideoJSON = async (req, res) => {
  try {
    const { title, youtube_url, slider_type, status } = req.body;

    console.log('📝 Video Upload Request (JSON):', req.body);

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title'
      });
    }
    
    if (!youtube_url) {
      return res.status(400).json({
        success: false,
        message: 'Please provide youtube_url'
      });
    }
    
    if (!slider_type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide slider_type'
      });
    }

    // Get YouTube ID
    const youtube_id = getYouTubeId(youtube_url);
    if (!youtube_id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube URL. Please check the URL format.'
      });
    }

    // Set status (default to 'active' if not provided)
    const videoStatus = status || 'active';

    // Insert into database
    const sql = `INSERT INTO videos 
      (title, youtube_url, youtube_id, slider_type, status) 
      VALUES (?, ?, ?, ?, ?)`;
    
    const [result] = await pool.query(sql, [
      title.trim(),
      youtube_url.trim(),
      youtube_id,
      slider_type,
      videoStatus
    ]);

    console.log('✅ Video saved! ID:', result.insertId);

    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      data: {
        id: result.insertId,
        title,
        youtube_id,
        slider_type,
        status: videoStatus
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

// Update video (JSON version)
exports.updateVideoJSON = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, youtube_url, slider_type, status } = req.body;

    console.log('📝 Update Video Request (JSON) for ID:', id);
    console.log('Update data:', req.body);

    // Check if video exists
    const [existing] = await pool.query('SELECT * FROM videos WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    // Prepare update fields
    const updates = [];
    const values = [];

    if (title !== undefined && title !== existing[0].title) {
      updates.push('title = ?');
      values.push(title.trim());
    }
    
    if (youtube_url !== undefined && youtube_url !== existing[0].youtube_url) {
      const youtube_id = getYouTubeId(youtube_url);
      if (!youtube_id) {
        return res.status(400).json({
          success: false,
          message: 'Invalid YouTube URL'
        });
      }
      updates.push('youtube_url = ?');
      updates.push('youtube_id = ?');
      values.push(youtube_url.trim(), youtube_id);
    }
    
    if (slider_type !== undefined && slider_type !== existing[0].slider_type) {
      updates.push('slider_type = ?');
      values.push(slider_type);
    }
    
    if (status !== undefined && status !== existing[0].status) {
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No changes to update'
      });
    }

    values.push(id);
    const sql = `UPDATE videos SET ${updates.join(', ')} WHERE id = ?`;
    
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