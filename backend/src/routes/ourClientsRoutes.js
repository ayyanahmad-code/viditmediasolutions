// // backend/src/routes/ourClientsRoutes.js
// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const { 
//   uploadClient,
//   getAllClients,
//   getAllClientsAdmin,
//   getClientById,
//   updateClient,
//   deleteClient
// } = require('../controllers/ourClientsController');
// const { protect } = require('../middleware/auth');

// // Temporary upload directory
// const TEMP_UPLOAD_DIR = path.join(__dirname, '../../public/temp');

// // Ensure temp directory exists
// if (!fs.existsSync(TEMP_UPLOAD_DIR)) {
//   fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
// }

// // Configure multer for client logo upload to temp folder
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, TEMP_UPLOAD_DIR);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, `client-temp-${uniqueSuffix}${path.extname(file.originalname)}`);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/gif'];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only JPEG, PNG, JPG, WEBP, SVG, GIF are allowed.'), false);
//   }
// };

// const upload = multer({ 
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: fileFilter
// });

// // Debug middleware
// router.use((req, res, next) => {
//   console.log(`📡 Our Clients Route: ${req.method} ${req.originalUrl}`);
//   next();
// });

// // Public routes - Get clients (no authentication needed)
// router.get('/all', getAllClients);

// // Protected routes - Require authentication (for admin)
// router.get('/admin/all', protect, getAllClientsAdmin);
// router.get('/:id', protect, getClientById);
// router.post('/upload', protect, upload.single('logo'), uploadClient);
// router.put('/:id', protect, upload.single('logo'), updateClient);
// router.delete('/:id', protect, deleteClient);

// // Test route
// router.get('/test', (req, res) => {
//   res.json({ success: true, message: 'Our Clients routes are working!' });
// });

// console.log('✅ Our Clients Routes loaded');

// module.exports = router;



const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { 
  uploadClient,
  getAllClients,
  getAllClientsAdmin,
  getClientById,
  updateClient,
  deleteClient,
  toggleClientStatus
} = require('../controllers/ourClientsController');
const { protect } = require('../middleware/auth');

// Temporary upload directory
const TEMP_UPLOAD_DIR = path.join(__dirname, '../../public/temp');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_UPLOAD_DIR)) {
  fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
}

// Configure multer for client logo upload to temp folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `client-temp-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, JPG, WEBP, SVG, GIF are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Debug middleware
router.use((req, res, next) => {
  console.log(`📡 Our Clients Route: ${req.method} ${req.originalUrl}`);
  next();
});

// Public routes - Get clients (no authentication needed)
router.get('/all', getAllClients);

// Protected routes - Require authentication (for admin)
router.get('/admin/all', protect, getAllClientsAdmin);
router.get('/:id', protect, getClientById);
router.post('/upload', protect, upload.single('logo'), uploadClient);
router.put('/:id', protect, upload.single('logo'), updateClient);
router.patch('/:id/toggle-status', protect, toggleClientStatus); // Convenience endpoint for toggling status
router.delete('/:id', protect, deleteClient);

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Our Clients routes are working!' });
});

console.log('✅ Our Clients Routes loaded');

module.exports = router;