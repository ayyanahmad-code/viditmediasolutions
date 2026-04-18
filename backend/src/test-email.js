// test-email.js
require('dotenv').config();
const emailService = require('./src/utils/EmailService');

async function test() {
  console.log('\n=================================');
  console.log('📧 TESTING EMAIL SERVICE');
  console.log('=================================\n');
  
  // Test connection
  const isConnected = await emailService.verifyConnection();
  
  if (!isConnected) {
    console.log('\n⚠️  Email service not working. Try one of these options:\n');
    console.log('Option 1 - Use Test Email (no configuration needed):');
    console.log('  Add to .env: USE_TEST_EMAIL=true\n');
    console.log('Option 2 - Fix Gmail:');
    console.log('  1. Enable 2-Factor Authentication');
    console.log('  2. Generate app password at https://myaccount.google.com/apppasswords');
    console.log('  3. Update EMAIL_PASSWORD in .env\n');
    return;
  }
  
  // Test sending email
  console.log('📧 Sending test email...');
  const result = await emailService.sendContactNotification({
    name: 'Test User',
    email: 'test@example.com',
    contact_number: '1234567890',
    subject: 'Test Subject',
    message: 'This is a test message from the email service.',
    contactId: 999,
    referenceId: 'TEST-123'
  });
  
  if (result) {
    console.log('✅ Email test successful!\n');
  } else {
    console.log('❌ Email test failed\n');
  }
}

test();