// backend/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { 
  submitContact, 
  getAllContacts, 
  getContactById, 
  updateContactStatus, 
  deleteContact 
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

// Public route - Submit contact form
router.post('/', submitContact);

// Protected routes - Require authentication
router.get('/all', protect, getAllContacts);
router.get('/:id', protect, getContactById);
router.put('/:id/status', protect, updateContactStatus);
router.delete('/:id', protect, deleteContact);

module.exports = router;