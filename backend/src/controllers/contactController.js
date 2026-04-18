// backend/controllers/contactController.js
const { pool } = require('../config/database');
const emailService = require('../utils/emailService'); // ✅ Add email service

// Submit Contact Form
exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message, contact_number } = req.body;

    console.log('📝 Contact submission:', { name, email, contact_number, subject, message: message?.substring(0, 30) });

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and message'
      });
    }

    // Simple insert query
    const sql = `INSERT INTO contacts (name, email, contact_number, subject, message, status, createdAt) 
                 VALUES (?, ?, ?, ?, ?, 'unread', NOW())`;
    
    const [result] = await pool.query(sql, [
      name.trim(),
      email.trim().toLowerCase(),
      contact_number || '',
      subject || '',
      message.trim()
    ]);

    // Generate reference ID
    const referenceId = `CONTACT-${Date.now()}-${result.insertId}`;
    
    // Update reference ID
    await pool.query('UPDATE contacts SET reference_id = ? WHERE id = ?', [referenceId, result.insertId]);

    console.log('✅ Contact saved successfully! ID:', result.insertId);

    // ✅ Send email notifications
    const contactData = {
      id: result.insertId,
      name,
      email,
      contact_number,
      subject,
      message
    };

    // Send notification to admin
    await emailService.sendContactNotification(contactData);
    
    // Send auto-reply to user
    await emailService.sendContactAutoReply(contactData);

    res.json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        id: result.insertId,
        referenceId: referenceId
      }
    });

  } catch (error) {
    console.error('❌ Contact error details:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('SQL:', error.sql);
    
    // Send specific error message based on the error
    let errorMessage = 'Server error. Please try again.';
    
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      errorMessage = 'Database column missing: ' + error.message;
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      errorMessage = 'Contacts table does not exist. Please contact administrator.';
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      errorMessage = 'Database access denied.';
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

// Get All Contact Requests
exports.getAllContacts = async (req, res) => {
  try {
    const sql = 'SELECT * FROM contacts ORDER BY createdAt DESC';
    const [contacts] = await pool.query(sql);
    
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get Single Contact Request
exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'SELECT * FROM contacts WHERE id = ?';
    const [contact] = await pool.query(sql, [id]);
    
    if (contact.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact request not found'
      });
    }
    
    res.json({
      success: true,
      data: contact[0]
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update Contact Status
exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const sql = 'UPDATE contacts SET status = ?, updatedAt = NOW() WHERE id = ?';
    await pool.query(sql, [status, id]);
    
    res.json({
      success: true,
      message: 'Contact status updated successfully'
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete Contact Request
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'DELETE FROM contacts WHERE id = ?';
    await pool.query(sql, [id]);
    
    res.json({
      success: true,
      message: 'Contact request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};