// // backend/src/routes/careerHiringRoutes.js
// const express = require('express');
// const router = express.Router();
// const { 
//   submitCareerHiring,
//   getAllCareerHiring,
//   getCareerHiringById,
//   updateCareerHiring,
//   updateCareerHiringStatus,
//   deleteCareerHiring
// } = require('../controllers/careerHiringController');
// const { protect } = require('../middleware/auth');

// // Debug middleware
// router.use((req, res, next) => {
//   console.log(`📡 Career Hiring Route: ${req.method} ${req.originalUrl}`);
//   next();
// });

// // Public route - Submit career hiring application
// router.post('/create', submitCareerHiring);

// // Protected routes - Require authentication
// router.get('/all', protect, getAllCareerHiring);
// router.get('/:id', protect, getCareerHiringById);
// router.put('/:id', protect, updateCareerHiring);
// router.put('/:id/status', protect, updateCareerHiringStatus);
// router.delete('/:id', protect, deleteCareerHiring);

// // Test route
// router.get('/test', (req, res) => {
//   res.json({ success: true, message: 'Career Hiring routes are working!' });
// });

// console.log('✅ Career Hiring Routes loaded');

// module.exports = router;


// backend/src/routes/careerHiringRoutes.js
const express = require('express');
const router = express.Router();
const { 
  submitCareerHiring,
  getAllCareerHiring,
  getCareerHiringById,
  updateCareerHiring,
  updateCareerHiringStatus,
  deleteCareerHiring
} = require('../controllers/careerHiringController');
const { protect } = require('../middleware/auth');

// Debug middleware
router.use((req, res, next) => {
  console.log(`📡 Career Hiring Route: ${req.method} ${req.originalUrl}`);
  next();
});

// ============== PUBLIC ROUTES (No authentication required) ==============
// These routes are accessible to everyone (career page)

// Public route - Submit career hiring application
router.post('/create', submitCareerHiring);

// Public route - Get all jobs for career page (NO authentication needed)
router.get('/all', getAllCareerHiring);

// Public route - Get single job by ID
router.get('/:id', getCareerHiringById);

// Test route - Public
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Career Hiring routes are working!' });
});

// ============== PROTECTED ROUTES (Admin only) ==============
// All routes below require authentication and admin role

router.use(protect);

router.put('/:id', updateCareerHiring);
router.put('/:id/status', updateCareerHiringStatus);
router.delete('/:id', deleteCareerHiring);

console.log('✅ Career Hiring Routes loaded');

module.exports = router;