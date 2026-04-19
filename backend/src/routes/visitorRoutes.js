const express = require('express');
const router = express.Router();
const { 
  addVisitor, 
  getOnlineUsers, 
  getTotalVisits,
  getUniqueVisitors,
  getTodaysVisits
} = require('../models/visitorModel');
const { pool } = require('../config/database');

// ✅ GET all visitors (for testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM visitors ORDER BY last_visit_time DESC');
    res.json({ success: true, visitors: rows });
  } catch (error) {
    console.error('Error getting visitors:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ SAVE VISITOR (POST)
router.post('/', async (req, res) => {
  try {
    console.log('📍 POST /api/visitors - Received body:', req.body);
    
    const { ip, city, country } = req.body;
    
    if (!ip) {
      console.error('❌ No IP in request body');
      return res.status(400).json({ 
        success: false, 
        message: 'IP address is required' 
      });
    }
    
    const result = await addVisitor({ ip, city, country });
    
    if (result) {
      res.json({ success: true, message: 'Visitor saved successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to save visitor' });
    }
  } catch (error) {
    console.error('❌ Error in POST /api/visitors:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ GET ONLINE USERS
router.get('/online', async (req, res) => {
  try {
    const total = await getOnlineUsers();
    res.json({ total });
  } catch (error) {
    console.error('Error getting online users:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ GET TOTAL VISITS (all time)
router.get('/total-visits', async (req, res) => {
  try {
    const total = await getTotalVisits();
    res.json({ total });
  } catch (error) {
    console.error('Error getting total visits:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ GET UNIQUE VISITORS
router.get('/unique', async (req, res) => {
  try {
    const total = await getUniqueVisitors();
    res.json({ total });
  } catch (error) {
    console.error('Error getting unique visitors:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ GET TODAY'S VISITS
router.get('/today', async (req, res) => {
  try {
    const total = await getTodaysVisits();
    res.json({ total });
  } catch (error) {
    console.error('Error getting today\'s visits:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ DEBUG: Check all visitors
router.get('/debug', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM visitors ORDER BY last_visit_time DESC');
    console.log('🔍 All visitors in DB:', rows);
    res.json({ success: true, visitors: rows });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ DEBUG: Check database connection
router.get('/check-db', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1 as connected');
    res.json({ success: true, message: 'Database connected', result });
  } catch (error) {
    console.error('DB Connection error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;