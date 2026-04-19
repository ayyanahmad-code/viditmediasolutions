// // backend/routes/careerRoutes.js
// const express = require('express');
// const router = express.Router();
// const { 
//   applyCareer, 
//   uploadResume,
//   getAllCareerApplications,
//   getCareerApplicationById,
//   updateCareerApplicationStatus,
//   deleteCareerApplication,
//   scheduleInterview,
//   getInterviewDetails
// } = require('../controllers/careerController');
// const { protect } = require('../middleware/auth');

// // Debug middleware
// router.use((req, res, next) => {
//   console.log(`📡 Career Route: ${req.method} ${req.originalUrl}`);
//   next();
// });

// // Public route - Submit career application
// router.post('/apply', uploadResume, applyCareer);

// // Test route to verify career routes are working
// router.get('/test', (req, res) => {
//   res.json({ success: true, message: 'Career routes are working!' });
// });

// // Protected routes - All routes below require authentication
// router.use(protect);

// // Get all career applications
// router.get('/all', getAllCareerApplications);

// // Get single career application
// router.get('/:id', getCareerApplicationById);

// // Update career application status
// router.put('/:id/status', updateCareerApplicationStatus);

// // Schedule interview
// router.post('/:id/schedule-interview', scheduleInterview);

// // Get interview details
// router.get('/:id/interview-details', getInterviewDetails);

// // Delete career application
// router.delete('/:id', deleteCareerApplication);

// module.exports = router;




// backend/routes/careerRoutes.js
const express = require('express');
const router = express.Router();
const { 
  applyCareer, 
  uploadResume,
  getAllCareerApplications,
  getCareerApplicationById,
  updateCareerApplicationStatus,
  deleteCareerApplication,
  scheduleInterview,
  getInterviewDetails
} = require('../controllers/careerController');
const { protect } = require('../middleware/auth');

// Debug middleware
router.use((req, res, next) => {
  console.log(`📡 Career Route: ${req.method} ${req.originalUrl}`);
  next();
});

// Public route - Submit career application
router.post('/apply', uploadResume, applyCareer);

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Career routes are working!' });
});

// Protected routes - All routes below require authentication
router.use(protect);

// Get all career applications
router.get('/all', getAllCareerApplications);

// Get single career application
router.get('/:id', getCareerApplicationById);

// Update career application status
router.put('/:id/status', updateCareerApplicationStatus);

// Schedule interview (supports reschedule)
router.post('/:id/schedule-interview', scheduleInterview);

// Get interview details with history
router.get('/:id/interview-details', getInterviewDetails);

// Delete career application
router.delete('/:id', deleteCareerApplication);

module.exports = router;