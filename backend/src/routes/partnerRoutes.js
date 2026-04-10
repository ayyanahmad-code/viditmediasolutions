// backend/src/routes/partnerRoutes.js
const express = require('express');
const router = express.Router();
const Partner = require('../models/Partner');

// Get all active partners
router.get('/all', async (req, res) => {
  try {
    const partners = await Partner.getAllActive();
    res.json({
      success: true,
      data: partners,
      message: 'Partners fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch partners',
      error: error.message
    });
  }
});

// Get partner by ID
router.get('/:id', async (req, res) => {
  try {
    const partner = await Partner.getById(req.params.id);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }
    res.json({
      success: true,
      data: partner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch partner',
      error: error.message
    });
  }
});

// Create new partner
router.post('/create', async (req, res) => {
  try {
    const { company_name, contact_person, email, phone, address, website } = req.body;
    
    // Validate required fields
    if (!company_name || company_name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Company name is required'
      });
    }
    
    const partnerId = await Partner.create({
      company_name: company_name.trim(),
      contact_person: contact_person ? contact_person.trim() : null,
      email: email ? email.trim() : null,
      phone: phone ? phone.trim() : null,
      address: address ? address.trim() : null,
      website: website ? website.trim() : null
    });
    
    const newPartner = await Partner.getById(partnerId);
    
    res.status(201).json({
      success: true,
      message: 'Partner created successfully',
      data: newPartner
    });
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create partner',
      error: error.message
    });
  }
});

// Update partner
router.put('/update/:id', async (req, res) => {
  try {
    const { company_name, contact_person, email, phone, address, website, status } = req.body;
    
    const updated = await Partner.update(req.params.id, {
      company_name,
      contact_person,
      email,
      phone,
      address,
      website,
      status
    });
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }
    
    const updatedPartner = await Partner.getById(req.params.id);
    
    res.json({
      success: true,
      message: 'Partner updated successfully',
      data: updatedPartner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update partner',
      error: error.message
    });
  }
});

// Delete partner (soft delete)
router.delete('/delete/:id', async (req, res) => {
  try {
    const deleted = await Partner.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Partner deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete partner',
      error: error.message
    });
  }
});

// Search partners
router.get('/search/:term', async (req, res) => {
  try {
    const partners = await Partner.search(req.params.term);
    res.json({
      success: true,
      data: partners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search partners',
      error: error.message
    });
  }
});

module.exports = router;