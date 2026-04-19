// const mysql = require('mysql2/promise');
// const bcrypt = require('bcryptjs');

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'vidit_media',
//   port: process.env.DB_PORT || 3306,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   enableKeepAlive: true,
//   keepAliveInitialDelay: 0
// });

// // ✅ Function to create default SuperAdmin
// const createDefaultSuperAdmin = async (connection) => {
//   try {
//     const [existingAdmin] = await connection.query(
//       'SELECT * FROM users WHERE role = ?',
//       ['admin']
//     );

//     if (existingAdmin.length === 0) {
//       console.log('\n👑 No admin found. Creating SuperAdmin...');
      
//       const superAdminName = 'SuperAdmin';
//       const superAdminEmail = 'superadmin@viditmedia.com';
//       const superAdminPassword = 'SuperAdmin@123';
//       const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
      
//       await connection.query(
//         `INSERT INTO users (name, email, password, role, isActive, createdAt) 
//          VALUES (?, ?, ?, 'admin', true, NOW())`,
//         [superAdminName, superAdminEmail, hashedPassword]
//       );
      
//       console.log('\n✅ ========================================');
//       console.log('✅ SUPER ADMIN CREATED SUCCESSFULLY!');
//       console.log('✅ ========================================');
//       console.log('📧 Email: superadmin@viditmedia.com');
//       console.log('🔑 Password: SuperAdmin@123');
//       console.log('👤 Name: SuperAdmin');
//       console.log('========================================');
//       console.log('⚠️  IMPORTANT: Please change this password after first login!');
//       console.log('========================================\n');
      
//       return true;
//     } else {
//       console.log('✅ Admin user already exists in database');
//       return false;
//     }
//   } catch (error) {
//     console.error('❌ Error creating SuperAdmin:', error.message);
//     return false;
//   }
// };

// // ✅ Function to create default test user
// const createDefaultTestUser = async (connection) => {
//   try {
//     const [existingUser] = await connection.query(
//       'SELECT * FROM users WHERE email = ?',
//       ['user@example.com']
//     );

//     if (existingUser.length === 0) {
//       const testUserName = 'TestUser';
//       const testUserEmail = 'user@example.com';
//       const testUserPassword = 'User@123';
//       const hashedPassword = await bcrypt.hash(testUserPassword, 10);
      
//       await connection.query(
//         `INSERT INTO users (name, email, password, role, isActive, createdAt) 
//          VALUES (?, ?, ?, 'user', true, NOW())`,
//         [testUserName, testUserEmail, hashedPassword]
//       );
      
//       console.log('✅ Test user created successfully!');
//       console.log('📧 Test Email: user@example.com');
//       console.log('🔑 Test Password: User@123\n');
      
//       return true;
//     }
//     return false;
//   } catch (error) {
//     console.error('Error creating test user:', error.message);
//     return false;
//   }
// };

// // ✅ Function to create our_clients table
// const createOurClientsTable = async (connection) => {
//   try {
//     console.log('📋 Creating our_clients table...');
    
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS our_clients (
//         id INT PRIMARY KEY AUTO_INCREMENT,
//         client_name VARCHAR(255) NOT NULL,
//         logo_path VARCHAR(500) NOT NULL,
//         alt_text VARCHAR(255),
//         status ENUM('active', 'inactive') DEFAULT 'active',
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         INDEX idx_status (status)
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
//     `);
    
//     console.log('✅ Our clients table ready');
//     return true;
//   } catch (error) {
//     console.error('❌ Error creating our_clients table:', error.message);
//     return false;
//   }
// };

// // ✅ Function to create gallery table with full support for multiple media types
// const createGalleryTable = async (connection) => {
//   try {
//     console.log('📋 Creating gallery table with multi-media support...');
    
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS gallery (
//         id INT PRIMARY KEY AUTO_INCREMENT,
//         title VARCHAR(255) NOT NULL,
//         description TEXT,
//         partner_id INT NULL,
//         category ENUM('images', 'event_video', 'instagram_video', 'youtube_video') NOT NULL,
        
//         -- Media storage (JSON arrays for multiple files/URLs)
//         media_urls JSON NULL COMMENT 'JSON array of uploaded image/video paths',
//         instagram_urls JSON NULL COMMENT 'JSON array of Instagram video URLs',
//         youtube_urls JSON NULL COMMENT 'JSON array of YouTube video URLs',
        
//         -- Additional fields
//         thumbnail_url VARCHAR(500) NULL,
//         featured BOOLEAN DEFAULT FALSE,
//         likes INT DEFAULT 0,
//         views INT DEFAULT 0,
//         status ENUM('active', 'inactive') DEFAULT 'active',
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
//         -- Indexes for performance
//         INDEX idx_category (category),
//         INDEX idx_partner_id (partner_id),
//         INDEX idx_status (status),
//         INDEX idx_featured (featured),
//         INDEX idx_created_at (created_at),
//         INDEX idx_likes (likes),
//         INDEX idx_views (views),
        
//         -- Foreign key constraint
//         FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE SET NULL
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
//     `);
    
//     console.log('✅ Gallery table created with multi-media support');
//     return true;
//   } catch (error) {
//     console.error('❌ Error creating gallery table:', error.message);
//     return false;
//   }
// };

// // ✅ Function to update existing gallery table with new columns
// const updateExistingGalleryTable = async (connection) => {
//   try {
//     console.log('📋 Updating existing gallery table...');
    
//     // Check and add instagram_urls column
//     const [instagramColumn] = await connection.query(`
//       SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
//       WHERE TABLE_NAME = 'gallery' AND COLUMN_NAME = 'instagram_urls'
//     `);
    
//     if (instagramColumn.length === 0) {
//       await connection.query(`
//         ALTER TABLE gallery 
//         ADD COLUMN instagram_urls JSON NULL COMMENT 'JSON array of Instagram video URLs'
//       `);
//       console.log('✅ Added instagram_urls column');
//     }
    
//     // Check and add youtube_urls column
//     const [youtubeColumn] = await connection.query(`
//       SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
//       WHERE TABLE_NAME = 'gallery' AND COLUMN_NAME = 'youtube_urls'
//     `);
    
//     if (youtubeColumn.length === 0) {
//       await connection.query(`
//         ALTER TABLE gallery 
//         ADD COLUMN youtube_urls JSON NULL COMMENT 'JSON array of YouTube video URLs'
//       `);
//       console.log('✅ Added youtube_urls column');
//     }
    
//     // Check and update category column to ENUM
//     const [categoryColumn] = await connection.query(`
//       SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
//       WHERE TABLE_NAME = 'gallery' AND COLUMN_NAME = 'category'
//     `);
    
//     if (categoryColumn.length > 0 && !categoryColumn[0].COLUMN_TYPE.includes('instagram_video')) {
//       await connection.query(`
//         ALTER TABLE gallery 
//         MODIFY COLUMN category ENUM('images', 'event_video', 'instagram_video', 'youtube_video') NOT NULL
//       `);
//       console.log('✅ Updated category column to support all media types');
//     }
    
//     // Check if media_urls column exists and is TEXT type
//     const [mediaUrlsColumn] = await connection.query(`
//       SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
//       WHERE TABLE_NAME = 'gallery' AND COLUMN_NAME = 'media_urls'
//     `);
    
//     if (mediaUrlsColumn.length === 0) {
//       await connection.query(`
//         ALTER TABLE gallery 
//         ADD COLUMN media_urls JSON NULL COMMENT 'JSON array of multiple media URLs'
//       `);
//       console.log('✅ Added media_urls column');
//     } else if (mediaUrlsColumn[0].DATA_TYPE !== 'json') {
//       await connection.query(`
//         ALTER TABLE gallery 
//         MODIFY COLUMN media_urls JSON NULL COMMENT 'JSON array of multiple media URLs'
//       `);
//       console.log('✅ Converted media_urls to JSON type');
//     }
    
//     return true;
//   } catch (error) {
//     console.error('❌ Error updating gallery table:', error.message);
//     return false;
//   }
// };

// // ✅ Function to create partners table
// const createPartnersTable = async (connection) => {
//   try {
//     console.log('📋 Creating partners table...');
    
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS partners (
//         id INT PRIMARY KEY AUTO_INCREMENT,
//         company_name VARCHAR(255) NOT NULL,
//         company_logo VARCHAR(500),
//         contact_person VARCHAR(100),
//         email VARCHAR(100),
//         phone VARCHAR(20),
//         address TEXT,
//         website VARCHAR(255),
//         status ENUM('active', 'inactive') DEFAULT 'active',
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         INDEX idx_company_name (company_name),
//         INDEX idx_status (status),
//         INDEX idx_email (email)
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
//     `);
    
//     console.log('✅ Partners table created successfully');
    
//     // Insert sample data if table is empty
//     const [rows] = await connection.query('SELECT COUNT(*) as count FROM partners');
//     if (rows[0].count === 0) {
//       console.log('📝 Inserting sample partner data...');
//       await connection.query(`
//         INSERT INTO partners (company_name, contact_person, email, phone, address, website, status) VALUES
//         ('Vidit Media Solutions', 'Vidit Sharma', 'vidit@viditmedia.com', '+91 9876543210', 'Mumbai, India', 'https://viditmedia.com', 'active'),
//         ('Event Planners India', 'Rajesh Kumar', 'contact@eventplannersindia.com', '+91 9876543211', 'Delhi, India', 'https://eventplannersindia.com', 'active'),
//         ('Grand Events Co.', 'Priya Singh', 'info@grandevents.com', '+91 9876543212', 'Bangalore, India', 'https://grandevents.com', 'active'),
//         ('Elite Event Management', 'Amit Patel', 'amit@eliteevents.com', '+91 9876543213', 'Pune, India', 'https://eliteevents.com', 'active'),
//         ('Royal Occasions', 'Neha Gupta', 'neha@royaloccasions.com', '+91 9876543214', 'Jaipur, India', 'https://royaloccasions.com', 'active')
//       `);
//       console.log('✅ Sample partner data inserted');
//     }
    
//     return true;
//   } catch (error) {
//     console.error('❌ Error creating partners table:', error.message);
//     return false;
//   }
// };

// // ✅ Function to create videos table
// const createVideosTable = async (connection) => {
//   try {
//     console.log('📋 Creating videos table...');
    
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS videos (
//         id INT PRIMARY KEY AUTO_INCREMENT,
//         title VARCHAR(255) NOT NULL,
//         youtube_url VARCHAR(500) NOT NULL,
//         youtube_id VARCHAR(50) NOT NULL,
//         slider_type ENUM('slider1', 'slider2') DEFAULT 'slider1',
//         status ENUM('active', 'inactive') DEFAULT 'active',
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         INDEX idx_slider_type (slider_type),
//         INDEX idx_status (status),
//         INDEX idx_youtube_id (youtube_id)
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
//     `);
    
//     console.log('✅ Videos table ready');
//     return true;
//   } catch (error) {
//     console.error('❌ Error creating videos table:', error.message);
//     return false;
//   }
// };

// // ✅ Function to create testimonials table
// const createTestimonialsTable = async (connection) => {
//   try {
//     console.log('📋 Creating testimonials table...');
    
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS testimonials (
//         id INT PRIMARY KEY AUTO_INCREMENT,
//         client_name VARCHAR(255) NOT NULL,
//         client_designation VARCHAR(255),
//         client_company VARCHAR(255),
//         testimonial_text TEXT NOT NULL,
//         client_image VARCHAR(500),
//         rating INT DEFAULT 5,
//         status ENUM('active', 'inactive') DEFAULT 'active',
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         INDEX idx_status (status),
//         INDEX idx_rating (rating)
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
//     `);
    
//     console.log('✅ Testimonials table ready');
//     return true;
//   } catch (error) {
//     console.error('❌ Error creating testimonials table:', error.message);
//     return false;
//   }
// };

// // ✅ Function to insert sample gallery data
// const insertSampleGalleryData = async (connection) => {
//   try {
//     const [rows] = await connection.query('SELECT COUNT(*) as count FROM gallery');
//     if (rows[0].count === 0) {
//       console.log('📝 Inserting sample gallery data...');
      
//       // Get partner IDs
//       const [partners] = await connection.query('SELECT id FROM partners LIMIT 5');
      
//       if (partners.length > 0) {
//         const sampleData = [
//           {
//             title: 'Corporate Event Photography',
//             description: 'Professional corporate event coverage with stunning photography',
//             partner_id: partners[0]?.id || null,
//             category: 'images',
//             media_urls: JSON.stringify(['/uploads/gallery/images/corp1.jpg', '/uploads/gallery/images/corp2.jpg']),
//             featured: true,
//             likes: 150,
//             views: 1200
//           },
//           {
//             title: 'Instagram Reels Compilation',
//             description: 'Trending Instagram reels from our recent events',
//             partner_id: partners[1]?.id || null,
//             category: 'instagram_video',
//             instagram_urls: JSON.stringify([
//               'https://www.instagram.com/reel/Cxample1',
//               'https://www.instagram.com/reel/Cxample2'
//             ]),
//             featured: true,
//             likes: 500,
//             views: 5000
//           },
//           {
//             title: 'YouTube Event Highlights',
//             description: 'Complete event coverage on YouTube',
//             partner_id: partners[2]?.id || null,
//             category: 'youtube_video',
//             youtube_urls: JSON.stringify([
//               'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
//               'https://www.youtube.com/watch?v=example2'
//             ]),
//             featured: true,
//             likes: 1000,
//             views: 10000
//           },
//           {
//             title: 'Behind the Scenes Video',
//             description: 'Behind the scenes of our event setup',
//             partner_id: partners[3]?.id || null,
//             category: 'event_video',
//             media_urls: JSON.stringify(['/uploads/gallery/videos/bts1.mp4']),
//             featured: false,
//             likes: 75,
//             views: 800
//           }
//         ];
        
//         for (const data of sampleData) {
//           await connection.query(`
//             INSERT INTO gallery 
//             (title, description, partner_id, category, media_urls, instagram_urls, youtube_urls, featured, likes, views, status) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
//           `, [
//             data.title, data.description, data.partner_id, data.category,
//             data.media_urls || null, data.instagram_urls || null, data.youtube_urls || null,
//             data.featured, data.likes, data.views
//           ]);
//         }
        
//         console.log('✅ Sample gallery data inserted');
//       }
//     }
//   } catch (error) {
//     console.error('Error inserting sample gallery data:', error.message);
//   }
// };

// // ✅ Function to update existing career_applications table with interview_scheduled status
// const updateCareerApplicationsTable = async (connection) => {
//   try {
//     console.log('📋 Updating career_applications table with interview_scheduled status...');
    
//     // Check if status column exists and update ENUM
//     const [statusColumn] = await connection.query(`
//       SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
//       WHERE TABLE_NAME = 'career_applications' AND COLUMN_NAME = 'status'
//     `);
    
//     if (statusColumn.length > 0) {
//       const currentEnum = statusColumn[0].COLUMN_TYPE;
//       // Check if interview_scheduled is already in the ENUM
//       if (!currentEnum.includes('interview_scheduled')) {
//         await connection.query(`
//           ALTER TABLE career_applications 
//           MODIFY COLUMN status ENUM('pending', 'reviewed', 'interview_scheduled', 'rejected', 'hired') 
//           DEFAULT 'pending'
//         `);
//         console.log('✅ Updated status ENUM to include interview_scheduled');
//       } else {
//         console.log('✅ interview_scheduled already exists in status ENUM');
//       }
//     }
    
//     // Add interview scheduling columns if they don't exist
//     const [columns] = await connection.query(`
//       SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
//       WHERE TABLE_NAME = 'career_applications'
//     `);
    
//     const columnNames = columns.map(col => col.COLUMN_NAME);
    
//     if (!columnNames.includes('interview_scheduled')) {
//       await connection.query(`
//         ALTER TABLE career_applications 
//         ADD COLUMN interview_scheduled BOOLEAN DEFAULT FALSE
//       `);
//       console.log('✅ Added interview_scheduled column');
//     }
    
//     if (!columnNames.includes('interview_date')) {
//       await connection.query(`
//         ALTER TABLE career_applications 
//         ADD COLUMN interview_date DATE NULL
//       `);
//       console.log('✅ Added interview_date column');
//     }
    
//     if (!columnNames.includes('interview_time')) {
//       await connection.query(`
//         ALTER TABLE career_applications 
//         ADD COLUMN interview_time TIME NULL
//       `);
//       console.log('✅ Added interview_time column');
//     }
    
//     if (!columnNames.includes('interview_mode')) {
//       await connection.query(`
//         ALTER TABLE career_applications 
//         ADD COLUMN interview_mode VARCHAR(50) NULL
//       `);
//       console.log('✅ Added interview_mode column');
//     }
    
//     if (!columnNames.includes('interview_notes')) {
//       await connection.query(`
//         ALTER TABLE career_applications 
//         ADD COLUMN interview_notes TEXT NULL
//       `);
//       console.log('✅ Added interview_notes column');
//     }
    
//     console.log('✅ Career applications table updated successfully with interview scheduling support');
//     return true;
//   } catch (error) {
//     console.error('❌ Error updating career_applications table:', error.message);
//     return false;
//   }
// };

// // Main connection function
// const connectDB = async (retries = 5) => {
//   let connection;
//   try {
//     console.log('🔌 Attempting to connect to MySQL...');
//     console.log(`📊 Database: ${process.env.DB_NAME || 'vidit_media'}`);
//     console.log(`👤 User: ${process.env.DB_USER || 'root'}`);
//     console.log(`🌐 Host: ${process.env.DB_HOST || 'localhost'}`);
    
//     connection = await pool.getConnection();
//     console.log('✅ MySQL Connected Successfully');
    
//     // Create database if not exists
//     try {
//       await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'vidit_media'}`);
//       await connection.query(`USE ${process.env.DB_NAME || 'vidit_media'}`);
//       console.log('✅ Database selected/created');
//     } catch (dbError) {
//       console.log('Database selection error:', dbError.message);
//     }
    
//     // Create users table
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id INT PRIMARY KEY AUTO_INCREMENT,
//         name VARCHAR(50) NOT NULL UNIQUE,
//         email VARCHAR(100) NOT NULL UNIQUE,
//         password VARCHAR(255) NOT NULL,
//         role ENUM('user', 'admin') DEFAULT 'user',
//         isActive BOOLEAN DEFAULT true,
//         lastLogin DATETIME,
//         createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//         updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         INDEX idx_email (email),
//         INDEX idx_name (name),
//         INDEX idx_role (role)
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
//     `);
//     console.log('✅ Users table ready');

//     // Create contacts table
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS contacts (
//         id INT PRIMARY KEY AUTO_INCREMENT,
//         name VARCHAR(100) NOT NULL,
//         email VARCHAR(100) NOT NULL,
//         contact_number VARCHAR(20),
//         subject VARCHAR(255),
//         message TEXT NOT NULL,
//         status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
//         createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//         updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         INDEX idx_email (email),
//         INDEX idx_status (status)
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
//     `);
//     console.log('✅ Contacts table ready');

//   // Create career_applications table with interview_scheduled and pan_card support
// await connection.query(`
//   CREATE TABLE IF NOT EXISTS career_applications (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     name VARCHAR(100) NOT NULL,
//     pan_card VARCHAR(20) NULL,
//     email VARCHAR(100) NOT NULL,
//     phone VARCHAR(20),
//     position VARCHAR(100) NOT NULL,
//     experience VARCHAR(50),
//     message TEXT,
//     resume_path VARCHAR(500),
//     reference_id VARCHAR(50),
//     status ENUM('pending', 'reviewed', 'interview_scheduled', 'rejected', 'hired') DEFAULT 'pending',
//     interview_scheduled BOOLEAN DEFAULT FALSE,
//     interview_date DATE NULL,
//     interview_time TIME NULL,
//     interview_mode VARCHAR(50) NULL,
//     interview_notes TEXT NULL,
//     createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     INDEX idx_email (email),
//     INDEX idx_status (status),
//     INDEX idx_reference_id (reference_id),
//     INDEX idx_pan_card (pan_card),
//     INDEX idx_createdAt (createdAt)
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
// `);
// console.log('✅ Career applications table with interview scheduling and PAN card ready');

// // Add function to update existing table with pan_card
// const updateCareerApplicationsTable = async (connection) => {
//   try {
//     console.log('📋 Updating career_applications table with interview_scheduled and pan_card...');
    
//     // Check if pan_card column exists
//     const [panCardColumn] = await connection.query(`
//       SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
//       WHERE TABLE_NAME = 'career_applications' AND COLUMN_NAME = 'pan_card'
//     `);
    
//     if (panCardColumn.length === 0) {
//       await connection.query(`
//         ALTER TABLE career_applications 
//         ADD COLUMN pan_card VARCHAR(20) NULL AFTER name,
//         ADD INDEX idx_pan_card (pan_card)
//       `);
//       console.log('✅ Added pan_card column');
//     }
    
//     // Check if status column exists and update ENUM
//     const [statusColumn] = await connection.query(`
//       SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
//       WHERE TABLE_NAME = 'career_applications' AND COLUMN_NAME = 'status'
//     `);
    
//     if (statusColumn.length > 0) {
//       const currentEnum = statusColumn[0].COLUMN_TYPE;
//       if (!currentEnum.includes('interview_scheduled')) {
//         await connection.query(`
//           ALTER TABLE career_applications 
//           MODIFY COLUMN status ENUM('pending', 'reviewed', 'interview_scheduled', 'rejected', 'hired') 
//           DEFAULT 'pending'
//         `);
//         console.log('✅ Updated status ENUM to include interview_scheduled');
//       }
//     }
    
//     // Add interview scheduling columns if they don't exist
//     const [columns] = await connection.query(`
//       SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
//       WHERE TABLE_NAME = 'career_applications'
//     `);
    
//     const columnNames = columns.map(col => col.COLUMN_NAME);
    
//     if (!columnNames.includes('interview_scheduled')) {
//       await connection.query(`ALTER TABLE career_applications ADD COLUMN interview_scheduled BOOLEAN DEFAULT FALSE`);
//       console.log('✅ Added interview_scheduled column');
//     }
    
//     if (!columnNames.includes('interview_date')) {
//       await connection.query(`ALTER TABLE career_applications ADD COLUMN interview_date DATE NULL`);
//       console.log('✅ Added interview_date column');
//     }
    
//     if (!columnNames.includes('interview_time')) {
//       await connection.query(`ALTER TABLE career_applications ADD COLUMN interview_time TIME NULL`);
//       console.log('✅ Added interview_time column');
//     }
    
//     if (!columnNames.includes('interview_mode')) {
//       await connection.query(`ALTER TABLE career_applications ADD COLUMN interview_mode VARCHAR(50) NULL`);
//       console.log('✅ Added interview_mode column');
//     }
    
//     if (!columnNames.includes('interview_notes')) {
//       await connection.query(`ALTER TABLE career_applications ADD COLUMN interview_notes TEXT NULL`);
//       console.log('✅ Added interview_notes column');
//     }
    
//     console.log('✅ Career applications table updated successfully');
//     return true;
//   } catch (error) {
//     console.error('❌ Error updating career_applications table:', error.message);
//     return false;
//   }
// };

//     // Create career_hiring table
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS career_hiring (
//         id INT PRIMARY KEY AUTO_INCREMENT,
//         position VARCHAR(100) NOT NULL,
//         shift VARCHAR(50) NOT NULL,
//         work_mode VARCHAR(100) NOT NULL,
//         keywords TEXT NOT NULL,
//         experience VARCHAR(50) NOT NULL,
//         status ENUM('active', 'inactive') DEFAULT 'active',
//         message TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         INDEX idx_position (position),
//         INDEX idx_status (status)
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
//     `);
//     console.log('✅ Career hiring table ready');

//     // ✅ CREATE VISITORS TABLE
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS visitors (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         ip VARCHAR(50) UNIQUE,
//         city VARCHAR(100),
//         country VARCHAR(100),
//         is_online BOOLEAN DEFAULT TRUE,
//         last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         INDEX idx_ip (ip),
//         INDEX idx_online (is_online)
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
//     `);
//     console.log('✅ Visitors table ready');

//     // Create videos table
//     await createVideosTable(connection);
    
//     // Create our_clients table
//     await createOurClientsTable(connection);
    
//     // Create testimonials table
//     await createTestimonialsTable(connection);
    
//     // Create partners table (MUST be before creating gallery table)
//     await createPartnersTable(connection);
    
//     // Create gallery table with all new columns
//     await createGalleryTable(connection);
    
//     // Update existing gallery table if needed (for existing databases)
//     await updateExistingGalleryTable(connection);
    
//     // Update career_applications table for existing databases
//     await updateCareerApplicationsTable(connection);
    
//     // Insert sample gallery data
//     await insertSampleGalleryData(connection);
    
//     // Create default SuperAdmin
//     await createDefaultSuperAdmin(connection);
    
//     // Create test user for development
//     if (process.env.NODE_ENV === 'development') {
//       await createDefaultTestUser(connection);
//     }

//     // Insert sample data for our_clients (if table is empty)
//     const [clientCount] = await connection.query('SELECT COUNT(*) as count FROM our_clients');
//     if (clientCount[0].count === 0) {
//       console.log('📝 Inserting sample client data...');
//       await connection.query(`
//         INSERT INTO our_clients (client_name, logo_path, alt_text, status) VALUES
//         ('Google', '/our-clients/google.png', 'Google Logo', 'active'),
//         ('Microsoft', '/our-clients/microsoft.png', 'Microsoft Logo', 'active'),
//         ('Amazon', '/our-clients/amazon.png', 'Amazon Logo', 'active'),
//         ('Facebook', '/our-clients/facebook.png', 'Facebook Logo', 'active'),
//         ('Apple', '/our-clients/apple.png', 'Apple Logo', 'active')
//       `);
//       console.log('✅ Sample client data inserted');
//     }

//     // Insert sample testimonials (if table is empty)
//     const [testimonialCount] = await connection.query('SELECT COUNT(*) as count FROM testimonials');
//     if (testimonialCount[0].count === 0) {
//       console.log('📝 Inserting sample testimonials...');
//       await connection.query(`
//         INSERT INTO testimonials (client_name, client_designation, client_company, testimonial_text, rating, status) VALUES
//         ('Rajesh Sharma', 'CEO', 'Tech Solutions Inc.', 'Excellent service! The team at Vidit Media delivered beyond our expectations.', 5, 'active'),
//         ('Priya Mehta', 'Marketing Head', 'Creative Agency', 'Professional and creative. Highly recommended for event coverage.', 5, 'active'),
//         ('Amit Patel', 'Event Coordinator', 'Grand Events Co.', 'Great experience working with them. Very responsive and talented.', 4, 'active')
//       `);
//       console.log('✅ Sample testimonials inserted');
//     }

//     connection.release();
//     console.log('\n🎉 Database setup completed successfully!');
//     console.log('📊 Career Applications Statuses:');
//     console.log('   - pending');
//     console.log('   - reviewed');
//     console.log('   - interview_scheduled (NEW!)');
//     console.log('   - rejected');
//     console.log('   - hired');
//     console.log('\n📊 Gallery supports:');
//     console.log('   - Multiple image uploads');
//     console.log('   - Multiple video uploads');
//     console.log('   - Multiple Instagram URLs');
//     console.log('   - Multiple YouTube URLs');
//     console.log('\n✅ Ready to accept requests\n');
//     return true;
    
//   } catch (error) {
//     console.error('❌ Database Connection Failed:');
//     console.error('Error Code:', error.code);
//     console.error('Error Message:', error.message);
    
//     if (error.code === 'ER_ACCESS_DENIED_ERROR') {
//       console.error('\n💡 TROUBLESHOOTING:');
//       console.error('   Check your MySQL credentials in .env file');
//       console.error('   Current DB_USER:', process.env.DB_USER || 'root');
//       console.error('   Make sure the password is correct');
//       console.error('   Try connecting manually: mysql -u root -p');
//     } else if (error.code === 'ECONNREFUSED') {
//       console.error('\n💡 TROUBLESHOOTING:');
//       console.error('   MySQL server is not running');
//       console.error('   Start MySQL:');
//       console.error('   - macOS: brew services start mysql');
//       console.error('   - Linux: sudo systemctl start mysql');
//       console.error('   - Windows: net start MySQL80');
//       console.error('   Or check if MySQL is installed');
//     } else if (error.code === 'ER_BAD_DB_ERROR') {
//       console.error('\n💡 Creating database...');
//       if (connection) connection.release();
//       try {
//         const tempConnection = await mysql.createConnection({
//           host: process.env.DB_HOST || 'localhost',
//           user: process.env.DB_USER || 'root',
//           password: process.env.DB_PASSWORD || '',
//           port: process.env.DB_PORT || 3306
//         });
//         await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'vidit_media'}`);
//         console.log(`✅ Database ${process.env.DB_NAME || 'vidit_media'} created`);
//         await tempConnection.end();
        
//         if (retries > 0) {
//           console.log(`🔄 Retrying connection... (${retries} attempts left)`);
//           setTimeout(() => connectDB(retries - 1), 2000);
//         }
//         return true;
//       } catch (createError) {
//         console.error('Failed to create database:', createError.message);
//       }
//     }
    
//     if (connection) connection.release();
//     return false;
//   }
// };

// module.exports = { pool, connectDB };



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
    const [existingAdmin] = await connection.query(
      'SELECT * FROM users WHERE role = ?',
      ['admin']
    );

    if (existingAdmin.length === 0) {
      console.log('\n👑 No admin found. Creating SuperAdmin...');
      
      const superAdminName = 'SuperAdmin';
      const superAdminEmail = 'superadmin@viditmedia.com';
      const superAdminPassword = 'SuperAdmin@123';
      const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
      
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

// ✅ Function to create default test user
const createDefaultTestUser = async (connection) => {
  try {
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

// ✅ Function to create our_clients table
const createOurClientsTable = async (connection) => {
  try {
    console.log('📋 Creating our_clients table...');
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS our_clients (
        id INT PRIMARY KEY AUTO_INCREMENT,
        client_name VARCHAR(255) NOT NULL,
        logo_path VARCHAR(500) NOT NULL,
        alt_text VARCHAR(255),
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✅ Our clients table ready');
    return true;
  } catch (error) {
    console.error('❌ Error creating our_clients table:', error.message);
    return false;
  }
};

// ✅ Function to create gallery table with full support for multiple media types
const createGalleryTable = async (connection) => {
  try {
    console.log('📋 Creating gallery table with multi-media support...');
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        partner_id INT NULL,
        category ENUM('images', 'event_video', 'instagram_video', 'youtube_video') NOT NULL,
        
        -- Media storage (JSON arrays for multiple files/URLs)
        media_urls JSON NULL COMMENT 'JSON array of uploaded image/video paths',
        instagram_urls JSON NULL COMMENT 'JSON array of Instagram video URLs',
        youtube_urls JSON NULL COMMENT 'JSON array of YouTube video URLs',
        
        -- Additional fields
        thumbnail_url VARCHAR(500) NULL,
        featured BOOLEAN DEFAULT FALSE,
        likes INT DEFAULT 0,
        views INT DEFAULT 0,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        -- Indexes for performance
        INDEX idx_category (category),
        INDEX idx_partner_id (partner_id),
        INDEX idx_status (status),
        INDEX idx_featured (featured),
        INDEX idx_created_at (created_at),
        INDEX idx_likes (likes),
        INDEX idx_views (views),
        
        -- Foreign key constraint
        FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✅ Gallery table created with multi-media support');
    return true;
  } catch (error) {
    console.error('❌ Error creating gallery table:', error.message);
    return false;
  }
};

// ✅ Function to update existing gallery table with new columns
const updateExistingGalleryTable = async (connection) => {
  try {
    console.log('📋 Updating existing gallery table...');
    
    // Check and add instagram_urls column
    const [instagramColumn] = await connection.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'gallery' AND COLUMN_NAME = 'instagram_urls'
    `);
    
    if (instagramColumn.length === 0) {
      await connection.query(`
        ALTER TABLE gallery 
        ADD COLUMN instagram_urls JSON NULL COMMENT 'JSON array of Instagram video URLs'
      `);
      console.log('✅ Added instagram_urls column');
    }
    
    // Check and add youtube_urls column
    const [youtubeColumn] = await connection.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'gallery' AND COLUMN_NAME = 'youtube_urls'
    `);
    
    if (youtubeColumn.length === 0) {
      await connection.query(`
        ALTER TABLE gallery 
        ADD COLUMN youtube_urls JSON NULL COMMENT 'JSON array of YouTube video URLs'
      `);
      console.log('✅ Added youtube_urls column');
    }
    
    // Check and update category column to ENUM
    const [categoryColumn] = await connection.query(`
      SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'gallery' AND COLUMN_NAME = 'category'
    `);
    
    if (categoryColumn.length > 0 && !categoryColumn[0].COLUMN_TYPE.includes('instagram_video')) {
      await connection.query(`
        ALTER TABLE gallery 
        MODIFY COLUMN category ENUM('images', 'event_video', 'instagram_video', 'youtube_video') NOT NULL
      `);
      console.log('✅ Updated category column to support all media types');
    }
    
    // Check if media_urls column exists and is TEXT type
    const [mediaUrlsColumn] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'gallery' AND COLUMN_NAME = 'media_urls'
    `);
    
    if (mediaUrlsColumn.length === 0) {
      await connection.query(`
        ALTER TABLE gallery 
        ADD COLUMN media_urls JSON NULL COMMENT 'JSON array of multiple media URLs'
      `);
      console.log('✅ Added media_urls column');
    } else if (mediaUrlsColumn[0].DATA_TYPE !== 'json') {
      await connection.query(`
        ALTER TABLE gallery 
        MODIFY COLUMN media_urls JSON NULL COMMENT 'JSON array of multiple media URLs'
      `);
      console.log('✅ Converted media_urls to JSON type');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error updating gallery table:', error.message);
    return false;
  }
};

// ✅ Function to create partners table
const createPartnersTable = async (connection) => {
  try {
    console.log('📋 Creating partners table...');
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS partners (
        id INT PRIMARY KEY AUTO_INCREMENT,
        company_name VARCHAR(255) NOT NULL,
        company_logo VARCHAR(500),
        contact_person VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(20),
        address TEXT,
        website VARCHAR(255),
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_company_name (company_name),
        INDEX idx_status (status),
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✅ Partners table created successfully');
    
    // Insert sample data if table is empty
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM partners');
    if (rows[0].count === 0) {
      console.log('📝 Inserting sample partner data...');
      await connection.query(`
        INSERT INTO partners (company_name, contact_person, email, phone, address, website, status) VALUES
        ('Vidit Media Solutions', 'Vidit Sharma', 'vidit@viditmedia.com', '+91 9876543210', 'Mumbai, India', 'https://viditmedia.com', 'active'),
        ('Event Planners India', 'Rajesh Kumar', 'contact@eventplannersindia.com', '+91 9876543211', 'Delhi, India', 'https://eventplannersindia.com', 'active'),
        ('Grand Events Co.', 'Priya Singh', 'info@grandevents.com', '+91 9876543212', 'Bangalore, India', 'https://grandevents.com', 'active'),
        ('Elite Event Management', 'Amit Patel', 'amit@eliteevents.com', '+91 9876543213', 'Pune, India', 'https://eliteevents.com', 'active'),
        ('Royal Occasions', 'Neha Gupta', 'neha@royaloccasions.com', '+91 9876543214', 'Jaipur, India', 'https://royaloccasions.com', 'active')
      `);
      console.log('✅ Sample partner data inserted');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error creating partners table:', error.message);
    return false;
  }
};

// ✅ Function to create videos table
const createVideosTable = async (connection) => {
  try {
    console.log('📋 Creating videos table...');
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        youtube_url VARCHAR(500) NOT NULL,
        youtube_id VARCHAR(50) NOT NULL,
        slider_type ENUM('slider1', 'slider2') DEFAULT 'slider1',
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slider_type (slider_type),
        INDEX idx_status (status),
        INDEX idx_youtube_id (youtube_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✅ Videos table ready');
    return true;
  } catch (error) {
    console.error('❌ Error creating videos table:', error.message);
    return false;
  }
};

// ✅ Function to create testimonials table
const createTestimonialsTable = async (connection) => {
  try {
    console.log('📋 Creating testimonials table...');
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT PRIMARY KEY AUTO_INCREMENT,
        client_name VARCHAR(255) NOT NULL,
        client_designation VARCHAR(255),
        client_company VARCHAR(255),
        testimonial_text TEXT NOT NULL,
        client_image VARCHAR(500),
        rating INT DEFAULT 5,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_rating (rating)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✅ Testimonials table ready');
    return true;
  } catch (error) {
    console.error('❌ Error creating testimonials table:', error.message);
    return false;
  }
};

// ✅ Function to insert sample gallery data
const insertSampleGalleryData = async (connection) => {
  try {
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM gallery');
    if (rows[0].count === 0) {
      console.log('📝 Inserting sample gallery data...');
      
      // Get partner IDs
      const [partners] = await connection.query('SELECT id FROM partners LIMIT 5');
      
      if (partners.length > 0) {
        const sampleData = [
          {
            title: 'Corporate Event Photography',
            description: 'Professional corporate event coverage with stunning photography',
            partner_id: partners[0]?.id || null,
            category: 'images',
            media_urls: JSON.stringify(['/uploads/gallery/images/corp1.jpg', '/uploads/gallery/images/corp2.jpg']),
            featured: true,
            likes: 150,
            views: 1200
          },
          {
            title: 'Instagram Reels Compilation',
            description: 'Trending Instagram reels from our recent events',
            partner_id: partners[1]?.id || null,
            category: 'instagram_video',
            instagram_urls: JSON.stringify([
              'https://www.instagram.com/reel/Cxample1',
              'https://www.instagram.com/reel/Cxample2'
            ]),
            featured: true,
            likes: 500,
            views: 5000
          },
          {
            title: 'YouTube Event Highlights',
            description: 'Complete event coverage on YouTube',
            partner_id: partners[2]?.id || null,
            category: 'youtube_video',
            youtube_urls: JSON.stringify([
              'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              'https://www.youtube.com/watch?v=example2'
            ]),
            featured: true,
            likes: 1000,
            views: 10000
          },
          {
            title: 'Behind the Scenes Video',
            description: 'Behind the scenes of our event setup',
            partner_id: partners[3]?.id || null,
            category: 'event_video',
            media_urls: JSON.stringify(['/uploads/gallery/videos/bts1.mp4']),
            featured: false,
            likes: 75,
            views: 800
          }
        ];
        
        for (const data of sampleData) {
          await connection.query(`
            INSERT INTO gallery 
            (title, description, partner_id, category, media_urls, instagram_urls, youtube_urls, featured, likes, views, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
          `, [
            data.title, data.description, data.partner_id, data.category,
            data.media_urls || null, data.instagram_urls || null, data.youtube_urls || null,
            data.featured, data.likes, data.views
          ]);
        }
        
        console.log('✅ Sample gallery data inserted');
      }
    }
  } catch (error) {
    console.error('Error inserting sample gallery data:', error.message);
  }
};

// Main connection function
const connectDB = async (retries = 5) => {
  let connection;
  try {
    console.log('🔌 Attempting to connect to MySQL...');
    console.log(`📊 Database: ${process.env.DB_NAME || 'vidit_media'}`);
    console.log(`👤 User: ${process.env.DB_USER || 'root'}`);
    console.log(`🌐 Host: ${process.env.DB_HOST || 'localhost'}`);
    
    connection = await pool.getConnection();
    console.log('✅ MySQL Connected Successfully');
    
    // Create database if not exists
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
        INDEX idx_name (name),
        INDEX idx_role (role)
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

    // Create career_applications table - SIMPLIFIED SINGLE TABLE
    await connection.query(`
      CREATE TABLE IF NOT EXISTS career_applications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        pan_card VARCHAR(20) NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        position VARCHAR(100) NOT NULL,
        experience VARCHAR(50),
        message TEXT,
        resume_path VARCHAR(500),
        status ENUM('pending', 'reviewed', 'interview_scheduled', 'rejected', 'hired') DEFAULT 'pending',
        interview_date DATETIME NULL COMMENT 'Current interview date and time',
        reschedule_count INT DEFAULT 0,
        reschedule_history JSON NULL COMMENT 'Stores all reschedule attempts with dates and times',
        original_interview_date DATETIME NULL COMMENT 'First scheduled interview date',
        hired_at DATETIME NULL,
        rejected_at DATETIME NULL,
        rejection_reason TEXT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_status (status),
        INDEX idx_pan_card (pan_card),
        INDEX idx_created_at (created_at),
        INDEX idx_interview_date (interview_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Career applications table created with simplified structure');

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

    // Create visitors table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS visitors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ip VARCHAR(50) UNIQUE,
        city VARCHAR(100),
        country VARCHAR(100),
        is_online BOOLEAN DEFAULT TRUE,
        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_ip (ip),
        INDEX idx_online (is_online)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Visitors table ready');

    // Create videos table
    await createVideosTable(connection);
    
    // Create our_clients table
    await createOurClientsTable(connection);
    
    // Create testimonials table
    await createTestimonialsTable(connection);
    
    // Create partners table (MUST be before creating gallery table)
    await createPartnersTable(connection);
    
    // Create gallery table with all new columns
    await createGalleryTable(connection);
    
    // Update existing gallery table if needed (for existing databases)
    await updateExistingGalleryTable(connection);
    
    // Insert sample gallery data
    await insertSampleGalleryData(connection);
    
    // Create default SuperAdmin
    await createDefaultSuperAdmin(connection);
    
    // Create test user for development
    if (process.env.NODE_ENV === 'development') {
      await createDefaultTestUser(connection);
    }

    // Insert sample data for our_clients (if table is empty)
    const [clientCount] = await connection.query('SELECT COUNT(*) as count FROM our_clients');
    if (clientCount[0].count === 0) {
      console.log('📝 Inserting sample client data...');
      await connection.query(`
        INSERT INTO our_clients (client_name, logo_path, alt_text, status) VALUES
        ('Google', '/our-clients/google.png', 'Google Logo', 'active'),
        ('Microsoft', '/our-clients/microsoft.png', 'Microsoft Logo', 'active'),
        ('Amazon', '/our-clients/amazon.png', 'Amazon Logo', 'active'),
        ('Facebook', '/our-clients/facebook.png', 'Facebook Logo', 'active'),
        ('Apple', '/our-clients/apple.png', 'Apple Logo', 'active')
      `);
      console.log('✅ Sample client data inserted');
    }

    // Insert sample testimonials (if table is empty)
    const [testimonialCount] = await connection.query('SELECT COUNT(*) as count FROM testimonials');
    if (testimonialCount[0].count === 0) {
      console.log('📝 Inserting sample testimonials...');
      await connection.query(`
        INSERT INTO testimonials (client_name, client_designation, client_company, testimonial_text, rating, status) VALUES
        ('Rajesh Sharma', 'CEO', 'Tech Solutions Inc.', 'Excellent service! The team at Vidit Media delivered beyond our expectations.', 5, 'active'),
        ('Priya Mehta', 'Marketing Head', 'Creative Agency', 'Professional and creative. Highly recommended for event coverage.', 5, 'active'),
        ('Amit Patel', 'Event Coordinator', 'Grand Events Co.', 'Great experience working with them. Very responsive and talented.', 4, 'active')
      `);
      console.log('✅ Sample testimonials inserted');
    }

    connection.release();
    console.log('\n🎉 Database setup completed successfully!');
    console.log('📊 Career Applications Table Structure:');
    console.log('   - Single table design');
    console.log('   - interview_date: DATETIME (combined date and time)');
    console.log('   - reschedule_count: tracks number of reschedules');
    console.log('   - reschedule_history: JSON array of all reschedule attempts');
    console.log('   - original_interview_date: first scheduled date');
    console.log('\n📊 Gallery supports:');
    console.log('   - Multiple image uploads');
    console.log('   - Multiple video uploads');
    console.log('   - Multiple Instagram URLs');
    console.log('   - Multiple YouTube URLs');
    console.log('\n✅ Ready to accept requests\n');
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