const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vidit_media',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// ✅ Function to create default SuperAdmin
const createDefaultSuperAdmin = async (connection) => {
  try {
    // Check if any admin exists
    const [existingAdmin] = await connection.query(
      'SELECT * FROM users WHERE role = ?',
      ['admin']
    );

    if (existingAdmin.length === 0) {
      console.log('\n👑 No admin found. Creating SuperAdmin...');
      
      // Create default SuperAdmin credentials
      const superAdminName = 'SuperAdmin';
      const superAdminEmail = 'superadmin@viditmedia.com';
      const superAdminPassword = 'SuperAdmin@123';
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
      
      // Insert SuperAdmin
      await connection.query(
        `INSERT INTO users (name, email, password, role, isActive, createdAt) 
         VALUES (?, ?, ?, 'admin', true, NOW())`,
        [superAdminName, superAdminEmail, hashedPassword]
      );
      
      console.log('\n✅ ========================================');
      console.log('✅ SUPER ADMIN CREATED SUCCESSFULLY!');
      console.log('✅ ========================================');
      console.log('📧 Email: superadmin@viditmedia.com');
      console.log('🔑 Password: SuperAdmin@123');
      console.log('👤 Name: SuperAdmin');
      console.log('========================================');
      console.log('⚠️  IMPORTANT: Please change this password after first login!');
      console.log('========================================\n');
      
      return true;
    } else {
      console.log('✅ Admin user already exists in database');
      return false;
    }
  } catch (error) {
    console.error('❌ Error creating SuperAdmin:', error.message);
    return false;
  }
};

// ✅ Function to create default test user (optional)
const createDefaultTestUser = async (connection) => {
  try {
    // Check if test user exists
    const [existingUser] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      ['user@example.com']
    );

    if (existingUser.length === 0) {
      const testUserName = 'TestUser';
      const testUserEmail = 'user@example.com';
      const testUserPassword = 'User@123';
      
      const hashedPassword = await bcrypt.hash(testUserPassword, 10);
      
      await connection.query(
        `INSERT INTO users (name, email, password, role, isActive, createdAt) 
         VALUES (?, ?, ?, 'user', true, NOW())`,
        [testUserName, testUserEmail, hashedPassword]
      );
      
      console.log('✅ Test user created successfully!');
      console.log('📧 Test Email: user@example.com');
      console.log('🔑 Test Password: User@123\n');
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error creating test user:', error.message);
    return false;
  }
};

const connectDB = async (retries = 5) => {
  let connection;
  try {
    console.log('🔌 Attempting to connect to MySQL...');
    console.log(`📊 Database: ${process.env.DB_NAME || 'vidit_media'}`);
    console.log(`👤 User: ${process.env.DB_USER || 'root'}`);
    console.log(`🌐 Host: ${process.env.DB_HOST || 'localhost'}`);
    
    connection = await pool.getConnection();
    console.log('✅ MySQL Connected Successfully');
    
    // Create database if not exists (with error handling)
    try {
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'vidit_media'}`);
      await connection.query(`USE ${process.env.DB_NAME || 'vidit_media'}`);
      console.log('✅ Database selected/created');
    } catch (dbError) {
      console.log('Database selection error:', dbError.message);
    }
    
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        isActive BOOLEAN DEFAULT true,
        lastLogin DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Users table ready');

    // Create contacts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        contact_number VARCHAR(20),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Contacts table ready');

    // Create career_applications table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS career_applications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        position VARCHAR(100) NOT NULL,
        experience VARCHAR(50),
        message TEXT,
        resume_path VARCHAR(500),
        reference_id VARCHAR(50),
        status ENUM('pending', 'reviewed', 'rejected', 'hired') DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_status (status),
        INDEX idx_reference_id (reference_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Career applications table ready');

    // Create career_hiring table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS career_hiring (
        id INT PRIMARY KEY AUTO_INCREMENT,
        position VARCHAR(100) NOT NULL,
        shift VARCHAR(50) NOT NULL,
        work_mode VARCHAR(100) NOT NULL,
        keywords TEXT NOT NULL,
        experience VARCHAR(50) NOT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_position (position),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Career hiring table ready');

    // ✅ Create default SuperAdmin (if no admin exists)
    await createDefaultSuperAdmin(connection);
    
    // ✅ Optional: Create a test user for development
    if (process.env.NODE_ENV === 'development') {
      await createDefaultTestUser(connection);
    }

    connection.release();
    return true;
    
  } catch (error) {
    console.error('❌ Database Connection Failed:');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 TROUBLESHOOTING:');
      console.error('   Check your MySQL credentials in .env file');
      console.error('   Current DB_USER:', process.env.DB_USER || 'root');
      console.error('   Make sure the password is correct');
      console.error('   Try connecting manually: mysql -u root -p');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 TROUBLESHOOTING:');
      console.error('   MySQL server is not running');
      console.error('   Start MySQL:');
      console.error('   - macOS: brew services start mysql');
      console.error('   - Linux: sudo systemctl start mysql');
      console.error('   - Windows: net start MySQL80');
      console.error('   Or check if MySQL is installed');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Creating database...');
      if (connection) connection.release();
      try {
        const tempConnection = await mysql.createConnection({
          host: process.env.DB_HOST || 'localhost',
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || '',
          port: process.env.DB_PORT || 3306
        });
        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'vidit_media'}`);
        console.log(`✅ Database ${process.env.DB_NAME || 'vidit_media'} created`);
        await tempConnection.end();
        
        if (retries > 0) {
          console.log(`🔄 Retrying connection... (${retries} attempts left)`);
          setTimeout(() => connectDB(retries - 1), 2000);
        }
        return true;
      } catch (createError) {
        console.error('Failed to create database:', createError.message);
      }
    }
    
    if (connection) connection.release();
    return false;
  }
};

module.exports = { pool, connectDB };