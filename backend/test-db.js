require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('Testing database connection...');
  console.log('DB Config:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD ? '******' : 'not set'
  });

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'viditmedia'
    });

    console.log('✅ Database connected successfully!');
    
    // Test query
    const [result] = await connection.query('SELECT 1 as test');
    console.log('✅ Test query successful:', result);
    
    // Check visitors table
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📊 Tables in database:', tables);
    
    // Check visitors table structure
    const [columns] = await connection.query('DESCRIBE visitors');
    console.log('📋 Visitors table structure:', columns);
    
    // Check existing visitors
    const [visitors] = await connection.query('SELECT * FROM visitors LIMIT 5');
    console.log('👥 Existing visitors:', visitors);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();