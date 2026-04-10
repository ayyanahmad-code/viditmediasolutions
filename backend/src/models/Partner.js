// backend/src/models/Partner.js
const { pool } = require('../config/database');

class Partner {
  // Get all active partners
  static async getAllActive() {
    try {
      const [rows] = await pool.query(
        'SELECT id, company_name, company_logo, contact_person, email, phone, address, website FROM partners WHERE status = "active" ORDER BY company_name'
      );
      return rows;
    } catch (error) {
      console.error('Error getting active partners:', error);
      throw error;
    }
  }

  // Get all partners (including inactive)
  static async getAll() {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM partners ORDER BY company_name'
      );
      return rows;
    } catch (error) {
      console.error('Error getting all partners:', error);
      throw error;
    }
  }

  // Get partner by ID
  static async getById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM partners WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Error getting partner by ID:', error);
      throw error;
    }
  }

  // Create new partner
  static async create(partnerData) {
    try {
      const { company_name, contact_person, email, phone, address, website, company_logo } = partnerData;
      
      const [result] = await pool.query(
        `INSERT INTO partners (company_name, contact_person, email, phone, address, website, company_logo, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
        [company_name, contact_person || null, email || null, phone || null, address || null, website || null, company_logo || null]
      );
      
      return result.insertId;
    } catch (error) {
      console.error('Error creating partner:', error);
      throw error;
    }
  }

  // Update partner
  static async update(id, partnerData) {
    try {
      const { company_name, contact_person, email, phone, address, website, status } = partnerData;
      
      const [result] = await pool.query(
        `UPDATE partners 
         SET company_name = ?, contact_person = ?, email = ?, phone = ?, 
             address = ?, website = ?, status = ?, updated_at = NOW()
         WHERE id = ?`,
        [company_name, contact_person, email, phone, address, website, status, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating partner:', error);
      throw error;
    }
  }

  // Delete partner (soft delete)
  static async delete(id) {
    try {
      const [result] = await pool.query(
        'UPDATE partners SET status = "inactive" WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting partner:', error);
      throw error;
    }
  }

  // Search partners
  static async search(searchTerm) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM partners 
         WHERE company_name LIKE ? OR contact_person LIKE ? OR email LIKE ? 
         AND status = 'active' 
         ORDER BY company_name`,
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
      );
      return rows;
    } catch (error) {
      console.error('Error searching partners:', error);
      throw error;
    }
  }
}

module.exports = Partner;