// // backend/controllers/careerController.js
// const { pool } = require('../config/database');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Configure multer for file upload to public folder
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Save to public/uploads/resumes folder
//     const uploadDir = path.join(__dirname, '../../public/uploads/resumes');
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, uniqueSuffix + ext);
//   }
// });

// // Only allow PDF, DOC, DOCX files
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = [
//     'application/pdf',
//     'application/msword',
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//   ];
  
//   const allowedExtensions = ['.pdf', '.doc', '.docx'];
//   const ext = path.extname(file.originalname).toLowerCase();
  
//   if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'), false);
//   }
// };

// const upload = multer({ 
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: fileFilter
// });

// exports.uploadResume = upload.single('resume');

// // Helper function to check if PAN card can apply (3 months cooldown)
// const canApplyWithPanCard = async (panCard) => {
//   if (!panCard) return true;
    
//   const [existingApplications] = await pool.query(
//     `SELECT createdAt FROM career_applications 
//      WHERE pan_card = ? 
//      ORDER BY createdAt DESC 
//      LIMIT 1`,
//     [panCard]
//   );
  
//   if (existingApplications.length === 0) {
//     return true;
//   }
  
//   const lastApplicationDate = new Date(existingApplications[0].createdAt);
//   const currentDate = new Date();
//   const monthsDifference = (currentDate.getFullYear() - lastApplicationDate.getFullYear()) * 12 +
//     (currentDate.getMonth() - lastApplicationDate.getMonth());
  
//   return monthsDifference >= 3;
// };

// // Apply for career (Public)
// exports.applyCareer = async (req, res) => {
//   try {
//     console.log("📩 Raw request body:", req.body);
//     console.log("📎 File uploaded:", req.file);
    
//     const { name, email, phone, position, experience, message, pan_card } = req.body;
//     const resumeFile = req.file;

//     if (!name || !email || !position) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide name, email and position'
//       });
//     }

//     if (!resumeFile) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please upload your resume/CV (PDF, DOC, or DOCX only)'
//       });
//     }

//     // Validate PAN card format if provided
//     if (pan_card && pan_card.trim()) {
//       const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//       const upperPanCard = pan_card.toUpperCase().trim();
//       if (!panRegex.test(upperPanCard)) {
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid PAN card format. Please enter a valid PAN card number (e.g., ABCDE1234F)'
//         });
//       }
      
//       const canApply = await canApplyWithPanCard(upperPanCard);
//       if (!canApply) {
//         const [lastApp] = await pool.query(
//           'SELECT createdAt FROM career_applications WHERE pan_card = ? ORDER BY createdAt DESC LIMIT 1',
//           [upperPanCard]
//         );
//         const lastDate = new Date(lastApp[0].createdAt).toLocaleDateString();
//         const nextEligibleDate = new Date(lastApp[0].createdAt);
//         nextEligibleDate.setMonth(nextEligibleDate.getMonth() + 3);
        
//         return res.status(400).json({
//           success: false,
//           message: `You can only apply once every 3 months with the same PAN card. Last application was on ${lastDate}. You will be eligible to apply again on ${nextEligibleDate.toLocaleDateString()}.`
//         });
//       }
//     }

//     // Store the correct path for web access (public/uploads/resumes/filename)
//     const relativePath = `uploads/resumes/${resumeFile.filename}`;
    
//     console.log("📁 Resume saved at:", resumeFile.path);
//     console.log("📁 Relative path for DB:", relativePath);

//     // Insert with PAN card
//     const sql = `INSERT INTO career_applications 
//       (name, pan_card, email, phone, position, experience, message, resume_path, status, createdAt) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`;
    
//     const [result] = await pool.query(sql, [
//       name, 
//       pan_card ? pan_card.toUpperCase().trim() : null, 
//       email, 
//       phone || '', 
//       position, 
//       experience || '', 
//       message || '',
//       relativePath
//     ]);

//     const referenceId = `VIDIT-${Date.now()}-${result.insertId}`;
//     await pool.query('UPDATE career_applications SET reference_id = ? WHERE id = ?', [referenceId, result.insertId]);

//     console.log("✅ Application saved with ID:", result.insertId);

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
    
//    const sql = `SELECT id, name, pan_card, email, phone, position, experience, 
//                 message, resume_path, reference_id, status, 
//                 interview_date, interview_time,
//                 reschedule_status, reschedule_count,
//                 DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s') as createdAt,
//                 DATE_FORMAT(updatedAt, '%Y-%m-%d %H:%i:%s') as updatedAt
//          FROM career_applications 
//          ORDER BY createdAt DESC`;

//     const [applications] = await pool.query(sql);
    
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
    
//     const validStatuses = ['pending', 'reviewed', 'interview_scheduled', 'rescheduled', 'rejected', 'hired'];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status value'
//       });
//     }
    
//     const sql = 'UPDATE career_applications SET status = ?, updatedAt = NOW() WHERE id = ?';
//     await pool.query(sql, [status, id]);
    
//     console.log(`✅ Updated application ${id} status to ${status}`);
    
//     res.json({
//       success: true,
//       message: 'Application status updated successfully'
//     });
//   } catch (error) {
//     console.error('Error updating application status:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error: ' + error.message
//     });
//   }
// };

// // Delete career application
// exports.deleteCareerApplication = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const [app] = await pool.query('SELECT resume_path FROM career_applications WHERE id = ?', [id]);
//     if (app.length > 0 && app[0].resume_path) {
//       const resumePath = path.join(__dirname, '../../public', app[0].resume_path);
//       if (fs.existsSync(resumePath)) {
//         fs.unlinkSync(resumePath);
//         console.log(`🗑️ Deleted resume file: ${resumePath}`);
//       }
//     }
    
//     const sql = 'DELETE FROM career_applications WHERE id = ?';
//     await pool.query(sql, [id]);
    
//     console.log(`✅ Deleted application ${id}`);
    
//     res.json({
//       success: true,
//       message: 'Application deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting application:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error: ' + error.message
//     });
//   }
// };


// // backend/controllers/careerController.js

// // Schedule interview (with reschedule support)
// exports.scheduleInterview = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { interview_date, interview_time, is_reschedule } = req.body;
    
//     if (!interview_date || !interview_time) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide interview date and time'
//       });
//     }
    
//     // Check if this is a reschedule
//     if (is_reschedule) {
//       // Get current interview details for tracking
//       const [currentData] = await pool.query(
//         'SELECT interview_date, interview_time, reschedule_count, reschedule_status FROM career_applications WHERE id = ?',
//         [id]
//       );
      
//       const currentRescheduleCount = (currentData[0]?.reschedule_count || 0) + 1;
//       const rescheduleStatus = currentRescheduleCount >= 2 ? 'multiple_reschedules' : 'rescheduled';
      
//       const sql = `UPDATE career_applications 
//                    SET status = 'rescheduled', 
//                        interview_scheduled = TRUE,
//                        interview_date = ?,
//                        interview_time = ?,
//                        reschedule_date = ?,
//                        reschedule_time = ?,
//                        reschedule_status = ?,
//                        reschedule_count = ?,
//                        updatedAt = NOW() 
//                    WHERE id = ?`;
      
//       await pool.query(sql, [
//         interview_date, 
//         interview_time,
//         currentData[0]?.interview_date || null,
//         currentData[0]?.interview_time || null,
//         rescheduleStatus,
//         currentRescheduleCount,
//         id
//       ]);
      
//       console.log(`✅ Interview rescheduled for application ${id} to ${interview_date} at ${interview_time}`);
//       console.log(`📊 Reschedule count: ${currentRescheduleCount}, Status: ${rescheduleStatus}`);
      
//       res.json({
//         success: true,
//         message: 'Interview rescheduled successfully',
//         data: {
//           interview_date,
//           interview_time,
//           reschedule_date: currentData[0]?.interview_date,
//           reschedule_time: currentData[0]?.interview_time,
//           reschedule_count: currentRescheduleCount,
//           reschedule_status: rescheduleStatus
//         }
//       });
//     } else {
//       // Initial schedule
//       const sql = `UPDATE career_applications 
//                    SET status = 'interview_scheduled', 
//                        interview_scheduled = TRUE,
//                        interview_date = ?,
//                        interview_time = ?,
//                        reschedule_status = 'none',
//                        reschedule_count = 0,
//                        updatedAt = NOW() 
//                    WHERE id = ?`;
      
//       await pool.query(sql, [interview_date, interview_time, id]);
      
//       console.log(`✅ Interview scheduled for application ${id} on ${interview_date} at ${interview_time}`);
      
//       res.json({
//         success: true,
//         message: 'Interview scheduled successfully',
//         data: {
//           interview_date,
//           interview_time,
//           reschedule_status: 'none',
//           reschedule_count: 0
//         }
//       });
//     }
//   } catch (error) {
//     console.error('Error scheduling interview:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error: ' + error.message
//     });
//   }
// };

// // Get interview details with reschedule info
// exports.getInterviewDetails = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const sql = `SELECT interview_scheduled, interview_date, interview_time, status,
//                         reschedule_date, reschedule_time, reschedule_status, reschedule_count
//                  FROM career_applications 
//                  WHERE id = ?`;
    
//     const [result] = await pool.query(sql, [id]);
    
//     if (result.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Application not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       data: result[0]
//     });
//   } catch (error) {
//     console.error('Error fetching interview details:', error);
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
const emailService = require('../utils/emailService'); // ✅ Add email service

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../public/uploads/resumes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

exports.uploadResume = upload.single('resume');

// Helper: Check if PAN card can apply (3 months cooldown)
const canApplyWithPanCard = async (panCard) => {
  if (!panCard) return true;
    
  const [existingApplications] = await pool.query(
    `SELECT created_at FROM career_applications 
     WHERE pan_card = ? 
     ORDER BY created_at DESC 
     LIMIT 1`,
    [panCard]
  );
  
  if (existingApplications.length === 0) return true;
  
  const lastApplicationDate = new Date(existingApplications[0].created_at);
  const currentDate = new Date();
  const monthsDifference = (currentDate.getFullYear() - lastApplicationDate.getFullYear()) * 12 +
    (currentDate.getMonth() - lastApplicationDate.getMonth());
  
  return monthsDifference >= 3;
};

// Apply for career (Public)
exports.applyCareer = async (req, res) => {
  try {
    console.log("📩 Raw request body:", req.body);
    console.log("📎 File uploaded:", req.file);
    
    const { name, email, phone, position, experience, message, pan_card } = req.body;
    const resumeFile = req.file;

    if (!name || !email || !position) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and position'
      });
    }

    if (!resumeFile) {
      return res.status(400).json({
        success: false,
        message: 'Please upload your resume/CV (PDF, DOC, or DOCX only)'
      });
    }

    // Validate PAN card format if provided
    if (pan_card && pan_card.trim()) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      const upperPanCard = pan_card.toUpperCase().trim();
      if (!panRegex.test(upperPanCard)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid PAN card format. Please enter a valid PAN card number (e.g., ABCDE1234F)'
        });
      }
      
      const canApply = await canApplyWithPanCard(upperPanCard);
      if (!canApply) {
        const [lastApp] = await pool.query(
          'SELECT created_at FROM career_applications WHERE pan_card = ? ORDER BY created_at DESC LIMIT 1',
          [upperPanCard]
        );
        const lastDate = new Date(lastApp[0].created_at).toLocaleDateString();
        const nextEligibleDate = new Date(lastApp[0].created_at);
        nextEligibleDate.setMonth(nextEligibleDate.getMonth() + 3);
        
        return res.status(400).json({
          success: false,
          message: `You can only apply once every 3 months with the same PAN card. Last application was on ${lastDate}. You will be eligible to apply again on ${nextEligibleDate.toLocaleDateString()}.`
        });
      }
    }

    const relativePath = `uploads/resumes/${resumeFile.filename}`;
    
    // Insert application
    const sql = `INSERT INTO career_applications 
      (name, pan_card, email, phone, position, experience, message, resume_path, status, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`;
    
    const [result] = await pool.query(sql, [
      name, 
      pan_card ? pan_card.toUpperCase().trim() : null, 
      email, 
      phone || '', 
      position, 
      experience || '', 
      message || '',
      relativePath
    ]);

    console.log("✅ Application saved with ID:", result.insertId);

    // ✅ Send email notifications
    const applicationData = {
      id: result.insertId,
      name,
      email,
      phone,
      position,
      experience,
      message
    };

    // Send email to admin
    await emailService.sendCareerApplicationNotification(applicationData);
    
    // Send auto-reply to applicant
    await emailService.sendCareerAutoReply(applicationData);

    res.json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        id: result.insertId,
        position: position,
        name: name
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

// Get all career applications
exports.getAllCareerApplications = async (req, res) => {
  try {
    console.log('📋 Fetching all career applications...');
    
    const sql = `SELECT 
                id, name, pan_card, email, phone, position, experience, 
                message, resume_path, status,
                interview_date,
                reschedule_count, reschedule_history,
                original_interview_date,
                hired_at, rejected_at, rejection_reason,
                DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
                DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
         FROM career_applications 
         ORDER BY created_at DESC`;

    const [applications] = await pool.query(sql);
    
    // Parse JSON for reschedule history
    const processedApps = applications.map(app => ({
      ...app,
      reschedule_history: app.reschedule_history ? JSON.parse(app.reschedule_history) : []
    }));
    
    console.log(`✅ Found ${processedApps.length} career applications`);
    
    res.json({
      success: true,
      count: processedApps.length,
      data: processedApps
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
    
    // Parse JSON history
    if (application[0].reschedule_history) {
      application[0].reschedule_history = JSON.parse(application[0].reschedule_history);
    } else {
      application[0].reschedule_history = [];
    }
    
    res.json({
      success: true,
      data: application[0]
    });
  } catch (error) {
    console.error('Error fetching career application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Update career application status
exports.updateCareerApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    
    const validStatuses = ['pending', 'reviewed', 'interview_scheduled', 'rejected', 'hired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const [current] = await pool.query('SELECT status, name, email, position FROM career_applications WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    let updateData = { status, updated_at: new Date() };
    
    if (status === 'hired') {
      updateData.hired_at = new Date();
      // Send hired notification
      await emailService.sendApplicationStatusUpdate(current[0], 'hired');
    } else if (status === 'rejected') {
      updateData.rejected_at = new Date();
      if (reason) updateData.rejection_reason = reason;
      // Send rejection notification
      await emailService.sendApplicationStatusUpdate(current[0], 'rejected', reason);
    }
    
    await pool.query('UPDATE career_applications SET ? WHERE id = ?', [updateData, id]);
    
    console.log(`✅ Updated application ${id} status to ${status}`);
    
    res.json({
      success: true,
      message: 'Application status updated successfully'
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Schedule/Reschedule Interview (All in one function)
exports.scheduleInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { interview_datetime, is_reschedule } = req.body;
    
    if (!interview_datetime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide interview date and time'
      });
    }
    
    // Get current application data
    const [currentData] = await pool.query(
      `SELECT status, interview_date, reschedule_count, reschedule_history, original_interview_date, name, email, position
       FROM career_applications WHERE id = ?`,
      [id]
    );
    
    if (currentData.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    let rescheduleHistory = currentData[0].reschedule_history;
    if (rescheduleHistory) {
      rescheduleHistory = JSON.parse(rescheduleHistory);
    } else {
      rescheduleHistory = [];
    }
    
    let newRescheduleCount = currentData[0].reschedule_count || 0;
    let originalDate = currentData[0].original_interview_date;
    
    if (is_reschedule) {
      // This is a reschedule
      newRescheduleCount += 1;
      
      // Store current interview in history
      if (currentData[0].interview_date) {
        rescheduleHistory.push({
          attempt_number: newRescheduleCount,
          previous_date: currentData[0].interview_date,
          new_date: interview_datetime,
          rescheduled_at: new Date().toISOString()
        });
      }
      
      // If this is first reschedule, save original date
      if (!originalDate && currentData[0].interview_date) {
        originalDate = currentData[0].interview_date;
      }
      
      // Update with rescheduled date
      await pool.query(
        `UPDATE career_applications 
         SET interview_date = ?,
             reschedule_count = ?,
             reschedule_history = ?,
             original_interview_date = COALESCE(original_interview_date, ?),
             status = 'interview_scheduled',
             updated_at = NOW()
         WHERE id = ?`,
        [
          interview_datetime,
          newRescheduleCount,
          JSON.stringify(rescheduleHistory),
          originalDate,
          id
        ]
      );
      
      console.log(`✅ Interview RESCHEDULED for application ${id} to ${interview_datetime}`);
      console.log(`📊 Reschedule count: ${newRescheduleCount}`);
      
      // Send interview reschedule notification
      await emailService.sendInterviewScheduledEmail(currentData[0], { interview_datetime, is_reschedule: true, reschedule_count: newRescheduleCount });
      
      res.json({
        success: true,
        message: `Interview rescheduled successfully (Attempt #${newRescheduleCount})`,
        data: {
          interview_datetime,
          reschedule_count: newRescheduleCount,
          original_interview_date: originalDate,
          reschedule_history: rescheduleHistory
        }
      });
      
    } else {
      // Initial schedule
      await pool.query(
        `UPDATE career_applications 
         SET interview_date = ?,
             original_interview_date = ?,
             reschedule_count = 0,
             reschedule_history = NULL,
             status = 'interview_scheduled',
             updated_at = NOW()
         WHERE id = ?`,
        [interview_datetime, interview_datetime, id]
      );
      
      console.log(`✅ Interview SCHEDULED for application ${id} on ${interview_datetime}`);
      
      // Send interview scheduled notification
      await emailService.sendInterviewScheduledEmail(currentData[0], { interview_datetime, is_reschedule: false });
      
      res.json({
        success: true,
        message: 'Interview scheduled successfully',
        data: {
          interview_datetime,
          reschedule_count: 0,
          original_interview_date: interview_datetime
        }
      });
    }
  } catch (error) {
    console.error('Error scheduling interview:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Get interview details with reschedule info
exports.getInterviewDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const sql = `SELECT interview_date, status, reschedule_count, reschedule_history, original_interview_date
                 FROM career_applications 
                 WHERE id = ?`;
    
    const [result] = await pool.query(sql, [id]);
    
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    let rescheduleHistory = result[0].reschedule_history;
    if (rescheduleHistory) {
      rescheduleHistory = JSON.parse(rescheduleHistory);
    } else {
      rescheduleHistory = [];
    }
    
    res.json({
      success: true,
      data: {
        interview_date: result[0].interview_date,
        status: result[0].status,
        reschedule_count: result[0].reschedule_count,
        reschedule_history: rescheduleHistory,
        original_interview_date: result[0].original_interview_date
      }
    });
  } catch (error) {
    console.error('Error fetching interview details:', error);
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
    
    const [app] = await pool.query('SELECT resume_path FROM career_applications WHERE id = ?', [id]);
    if (app.length > 0 && app[0].resume_path) {
      const resumePath = path.join(__dirname, '../../public', app[0].resume_path);
      if (fs.existsSync(resumePath)) {
        fs.unlinkSync(resumePath);
        console.log(`🗑️ Deleted resume file: ${resumePath}`);
      }
    }
    
    await pool.query('DELETE FROM career_applications WHERE id = ?', [id]);
    
    console.log(`✅ Deleted application ${id}`);
    
    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};