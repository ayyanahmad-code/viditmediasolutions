// // backend/src/controllers/careerHiringController.js
// const { pool } = require('../config/database');

// // Submit Career Hiring Application
// exports.submitCareerHiring = async (req, res) => {
//   try {
//     console.log('📝 Career Hiring Request received');
//     console.log('Request body:', req.body);
    
//     const { 
//       position, 
//       shift,  
//       workMode, 
//       keywords, 
//       experience, 
//       status, 
//       message 
//     } = req.body;

//     // Validate required fields
//     const missingFields = [];
//     if (!position) missingFields.push('position');
//     if (!shift) missingFields.push('shift');
//     if (!workMode) missingFields.push('workMode');
//     if (!keywords) missingFields.push('keywords');
//     if (!experience) missingFields.push('experience');

//     if (missingFields.length > 0) {
//       console.log('❌ Missing fields:', missingFields);
//       return res.status(400).json({
//         success: false,
//         message: `Missing required fields: ${missingFields.join(', ')}`
//       });
//     }

//     // Insert into database
//     const sql = `INSERT INTO career_hiring 
//       (position, shift, work_mode, keywords, experience, status, message)
//       VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
//     const values = [
//       position.trim(),
//       shift.trim(),
//       workMode.trim(),
//       keywords.trim(),
//       experience.trim(),
//       status || 'active',
//       message?.trim() || ''
//     ];

//     console.log('📝 Executing SQL:', sql);
//     console.log('📊 Values:', values);

//     const [result] = await pool.query(sql, values);

//     console.log('✅ Career Hiring saved! ID:', result.insertId);

//     res.status(200).json({
//       success: true,
//       message: 'Application submitted successfully',
//       data: {
//         id: result.insertId
//       }
//     });

//   } catch (error) {
//     console.error('❌ Career Hiring error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error: ' + error.message
//     });
//   }
// };

// // Get All Career Hiring Applications
// exports.getAllCareerHiring = async (req, res) => {
//   try {
//     console.log('📋 Fetching all career hiring applications...');
    
//     const sql = `SELECT id, position, shift, work_mode, keywords, 
//                         experience, status, message, 
//                         DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
//                  FROM career_hiring 
//                  ORDER BY created_at DESC`;
    
//     const [applications] = await pool.query(sql);
    
//     console.log(`✅ Found ${applications.length} applications`);
    
//     res.json({
//       success: true,
//       count: applications.length,
//       data: applications
//     });
//   } catch (error) {
//     console.error('❌ Error fetching career hiring:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error: ' + error.message
//     });
//   }
// };

// // Get Single Career Hiring Application by ID
// exports.getCareerHiringById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const sql = `SELECT * FROM career_hiring WHERE id = ?`;
//     const [application] = await pool.query(sql, [id]);
    
//     if (application.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Application not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       data: application[0]
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// };

// // ✅ UPDATE Career Hiring Application
// exports.updateCareerHiring = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { 
//       position, 
//       shift, 
//       work_mode, 
//       keywords, 
//       experience, 
//       status, 
//       message 
//     } = req.body;

//     console.log('📝 Update Career Hiring Request received for ID:', id);
//     console.log('Update data:', req.body);

//     // Check if application exists
//     const [existing] = await pool.query('SELECT * FROM career_hiring WHERE id = ?', [id]);
//     if (existing.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Application not found'
//       });
//     }

//     // Update the record
//     const sql = `UPDATE career_hiring 
//       SET position = ?, shift = ?, work_mode = ?, keywords = ?, 
//           experience = ?, status = ?, message = ?, updated_at = NOW()
//       WHERE id = ?`;
    
//     const values = [
//       position || existing[0].position,
//       shift || existing[0].shift,
//       work_mode || existing[0].work_mode,
//       keywords || existing[0].keywords,
//       experience || existing[0].experience,
//       status || existing[0].status,
//       message || existing[0].message,
//       id
//     ];

//     await pool.query(sql, values);

//     console.log('✅ Career Hiring updated! ID:', id);

//     res.json({
//       success: true,
//       message: 'Application updated successfully'
//     });

//   } catch (error) {
//     console.error('❌ Error updating career hiring:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error: ' + error.message
//     });
//   }
// };

// // Update Career Hiring Application Status
// exports.updateCareerHiringStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
    
//     const sql = 'UPDATE career_hiring SET status = ?, updated_at = NOW() WHERE id = ?';
//     await pool.query(sql, [status, id]);
    
//     res.json({
//       success: true,
//       message: 'Application status updated successfully'
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// };

// // Delete Career Hiring Application
// exports.deleteCareerHiring = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const sql = 'DELETE FROM career_hiring WHERE id = ?';
//     await pool.query(sql, [id]);
    
//     res.json({
//       success: true,
//       message: 'Application deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// };



// backend/src/controllers/careerHiringController.js
const { pool } = require('../config/database');

// Submit Career Hiring Application
exports.submitCareerHiring = async (req, res) => {
  try {
    console.log('📝 Career Hiring Request received');
    console.log('Request body:', req.body);
    
    const { 
      position, 
      shift,  
      workMode, 
      keywords, 
      experience, 
      status, 
      message 
    } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!position) missingFields.push('position');
    if (!shift) missingFields.push('shift');
    if (!workMode) missingFields.push('workMode');
    if (!keywords) missingFields.push('keywords');
    if (!experience) missingFields.push('experience');

    if (missingFields.length > 0) {
      console.log('❌ Missing fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Insert into database
    const sql = `INSERT INTO career_hiring 
      (position, shift, work_mode, keywords, experience, status, message, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    
    const values = [
      position.trim(),
      shift.trim(),
      workMode.trim(),
      keywords.trim(),
      experience.trim(),
      status || 'active',
      message?.trim() || ''
    ];

    console.log('📝 Executing SQL:', sql);
    console.log('📊 Values:', values);

    const [result] = await pool.query(sql, values);

    console.log('✅ Career Hiring saved! ID:', result.insertId);

    res.status(200).json({
      success: true,
      message: 'Job posted successfully',
      data: {
        id: result.insertId
      }
    });

  } catch (error) {
    console.error('❌ Career Hiring error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Get All Career Hiring Applications (PUBLIC)
exports.getAllCareerHiring = async (req, res) => {
  try {
    console.log('📋 Fetching all career hiring applications...');
    
    const sql = `SELECT id, position, shift, work_mode, keywords, 
                        experience, status, message, 
                        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
                        DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
                 FROM career_hiring 
                 ORDER BY created_at DESC`;
    
    const [applications] = await pool.query(sql);
    
    console.log(`✅ Found ${applications.length} applications`);
    
    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('❌ Error fetching career hiring:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Get Single Career Hiring Application by ID (PUBLIC)
exports.getCareerHiringById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT id, position, shift, work_mode, keywords, 
                        experience, status, message,
                        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
                        DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
                 FROM career_hiring WHERE id = ?`;
    const [application] = await pool.query(sql, [id]);
    
    if (application.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      data: application[0]
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// UPDATE Career Hiring Application (PROTECTED)
exports.updateCareerHiring = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      position, 
      shift, 
      work_mode, 
      keywords, 
      experience, 
      status, 
      message 
    } = req.body;

    console.log('📝 Update Career Hiring Request received for ID:', id);
    console.log('Update data:', req.body);

    // Check if application exists
    const [existing] = await pool.query('SELECT * FROM career_hiring WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Update the record
    const sql = `UPDATE career_hiring 
      SET position = ?, shift = ?, work_mode = ?, keywords = ?, 
          experience = ?, status = ?, message = ?, updated_at = NOW()
      WHERE id = ?`;
    
    const values = [
      position || existing[0].position,
      shift || existing[0].shift,
      work_mode || existing[0].work_mode,
      keywords || existing[0].keywords,
      experience || existing[0].experience,
      status || existing[0].status,
      message || existing[0].message,
      id
    ];

    await pool.query(sql, values);

    console.log('✅ Career Hiring updated! ID:', id);

    res.json({
      success: true,
      message: 'Application updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating career hiring:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Update Career Hiring Application Status (PROTECTED)
exports.updateCareerHiringStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const sql = 'UPDATE career_hiring SET status = ?, updated_at = NOW() WHERE id = ?';
    await pool.query(sql, [status, id]);
    
    res.json({
      success: true,
      message: 'Application status updated successfully'
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Delete Career Hiring Application (PROTECTED)
exports.deleteCareerHiring = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if application exists
    const [existing] = await pool.query('SELECT * FROM career_hiring WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    const sql = 'DELETE FROM career_hiring WHERE id = ?';
    await pool.query(sql, [id]);
    
    console.log('✅ Career Hiring deleted! ID:', id);
    
    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};