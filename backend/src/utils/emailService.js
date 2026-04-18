// Utils/EmailService.js
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Log configuration (without exposing full password)
    console.log('📧 Initializing Email Service...');
    console.log('   Host:', process.env.EMAIL_HOST);
    console.log('   Port:', process.env.EMAIL_PORT);
    console.log('   User:', process.env.EMAIL_USER);
    console.log('   From:', process.env.EMAIL_FROM);
    console.log('   Password exists:', !!process.env.EMAIL_PASSWORD);
    
    // Clean password (remove spaces if any)
    let cleanPassword = process.env.EMAIL_PASSWORD;
    if (cleanPassword && cleanPassword.includes(' ')) {
      cleanPassword = cleanPassword.replace(/\s/g, '');
      console.log('   Cleaned password (removed spaces)');
    }
    
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: cleanPassword,
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });
  }

  // Test email configuration - MAKE SURE THIS METHOD EXISTS
  async testConnection() {
    try {
      console.log('🔍 Testing email connection...');
      await this.transporter.verify();
      console.log('✅ Email service is ready to send emails');
      return true;
    } catch (error) {
      console.error('❌ Email service configuration error:', error.message);
      
      // Detailed error troubleshooting
      if (error.message.includes('Invalid login') || error.message.includes('535')) {
        console.error('\n🔧 Gmail Authentication Failed - Fix:');
        console.error('   1. Your app password should have NO SPACES');
        console.error('   2. Current password format:', process.env.EMAIL_PASSWORD);
        console.error('   3. Remove spaces: e.g., "ppcxtjbjqaujupcs" not "ppcx tjbj qauj upcs"');
        console.error('   4. Generate a new app password at: https://myaccount.google.com/apppasswords');
        console.error('   5. Make sure 2-Factor Authentication is enabled');
      } else if (error.message.includes('connect ETIMEDOUT')) {
        console.error('\n🔧 Connection Timeout - Fix:');
        console.error('   1. Check your internet connection');
        console.error('   2. Try using port 465 with secure: true');
        console.error('   3. Check if firewall is blocking SMTP');
      }
      
      return false;
    }
  }

  // Send welcome email on registration
  async sendWelcomeEmail(user) {
    try {
      console.log(`📧 Attempting to send welcome email to: ${user.email}`);
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || '"Vidit Media" <noreply@viditmedia.com>',
        to: user.email,
        subject: 'Welcome to Vidit Media! 🎉',
        html: this.getWelcomeEmailTemplate(user)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent to:', user.email);
      console.log('📧 Message ID:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Error sending welcome email:', error.message);
      return false;
    }
  }

  // Send login notification email
  async sendLoginNotificationEmail(user, loginInfo) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || '"Vidit Media" <noreply@viditmedia.com>',
        to: user.email,
        subject: 'New Login Detected 🔐',
        html: this.getLoginNotificationTemplate(user, loginInfo)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Login notification email sent to:', user.email);
      return true;
    } catch (error) {
      console.error('❌ Error sending login notification:', error.message);
      return false;
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(user, resetToken) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || '"Vidit Media" <noreply@viditmedia.com>',
        to: user.email,
        subject: 'Password Reset Request 🔑',
        html: this.getPasswordResetTemplate(user, resetUrl)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent to:', user.email);
      return true;
    } catch (error) {
      console.error('❌ Error sending password reset email:', error.message);
      return false;
    }
  }

  // Send contact notification
  async sendContactNotification(contactData) {
    try {
      console.log(`📧 Sending contact notification for: ${contactData.email}`);
      
      // Send to admin
      const adminMailOptions = {
        from: process.env.EMAIL_FROM || '"Vidit Media" <noreply@viditmedia.com>',
        to: process.env.EMAIL_USER, // Send to admin email
        subject: `New Contact Form: ${contactData.subject}`,
        html: this.getContactNotificationTemplate(contactData)
      };
      
      await this.transporter.sendMail(adminMailOptions);
      console.log('✅ Admin notification sent');
      
      // Send auto-reply to user
      const autoReplyOptions = {
        from: process.env.EMAIL_FROM || '"Vidit Media" <noreply@viditmedia.com>',
        to: contactData.email,
        subject: 'Thank you for contacting Vidit Media',
        html: this.getAutoReplyTemplate(contactData)
      };
      
      await this.transporter.sendMail(autoReplyOptions);
      console.log('✅ Auto-reply sent to user');
      
      return true;
    } catch (error) {
      console.error('❌ Error sending contact notification:', error.message);
      throw error;
    }
  }

            // Add to EmailService.js class

// Send career application notification
async sendCareerApplicationNotification(applicationData) {
  try {
    console.log(`📧 Sending career application notification for: ${applicationData.email}`);
    
    // Send to admin/HR
    const adminMailOptions = {
      from: process.env.EMAIL_FROM || '"Vidit Media" <noreply@viditmedia.com>',
      to: process.env.HR_EMAIL || process.env.EMAIL_USER, // Send to HR email or admin
      subject: `New Job Application: ${applicationData.position}`,
      html: this.getCareerApplicationAdminTemplate(applicationData)
    };
    
    await this.transporter.sendMail(adminMailOptions);
    console.log('✅ HR/Admin notification sent');
    
    // Send confirmation to applicant
    const applicantMailOptions = {
      from: process.env.EMAIL_FROM || '"Vidit Media" <noreply@viditmedia.com>',
      to: applicationData.email,
      subject: `Application Received: ${applicationData.position} at Vidit Media`,
      html: this.getCareerApplicationConfirmationTemplate(applicationData)
    };
    
    await this.transporter.sendMail(applicantMailOptions);
    console.log('✅ Application confirmation sent to applicant');
    
    return true;
  } catch (error) {
    console.error('❌ Error sending career application notification:', error.message);
    throw error;
  }
}

// Career Application Admin Template
getCareerApplicationAdminTemplate(applicationData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .section { margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
        .section-title { font-size: 18px; font-weight: bold; color: #667eea; margin-bottom: 15px; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; color: #555; width: 150px; display: inline-block; }
        .value { color: #333; }
        .message-box { background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 10px; }
        .reference { background: #e8f5e9; padding: 12px; text-align: center; border-radius: 8px; margin-top: 20px; font-weight: bold; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .badge { display: inline-block; padding: 5px 10px; background: #ff9800; color: white; border-radius: 5px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>📄 New Job Application Received</h2>
          <p>Position: ${applicationData.position}</p>
        </div>
        <div class="content">
          <div class="section">
            <div class="section-title">👤 Personal Information</div>
            <div class="info-row">
              <span class="label">Full Name:</span>
              <span class="value">${applicationData.name}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value">${applicationData.email}</span>
            </div>
            <div class="info-row">
              <span class="label">Phone:</span>
              <span class="value">${applicationData.phone || 'Not provided'}</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">💼 Professional Information</div>
            <div class="info-row">
              <span class="label">Position:</span>
              <span class="value"><span class="badge">${applicationData.position}</span></span>
            </div>
            <div class="info-row">
              <span class="label">Experience:</span>
              <span class="value">${applicationData.experience || 'Not specified'} years</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">📝 Cover Letter / Message</div>
            <div class="message-box">
              ${applicationData.message ? applicationData.message.replace(/\n/g, '<br>') : 'No cover letter provided.'}
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">📎 Resume/CV</div>
            <div class="info-row">
              <span class="label">File Path:</span>
              <span class="value">${applicationData.resumePath}</span>
            </div>
            <div class="info-row">
              <span class="label">Application ID:</span>
              <span class="value">${applicationData.applicationId}</span>
            </div>
          </div>
          
          <div class="reference">
            Reference ID: ${applicationData.referenceId}
          </div>
          
          <div class="info-row" style="margin-top: 20px; text-align: center;">
            <a href="${process.env.FRONTEND_URL}/admin/career-applications" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View All Applications</a>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated notification from Vidit Media Careers Portal</p>
          <p>&copy; 2024 Vidit Media. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Career Application Confirmation Template for Applicant
getCareerApplicationConfirmationTemplate(applicationData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .success-icon { font-size: 48px; text-align: center; margin-bottom: 20px; }
        .reference-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .reference-label { font-size: 12px; color: #166534; text-transform: uppercase; letter-spacing: 1px; }
        .reference-number { font-size: 20px; font-weight: bold; color: #166534; font-family: monospace; margin-top: 5px; }
        .info-box { background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .timeline { margin: 20px 0; }
        .timeline-step { display: flex; margin: 15px 0; align-items: flex-start; }
        .timeline-icon { width: 30px; height: 30px; background: #e8f5e9; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 15px; color: #4CAF50; font-weight: bold; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .button { display: inline-block; padding: 12px 24px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Application Received! 🎉</h2>
          <p>Thank you for applying to Vidit Media</p>
        </div>
        <div class="content">
          <div class="success-icon">✅</div>
          
          <p>Dear <strong>${applicationData.name}</strong>,</p>
          
          <p>Thank you for submitting your application for the position of <strong>${applicationData.position}</strong> at Vidit Media Solutions.</p>
          
          <div class="reference-box">
            <div class="reference-label">Your Application Reference ID</div>
            <div class="reference-number">${applicationData.referenceId}</div>
            <p style="font-size: 12px; margin-top: 10px;">Please keep this for future reference</p>
          </div>
          
          <div class="info-box">
            <h3 style="margin-top: 0;">📋 Application Summary</h3>
            <p><strong>Position Applied:</strong> ${applicationData.position}</p>
            <p><strong>Experience:</strong> ${applicationData.experience || 'Not specified'} years</p>
            <p><strong>Application Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="timeline">
            <h3>📅 What's Next?</h3>
            <div class="timeline-step">
              <div class="timeline-icon">1</div>
              <div>Our HR team will review your application</div>
            </div>
            <div class="timeline-step">
              <div class="timeline-icon">2</div>
              <div>Shortlisted candidates will be contacted within 5-7 business days</div>
            </div>
            <div class="timeline-step">
              <div class="timeline-icon">3</div>
              <div>Interview scheduling for qualified candidates</div>
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/career" class="button">Browse More Opportunities</a>
          </div>
          
          <hr style="margin: 20px 0;">
          
          <p style="font-size: 14px; color: #666;">If you have any questions, please contact our HR team at <a href="mailto:hr@viditmedia.com">hr@viditmedia.com</a></p>
        </div>
        <div class="footer">
          <p>Vidit Media Solutions - Building Digital Excellence</p>
          <p>This is an automated confirmation, please do not reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
     // Template Methods
  getWelcomeEmailTemplate(user) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Welcome to Vidit Media! 🎉</h2>
          </div>
          <div class="content">
            <p>Hello ${user.name},</p>
            <p>Thank you for registering with Vidit Media. We're excited to have you on board!</p>
            <p>Best regards,<br>Vidit Media Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getLoginNotificationTemplate(user, loginInfo) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f5576c; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Login Detected 🔐</h2>
          </div>
          <div class="content">
            <p>Hello ${user.name},</p>
            <p>A new login was detected to your account.</p>
            <p><strong>Time:</strong> ${loginInfo.time}</p>
            <p><strong>IP Address:</strong> ${loginInfo.ip || 'Unknown'}</p>
            <p>If this wasn't you, please secure your account immediately.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getPasswordResetTemplate(user, resetUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4facfe; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .button { display: inline-block; padding: 12px 24px; background: #4facfe; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Password Reset Request</h2>
          </div>
          <div class="content">
            <p>Hello ${user.name},</p>
            <p>Click the button below to reset your password:</p>
            <center>
              <a href="${resetUrl}" class="button">Reset Password</a>
            </center>
            <p>This link will expire in 1 hour.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getContactNotificationTemplate(contactData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .info { background: #f9f9f9; padding: 15px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Submission</h2>
          </div>
          <div class="content">
            <div class="info">
              <p><strong>Name:</strong> ${contactData.name}</p>
              <p><strong>Email:</strong> ${contactData.email}</p>
              <p><strong>Phone:</strong> ${contactData.contact_number || 'Not provided'}</p>
              <p><strong>Subject:</strong> ${contactData.subject}</p>
              <p><strong>Message:</strong></p>
              <p>${contactData.message}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getAutoReplyTemplate(contactData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Thank You for Contacting Vidit Media!</h2>
          </div>
          <div class="content">
            <p>Dear ${contactData.name},</p>
            <p>Thank you for reaching out to us. We have received your message regarding "${contactData.subject}".</p>
            <p>Our team will review your inquiry and get back to you within 24-48 hours.</p>
            <p>Best regards,<br>Vidit Media Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();