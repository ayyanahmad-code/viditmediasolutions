const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });

async function fixGalleryTable() {
  let connection;
  try {
    console.log('🔧 Fixing gallery table structure...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'vidit_media',
      port: process.env.DB_PORT || 3306
    });
    
    console.log('✅ Connected to database');
    
    // Check if old media_url column exists
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'gallery' AND COLUMN_NAME = 'media_url'
    `);
    
    if (columns.length > 0) {
      console.log('📝 Removing old media_url column...');
      await connection.query(`ALTER TABLE gallery DROP COLUMN media_url`);
      console.log('✅ Removed media_url column');
    }
    
    // Add media_urls column if not exists
    const [mediaUrlsColumn] = await connection.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'gallery' AND COLUMN_NAME = 'media_urls'
    `);
    
    if (mediaUrlsColumn.length === 0) {
      console.log('📝 Adding media_urls column...');
      await connection.query(`
        ALTER TABLE gallery 
        ADD COLUMN media_urls JSON NULL COMMENT 'JSON array of media URLs'
      `);
      console.log('✅ Added media_urls column');
    }
    
    // Add instagram_urls column if not exists
    const [instagramColumn] = await connection.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'gallery' AND COLUMN_NAME = 'instagram_urls'
    `);
    
    if (instagramColumn.length === 0) {
      console.log('📝 Adding instagram_urls column...');
      await connection.query(`
        ALTER TABLE gallery 
        ADD COLUMN instagram_urls JSON NULL COMMENT 'JSON array of Instagram URLs'
      `);
      console.log('✅ Added instagram_urls column');
    }
    
    // Add youtube_urls column if not exists
    const [youtubeColumn] = await connection.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'gallery' AND COLUMN_NAME = 'youtube_urls'
    `);
    
    if (youtubeColumn.length === 0) {
      console.log('📝 Adding youtube_urls column...');
      await connection.query(`
        ALTER TABLE gallery 
        ADD COLUMN youtube_urls JSON NULL COMMENT 'JSON array of YouTube URLs'
      `);
      console.log('✅ Added youtube_urls column');
    }
    
    // Update category column
    console.log('📝 Updating category column...');
    try {
      await connection.query(`
        ALTER TABLE gallery 
        MODIFY COLUMN category ENUM('images', 'event_video', 'instagram_video', 'youtube_video') NOT NULL
      `);
      console.log('✅ Updated category column');
    } catch (err) {
      console.log('Note:', err.message);
    }
    
    // Set default empty JSON arrays for NULL values
    await connection.query(`
      UPDATE gallery SET media_urls = JSON_ARRAY() WHERE media_urls IS NULL
    `);
    await connection.query(`
      UPDATE gallery SET instagram_urls = JSON_ARRAY() WHERE instagram_urls IS NULL
    `);
    await connection.query(`
      UPDATE gallery SET youtube_urls = JSON_ARRAY() WHERE youtube_urls IS NULL
    `);
    
    console.log('\n✅ Gallery table fixed successfully!');
    
    // Verify the table structure
    const [tableInfo] = await connection.query(`
      DESCRIBE gallery
    `);
    console.log('\n📋 Current gallery table structure:');
    tableInfo.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing gallery table:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

fixGalleryTable();