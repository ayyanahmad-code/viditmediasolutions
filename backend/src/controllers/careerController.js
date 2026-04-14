// // backend/controllers/careerController.js
// const { pool } = require('../config/database');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Configure multer for file upload
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadDir = 'uploads/resumes';
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, PNG are allowed.'), false);
//   }
// };

// const upload = multer({ 
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: fileFilter
// });

// exports.uploadResume = upload.single('resume');

// // Apply for career (Public)
// exports.applyCareer = async (req, res) => {
//   try {
//     const { name, email, phone, position, experience, message } = req.body;
//     const resumeFile = req.file;

//     console.log("📩 Career apply received:", { name, email, phone, position, experience });

//     if (!name || !email || !position) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide name, email and position'
//       });
//     }

//     if (!resumeFile) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please upload your resume/CV'
//       });
//     }

//     const sql = `INSERT INTO career_applications 
//       (name, email, phone, position, experience, message, resume_path, status, createdAt) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`;
    
//     const [result] = await pool.query(sql, [
//       name, 
//       email, 
//       phone || '', 
//       position, 
//       experience || '', 
//       message || '',
//       resumeFile.path
//     ]);

//     const referenceId = `VIDIT-${Date.now()}-${result.insertId}`;
//     await pool.query('UPDATE career_applications SET reference_id = ? WHERE id = ?', [referenceId, result.insertId]);

//     res.json({
//       success: true,
//       message: 'Application submitted successfully',
//       data: {
//         referenceId: referenceId,
//         position: position,
//         name: name
//       }
//     });

//   } catch (error) {
//     console.error('Career error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error: ' + error.message
//     });
//   }
// };

// // Get all career applications (Protected)
// exports.getAllCareerApplications = async (req, res) => {
//   try {
//     console.log('📋 Fetching all career applications...');
    
//     // Check if status column exists, if not, use default
//     const [columns] = await pool.query("SHOW COLUMNS FROM career_applications LIKE 'status'");
//     const hasStatusColumn = columns.length > 0;
    
//     let sql;
//     if (hasStatusColumn) {
//       sql = `SELECT id, name, email, phone, position, experience, 
//                     message, resume_path, reference_id, status, 
//                     DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s') as createdAt,
//                     DATE_FORMAT(updatedAt, '%Y-%m-%d %H:%i:%s') as updatedAt
//              FROM career_applications 
//              ORDER BY createdAt DESC`;
//     } else {
//       sql = `SELECT id, name, email, phone, position, experience, 
//                     message, resume_path, reference_id, 
//                     DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s') as createdAt
//              FROM career_applications 
//              ORDER BY createdAt DESC`;
//     }
    
//     const [applications] = await pool.query(sql);
    
//     // Add default status if column doesn't exist
//     if (!hasStatusColumn) {
//       applications.forEach(app => {
//         app.status = 'pending';
//       });
//     }
    
//     console.log(`✅ Found ${applications.length} career applications`);
    
//     res.json({
//       success: true,
//       count: applications.length,
//       data: applications
//     });
//   } catch (error) {
//     console.error('❌ Error fetching career applications:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error: ' + error.message
//     });
//   }
// };

// // Get single career application by ID
// exports.getCareerApplicationById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const sql = `SELECT * FROM career_applications WHERE id = ?`;
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
//     console.error('Error fetching career application:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// };

// // Update career application status
// exports.updateCareerApplicationStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
    
//     // Check if status column exists
//     const [columns] = await pool.query("SHOW COLUMNS FROM career_applications LIKE 'status'");
    
//     if (columns.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Status column does not exist in database'
//       });
//     }
    
//     const sql = 'UPDATE career_applications SET status = ?, updatedAt = NOW() WHERE id = ?';
//     await pool.query(sql, [status, id]);
    
//     res.json({
//       success: true,
//       message: 'Application status updated successfully'
//     });
//   } catch (error) {
//     console.error('Error updating application status:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// };

// // Delete career application
// exports.deleteCareerApplication = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const sql = 'DELETE FROM career_applications WHERE id = ?';
//     await pool.query(sql, [id]);
    
//     res.json({
//       success: true,
//       message: 'Application deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting application:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// };



// backend/controllers/careerController.js
const { pool } = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const emailService = require('../utils/EmailService'); // Add email service

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/resumes';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, PNG are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

exports.uploadResume = upload.single('resume');

// Apply for career (Public)
exports.applyCareer = async (req, res) => {
  try {
    const { name, email, phone, position, experience, message } = req.body;
    const resumeFile = req.file;

    console.log("📩 Career apply received:", { name, email, phone, position, experience });

    if (!name || !email || !position) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and position'
      });
    }

    if (!resumeFile) {
      return res.status(400).json({
        success: false,
        message: 'Please upload your resume/CV'
      });
    }

    const sql = `INSERT INTO career_applications 
      (name, email, phone, position, experience, message, resume_path, status, createdAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`;
    
    const [result] = await pool.query(sql, [
      name, 
      email, 
      phone || '', 
      position, 
      experience || '', 
      message || '',
      resumeFile.path
    ]);

    const referenceId = `CAREER-${Date.now()}-${result.insertId}`;
    await pool.query('UPDATE career_applications SET reference_id = ? WHERE id = ?', [referenceId, result.insertId]);

    // Send email notifications
    let emailSent = false;
    let emailError = null;

    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        console.log('📧 Sending career application email notifications...');
        
        await emailService.sendCareerApplicationNotification({
          name: name,
          email: email,
          phone: phone || '',
          position: position,
          experience: experience || '',
          message: message || '',
          referenceId: referenceId,
          applicationId: result.insertId,
          resumePath: resumeFile.path
        });
        
        emailSent = true;
        console.log('✅ Career application emails sent successfully');
      } else {
        console.warn('⚠️ Email service not configured - skipping email notifications');
      }
    } catch (error) {
      emailError = error.message;
      console.error('❌ Career email notification failed:', error.message);
    }

    res.json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        referenceId: referenceId,
        position: position,
        name: name,
        emailSent: emailSent,
        emailError: emailError
      }
    });

  } catch (error) {
    console.error('Career error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Get all career applications (Protected)
exports.getAllCareerApplications = async (req, res) => {
  try {
    console.log('📋 Fetching all career applications...');
    
    // Check if status column exists, if not, use default
    const [columns] = await pool.query("SHOW COLUMNS FROM career_applications LIKE 'status'");
    const hasStatusColumn = columns.length > 0;
    
    let sql;
    if (hasStatusColumn) {
      sql = `SELECT id, name, email, phone, position, experience, 
                    message, resume_path, reference_id, status, 
                    DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s') as createdAt,
                    DATE_FORMAT(updatedAt, '%Y-%m-%d %H:%i:%s') as updatedAt
             FROM career_applications 
             ORDER BY createdAt DESC`;
    } else {
      sql = `SELECT id, name, email, phone, position, experience, 
                    message, resume_path, reference_id, 
                    DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s') as createdAt
             FROM career_applications 
             ORDER BY createdAt DESC`;
    }
    
    const [applications] = await pool.query(sql);
    
    // Add default status if column doesn't exist
    if (!hasStatusColumn) {
      applications.forEach(app => {
        app.status = 'pending';
      });
    }
    
    console.log(`✅ Found ${applications.length} career applications`);
    
    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('❌ Error fetching career applications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Get single career application by ID
exports.getCareerApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT * FROM career_applications WHERE id = ?`;
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
    console.error('Error fetching career application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update career application status
exports.updateCareerApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Check if status column exists
    const [columns] = await pool.query("SHOW COLUMNS FROM career_applications LIKE 'status'");
    
    if (columns.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Status column does not exist in database'
      });
    }
     
    const sql = 'UPDATE career_applications SET status = ?, updatedAt = NOW() WHERE id = ?';
    await pool.query(sql, [status, id]);
    
    res.json({
      success: true,
      message: 'Application status updated successfully'
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete career application
exports.deleteCareerApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'DELETE FROM career_applications WHERE id = ?';
    await pool.query(sql, [id]);
    
    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

