// // backend/src/controllers/ourClientsController.js
// const { pool } = require('../config/database');
// const path = require('path');
// const fs = require('fs');

// // Define client logo upload directory
// const CLIENTS_UPLOAD_DIR = path.join(__dirname, '../../public/our-clients');

// // Helper function to ensure directory exists
// const ensureDirectoryExists = (dirPath) => {
//   if (!fs.existsSync(dirPath)) {
//     fs.mkdirSync(dirPath, { recursive: true });
//     console.log(`📁 Created directory: ${dirPath}`);
//   }
// };

// // Helper function to sanitize filename
// const sanitizeFilename = (name) => {
//   return name
//     .toLowerCase()
//     .replace(/[^a-z0-9]/g, '-')
//     .replace(/-+/g, '-')
//     .replace(/^-|-$/g, '');
// };

// // Helper function to save client logo
// const saveClientLogo = (logoFile, clientName) => {
//   if (!logoFile || !logoFile.path) {
//     throw new Error('No logo file provided');
//   }

//   // Ensure client logos directory exists
//   ensureDirectoryExists(CLIENTS_UPLOAD_DIR);

//   const extension = path.extname(logoFile.originalname);
//   const sanitizedName = sanitizeFilename(clientName);
//   const timestamp = Date.now();
//   const fileName = `${sanitizedName}-${timestamp}${extension}`;
//   const targetPath = path.join(CLIENTS_UPLOAD_DIR, fileName);

//   // Copy file to target location
//   fs.copyFileSync(logoFile.path, targetPath);
  
//   // Delete the temp file
//   if (fs.existsSync(logoFile.path)) {
//     fs.unlinkSync(logoFile.path);
//   }

//   // Return the URL path
//   return `/our-clients/${fileName}`;
// };

// // Get all active clients (for frontend) - removed display_order
// exports.getAllClients = async (req, res) => {
//   try {
//     console.log('📋 Fetching all active clients...');
    
//     const sql = `SELECT id, client_name, logo_path, alt_text, status, 
//                         DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
//                  FROM our_clients 
//                  WHERE status = 'active'
//                  ORDER BY created_at DESC`;
    
//     const [clients] = await pool.query(sql);
    
//     console.log(`✅ Found ${clients.length} active clients`);
    
//     res.json({
//       success: true,
//       count: clients.length,
//       data: clients
//     });
//   } catch (error) {
//     console.error('❌ Error fetching clients:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error: ' + error.message
//     });
//   }
// };

// // Get all clients for admin (including inactive) - removed display_order
// exports.getAllClientsAdmin = async (req, res) => {
//   try {
//     console.log('📋 Fetching all clients for admin...');
    
//     const sql = `SELECT id, client_name, logo_path, alt_text, status, 
//                         DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
//                  FROM our_clients 
//                  ORDER BY created_at DESC`;
    
//     const [clients] = await pool.query(sql);
    
//     console.log(`✅ Found ${clients.length} total clients`);
    
//     res.json({
//       success: true,
//       count: clients.length,
//       data: clients
//     });
//   } catch (error) {
//     console.error('❌ Error fetching clients:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error: ' + error.message
//     });
//   }
// };

// // Get single client by ID
// exports.getClientById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const sql = `SELECT * FROM our_clients WHERE id = ?`;
//     const [client] = await pool.query(sql, [id]);
    
//     if (client.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Client not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       data: client[0]
//     });
//   } catch (error) {
//     console.error('Error fetching client:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// };

// // Upload client logo (Create) - removed display_order
// exports.uploadClient = async (req, res) => {
//   try {
//     const { client_name, alt_text } = req.body;
//     const logoFile = req.file;

//     console.log('📝 Client Upload Request:', { client_name, alt_text });

//     // Validation
//     if (!client_name || !logoFile) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide client name and logo image'
//       });
//     }

//     // Save client logo
//     const logoPath = saveClientLogo(logoFile, client_name);

//     // Insert into database - removed display_order
//     const sql = `INSERT INTO our_clients 
//       (client_name, logo_path, alt_text, status) 
//       VALUES (?, ?, ?, 'active')`;
    
//     const [result] = await pool.query(sql, [
//       client_name.trim(),
//       logoPath,
//       alt_text || client_name.trim()
//     ]);

//     console.log('✅ Client saved! ID:', result.insertId);
//     console.log('📸 Logo saved at:', logoPath);

//     res.status(200).json({
//       success: true,
//       message: 'Client added successfully',
//       data: {
//         id: result.insertId,
//         client_name,
//         logo_path: logoPath,
//         alt_text: alt_text || client_name
//       }
//     });

//   } catch (error) {
//     console.error('❌ Client upload error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error: ' + error.message
//     });
//   }
// };

// // Update client - removed display_order
// exports.updateClient = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { client_name, alt_text, status } = req.body;
//     const logoFile = req.file;

//     console.log('📝 Update Client Request for ID:', id);

//     // Check if client exists
//     const [existing] = await pool.query('SELECT * FROM our_clients WHERE id = ?', [id]);
//     if (existing.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Client not found'
//       });
//     }

//     // Build update query - removed display_order
//     let sql = `UPDATE our_clients SET 
//       client_name = COALESCE(?, client_name),
//       alt_text = COALESCE(?, alt_text),
//       status = COALESCE(?, status)`;
    
//     const values = [
//       client_name || null,
//       alt_text || null,
//       status || null
//     ];

//     // Add logo if provided
//     if (logoFile) {
//       const logoPath = saveClientLogo(logoFile, client_name || existing[0].client_name);
//       sql += `, logo_path = ?`;
//       values.push(logoPath);
      
//       // Delete old logo file
//       if (existing[0].logo_path) {
//         const oldLogoPath = path.join(__dirname, '../../public', existing[0].logo_path);
//         if (fs.existsSync(oldLogoPath)) {
//           fs.unlinkSync(oldLogoPath);
//           console.log('✅ Old logo deleted:', existing[0].logo_path);
//         }
//       }
      
//       console.log(`📸 New logo saved`);
//     }

//     sql += ` WHERE id = ?`;
//     values.push(id);

//     await pool.query(sql, values);

//     console.log('✅ Client updated! ID:', id);

//     res.json({
//       success: true,
//       message: 'Client updated successfully'
//     });

//   } catch (error) {
//     console.error('❌ Error updating client:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error: ' + error.message
//     });
//   }
// };

// // Delete client
// exports.deleteClient = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Get logo path to delete file
//     const [client] = await pool.query('SELECT logo_path FROM our_clients WHERE id = ?', [id]);
    
//     // Delete logo file if exists
//     if (client.length > 0 && client[0].logo_path) {
//       const logoPath = path.join(__dirname, '../../public', client[0].logo_path);
//       if (fs.existsSync(logoPath)) {
//         fs.unlinkSync(logoPath);
//         console.log('✅ Logo file deleted:', client[0].logo_path);
//       }
//     }
    
//     const sql = 'DELETE FROM our_clients WHERE id = ?';
//     await pool.query(sql, [id]);
    
//     res.json({
//       success: true,
//       message: 'Client deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting client:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// };


const { pool } = require('../config/database');
const path = require('path');
const fs = require('fs');

// Define client logo upload directory
const CLIENTS_UPLOAD_DIR = path.join(__dirname, '../../public/our-clients');

// Helper function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
};

// Helper function to sanitize filename
const sanitizeFilename = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// Helper function to save client logo
const saveClientLogo = (logoFile, clientName) => {
  if (!logoFile || !logoFile.path) {
    throw new Error('No logo file provided');
  }

  // Ensure client logos directory exists
  ensureDirectoryExists(CLIENTS_UPLOAD_DIR);

  const extension = path.extname(logoFile.originalname);
  const sanitizedName = sanitizeFilename(clientName);
  const timestamp = Date.now();
  const fileName = `${sanitizedName}-${timestamp}${extension}`;
  const targetPath = path.join(CLIENTS_UPLOAD_DIR, fileName);

  // Copy file to target location
  fs.copyFileSync(logoFile.path, targetPath);
  
  // Delete the temp file
  if (fs.existsSync(logoFile.path)) {
    fs.unlinkSync(logoFile.path);
  }

  // Return the URL path
  return `/our-clients/${fileName}`;
};

// Get all active clients (for frontend)
exports.getAllClients = async (req, res) => {
  try {
    console.log('📋 Fetching all active clients...');
    
    const sql = `SELECT id, client_name, logo_path, alt_text, status, 
                        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
                 FROM our_clients 
                 WHERE status = 'active'
                 ORDER BY created_at DESC`;
    
    const [clients] = await pool.query(sql);
    
    console.log(`✅ Found ${clients.length} active clients`);
    
    res.json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    console.error('❌ Error fetching clients:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Get all clients for admin (including inactive)
exports.getAllClientsAdmin = async (req, res) => {
  try {
    console.log('📋 Fetching all clients for admin...');
    
    const sql = `SELECT id, client_name, logo_path, alt_text, status, 
                        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
                 FROM our_clients 
                 ORDER BY created_at DESC`;
    
    const [clients] = await pool.query(sql);
    
    // Calculate counts for response
    const activeCount = clients.filter(c => c.status === 'active').length;
    const inactiveCount = clients.filter(c => c.status === 'inactive').length;
    
    console.log(`✅ Found ${clients.length} total clients (Active: ${activeCount}, Inactive: ${inactiveCount})`);
    
    res.json({
      success: true,
      count: clients.length,
      activeCount: activeCount,
      inactiveCount: inactiveCount,
      data: clients
    });
  } catch (error) {
    console.error('❌ Error fetching clients:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Get single client by ID
exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT * FROM our_clients WHERE id = ?`;
    const [client] = await pool.query(sql, [id]);
    
    if (client.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    res.json({
      success: true,
      data: client[0]
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Upload client logo (Create)
exports.uploadClient = async (req, res) => {
  try {
    const { client_name, alt_text, status } = req.body;
    const logoFile = req.file;

    console.log('📝 Client Upload Request:', { client_name, alt_text, status });

    // Validation
    if (!client_name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide client name'
      });
    }

    if (!logoFile) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a logo image'
      });
    }

    // Save client logo
    const logoPath = saveClientLogo(logoFile, client_name);

    // Set status (default to 'active' if not provided)
    const clientStatus = status || 'active';

    // Insert into database
    const sql = `INSERT INTO our_clients 
      (client_name, logo_path, alt_text, status) 
      VALUES (?, ?, ?, ?)`;
    
    const [result] = await pool.query(sql, [
      client_name.trim(),
      logoPath,
      alt_text || client_name.trim(),
      clientStatus
    ]);

    console.log('✅ Client saved! ID:', result.insertId);
    console.log('📸 Logo saved at:', logoPath);
    console.log(`📌 Status: ${clientStatus}`);

    res.status(200).json({
      success: true,
      message: 'Client added successfully',
      data: {
        id: result.insertId,
        client_name,
        logo_path: logoPath,
        alt_text: alt_text || client_name,
        status: clientStatus
      }
    });

  } catch (error) {
    console.error('❌ Client upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { client_name, alt_text, status } = req.body;
    const logoFile = req.file;

    console.log('📝 Update Client Request for ID:', id);
    console.log('Update data:', { client_name, alt_text, status, hasLogo: !!logoFile });

    // Check if client exists
    const [existing] = await pool.query('SELECT * FROM our_clients WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Build update query
    const updates = [];
    const values = [];

    if (client_name !== undefined && client_name !== existing[0].client_name) {
      updates.push('client_name = ?');
      values.push(client_name.trim());
    }
    
    if (alt_text !== undefined && alt_text !== existing[0].alt_text) {
      updates.push('alt_text = ?');
      values.push(alt_text.trim());
    }
    
    if (status !== undefined && status !== existing[0].status) {
      updates.push('status = ?');
      values.push(status);
      console.log(`🔄 Status changing from ${existing[0].status} to ${status}`);
    }

    // Handle logo update
    if (logoFile) {
      const logoPath = saveClientLogo(logoFile, client_name || existing[0].client_name);
      updates.push('logo_path = ?');
      values.push(logoPath);
      
      // Delete old logo file
      if (existing[0].logo_path) {
        const oldLogoPath = path.join(__dirname, '../../public', existing[0].logo_path);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
          console.log('✅ Old logo deleted:', existing[0].logo_path);
        }
      }
      
      console.log(`📸 New logo saved: ${logoPath}`);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No changes to update'
      });
    }

    values.push(id);
    const sql = `UPDATE our_clients SET ${updates.join(', ')} WHERE id = ?`;
    
    await pool.query(sql, values);

    console.log('✅ Client updated! ID:', id);

    res.json({
      success: true,
      message: 'Client updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating client:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Delete client
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get logo path to delete file
    const [client] = await pool.query('SELECT logo_path FROM our_clients WHERE id = ?', [id]);
    
    // Delete logo file if exists
    if (client.length > 0 && client[0].logo_path) {
      const logoPath = path.join(__dirname, '../../public', client[0].logo_path);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
        console.log('✅ Logo file deleted:', client[0].logo_path);
      }
    }
    
    const sql = 'DELETE FROM our_clients WHERE id = ?';
    await pool.query(sql, [id]);
    
    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Toggle status only (optional convenience method)
exports.toggleClientStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get current status
    const [client] = await pool.query('SELECT status FROM our_clients WHERE id = ?', [id]);
    if (client.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    const newStatus = client[0].status === 'active' ? 'inactive' : 'active';
    
    await pool.query('UPDATE our_clients SET status = ? WHERE id = ?', [newStatus, id]);
    
    console.log(`✅ Client ${id} status toggled to: ${newStatus}`);
    
    res.json({
      success: true,
      message: `Client ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      data: { id, status: newStatus }
    });
  } catch (error) {
    console.error('Error toggling client status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};