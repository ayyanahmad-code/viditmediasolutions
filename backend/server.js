// // server.js
// require('dotenv').config();
// const app = require('./src/app');
// const { connectDB } = require('./src/config/database');
// const emailService = require('./src/utils/emailService');

// const PORT = process.env.PORT || 5000;

// // Verify JWT Secret
// if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_super_secret_key_change_this_123456789') {
//   console.warn('⚠️  WARNING: Using default JWT_SECRET. Please change this in production!');
// }

// // Start server
// const startServer = async () => {
//   console.log('🚀 Starting server...');
  
//   // Connect to database
//   const dbConnected = await connectDB();
  
//   if (!dbConnected) {
//     console.error('❌ Failed to connect to database');
//     console.error('💡 Please check:');
//     console.error('   1. MySQL is installed and running');
//     console.error('   2. Database credentials in .env file are correct');
//     console.error('   3. Database name exists or can be created');
//     process.exit(1);
//   }

//   // Test email configuration
//   if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
//     const emailReady = await emailService.testConnection();
//     if (emailReady) {
//       console.log('✅ Email service configured and ready');
//     } else {
//       console.warn('⚠️  Email service not configured properly. Emails will not be sent.');
//       console.warn('   To enable emails, add EMAIL_USER and EMAIL_PASSWORD to .env');
//     }
//   } else {
//     console.warn('⚠️  Email service not configured. Add EMAIL_USER and EMAIL_PASSWORD to .env to enable emails');
//   }

//   // Start HTTP server
//   const server = app.listen(PORT, () => {
//     console.log(`\n✅ Server is running!`);
//     console.log(`📍 URL: http://localhost:${PORT}`);
//     console.log(`🔑 Health check: http://localhost:${PORT}/health`);
//     console.log(`📝 API endpoints:`);
//     console.log(`   POST   /api/auth/register`);
//     console.log(`   POST   /api/auth/login`);
//     console.log(`   GET    /api/auth/me`);
//     console.log(`   POST   /api/contact`);
//     console.log(`   POST   /api/career/apply`);
//     console.log(`   POST   /api/career-hiring/create`);
//     console.log(`   GET    /api/career-hiring/test`);
//     console.log(`   GET    /api/career-hiring/all`);
//     console.log(`\n✨ Ready to accept requests\n`);
//   });

//   // Handle graceful shutdown
//   const gracefulShutdown = () => {
//     console.log('\n🛑 Received shutdown signal');
//     server.close(() => {
//       console.log('✅ Server closed');
//       process.exit(0);
//     });
//   };

//   process.on('SIGTERM', gracefulShutdown);
//   process.on('SIGINT', gracefulShutdown);
// };

// startServer();


require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/database');
const http = require("http");
const { Server } = require("socket.io");
const { setOffline, getOnlineUsers } = require('./src/models/visitorModel');
const emailService = require('./src/utils/emailService'); // ✅ Added email service

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log('🚀 Starting server...');
  
  // Connect to database
  const dbConnected = await connectDB();
  if (!dbConnected) {
    console.error('❌ Database connection failed. Exiting...');
    process.exit(1);
  }

  // Test email configuration
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    const emailReady = await emailService.testConnection();
    if (emailReady) {
      console.log('✅ Email service configured and ready');
    } else {
      console.warn('⚠️  Email service not configured properly. Emails will not be sent.');
      console.warn('   To enable emails, add EMAIL_USER and EMAIL_PASSWORD to .env');
    }
  } else {
    console.warn('⚠️  Email service not configured. Add EMAIL_USER and EMAIL_PASSWORD to .env to enable emails');
  }

  // Start HTTP server
  const server = app.listen(PORT, () => {
    console.log(`\n✅ Server is running!`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🔑 Health check: http://localhost:${PORT}/health`);
    console.log(`📝 API endpoints:`);
    console.log(`   POST   /api/auth/register`);
    console.log(`   POST   /api/auth/login`);
    console.log(`   POST   /api/contact`);
    console.log(`   POST   /api/career/apply`);
    console.log(`   GET    /api/career/all`);
    console.log(`   GET    /api/health`);
    console.log(`\n✨ Ready to accept requests\n`);
  });
};

// Handle graceful shutdown
const gracefulShutdown = () => {
  console.log('\n🛑 Received shutdown signal');
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

startServer();