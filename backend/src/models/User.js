const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findOne(conditions) {
    try {
      let sql = 'SELECT * FROM users WHERE ';
      const values = [];
      const conditions_array = [];
      
      if (conditions.email) {
        conditions_array.push('email = ?');
        values.push(conditions.email);
      }
      if (conditions.name) {
        conditions_array.push('name = ?');
        values.push(conditions.name);
      }
      if (conditions.id) {
        conditions_array.push('id = ?');
        values.push(conditions.id);
      }
      
      if (conditions_array.length === 0) {
        return null;
      }
      
      sql += conditions_array.join(' OR ');
      
      const [rows] = await pool.query(sql, values);
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  }

  static async create(userData) {
    const { name, email, password, role = 'user' } = userData;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    
    try {
      const [result] = await pool.query(sql, [name, email, hashedPassword, role]);
      return {
        id: result.insertId,
        name,
        email,
        role
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async findById(id) {
    const sql = 'SELECT id, name, email, role, isActive, lastLogin, createdAt FROM users WHERE id = ?';
    try {
      const [rows] = await pool.query(sql, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding user by id:', error);
      return null;
    }
  }

  static async updateLastLogin(id) {
    const sql = 'UPDATE users SET lastLogin = NOW() WHERE id = ?';
    try {
      await pool.query(sql, [id]);
      return true;
    } catch (error) {
      console.error('Error updating last login:', error);
      return false;
    }
  }

  static async verifyPassword(user, password) {
    try {
      return await bcrypt.compare(password, user.password);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }
}

module.exports = User;