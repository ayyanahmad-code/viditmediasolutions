// src/utils/emailService.js
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.init();
  }

  init() {
    try {
      // Check if email credentials are provided
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.warn('⚠️ Email credentials not provided. Email service disabled.');
        return;
      }

      // Clean the email user (remove any 'your-' prefix if present)
      let emailUser = process.env.EMAIL_USER;
      if (emailUser.startsWith('your-')) {
        emailUser = emailUser.substring(5);
        console.warn(`⚠️ Fixed EMAIL_USER from '${process.env.EMAIL_USER}' to '${emailUser}'`);
      }

      const config = {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: emailUser,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000
      };

      console.log('📧 Email Config:', {
        host: config.host,
        port: config.port,
        secure: config.secure,
        user: config.auth.user,
        hasPassword: !!config.auth.pass,
        passwordLength: config.auth.pass ? config.auth.pass.length : 0
      });

      this.transporter = nodemailer.createTransport(config);
      this.verifyConnection();
      
    } catch (error) {
      console.error('❌ Email service initialization error:', error.message);
    }
  }

  async verifyConnection() {
    try {
      if (!this.transporter) return;
      
      console.log('🔌 Verifying email connection...');
      await this.transporter.verify();
      
      this.isConfigured = true;
      console.log('✅ Email service is ready to send emails');
      console.log(`📧 Using email: ${this.transporter.options.auth.user}`);
      
    } catch (error) {
      console.error('❌ Email service verification failed:', error.message);
      
      if (error.message.includes('Invalid login') || error.message.includes('535')) {
        console.error('\n🔑 GOOGLE AUTHENTICATION ERROR:');
        console.error('   Your app password is incorrect or expired.');
        console.error('   Solution:');
        console.error('   1. Go to: https://myaccount.google.com/apppasswords');
        console.error('   2. Generate a NEW app password');
        console.error('   3. Copy the 16-character password WITHOUT spaces');
        console.error('   4. Update EMAIL_PASSWORD in .env file');
        console.error('   5. Restart the server\n');
      } else if (error.message.includes('connect')) {
        console.error('\n🔌 CONNECTION ERROR:');
        console.error('   Cannot connect to Gmail SMTP server.');
        console.error('   Check your internet connection and firewall settings.\n');
      }
      
      this.isConfigured = false;
    }
  }

  // Send welcome email on registration
  async sendWelcomeEmail(user) {
    if (!this.isConfigured) {
      console.warn('⚠️ Email service not configured. Skipping welcome email to:', user.email);
      return false;
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || '"Vidit Media" <noreply@viditmedia.com>',
        to: user.email,
        subject: 'Welcome to Vidit Media! 🎉',
        html: this.getWelcomeEmailTemplate(user)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent to:', user.email);
      return true;
    } catch (error) {
      console.error('❌ Error sending welcome email:', error.message);
      return false;
    }
  }

  // Send login notification email
  async sendLoginNotificationEmail(user, loginInfo) {
    if (!this.isConfigured) {
      console.warn('⚠️ Email service not configured. Skipping login notification to:', user.email);
      return false;
    }

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
    if (!this.isConfigured) {
      console.warn('⚠️ Email service not configured. Skipping password reset to:', user.email);
      return false;
    }

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

  // Send application received email (auto-reply to applicant)
  async sendCareerAutoReply(application) {
    if (!this.isConfigured) {
      console.warn('⚠️ Email service not configured. Skipping career auto-reply to:', application.email);
      return false;
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || '"Vidit Media" <noreply@viditmedia.com>',
        to: application.email,
        subject: `Application Received: ${application.position} - Vidit Media`,
        html: this.getApplicationReceivedTemplate(application)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Career auto-reply email sent to:', application.email);
      return true;
    } catch (error) {
      console.error('❌ Error sending career auto-reply:', error.message);
      return false;
    }
  }

  // Send career application notification to admin
  async sendCareerApplicationNotification(application) {
    if (!this.isConfigured) {
      console.warn('⚠️ Email service not configured. Skipping career notification');
      return false;
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_USER,
        subject: `New Job Application: ${application.position}`,
        html: this.getAdminNotificationTemplate(application)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Career notification email sent to admin');
      return true;
    } catch (error) {
      console.error('❌ Error sending career notification:', error.message);
      return false;
    }
  }

  // Send contact notification to admin
  async sendContactNotification(contactData) {
    if (!this.isConfigured) {
      console.warn('⚠️ Email service not configured. Skipping contact notification');
      return false;
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_USER,
        subject: `New Contact Form Submission: ${contactData.subject}`,
        html: this.getContactAdminTemplate(contactData)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Contact notification email sent to admin');
      return true;
    } catch (error) {
      console.error('❌ Error sending contact notification:', error.message);
      return false;
    }
  }

  // Send auto-reply to contact form submitter
  async sendContactAutoReply(contactData) {
    if (!this.isConfigured) {
      console.warn('⚠️ Email service not configured. Skipping auto-reply');
      return false;
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: contactData.email,
        subject: `Thank you for contacting Vidit Media`,
        html: this.getContactAutoReplyTemplate(contactData)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Auto-reply email sent to:', contactData.email);
      return true;
    } catch (error) {
      console.error('❌ Error sending auto-reply:', error.message);
      return false;
    }
  }

  // Send interview scheduled email
  async sendInterviewScheduledEmail(application, interviewDetails) {
    if (!this.isConfigured) {
      console.warn('⚠️ Email service not configured. Skipping interview email');
      return false;
    }

    try {
      const isReschedule = interviewDetails.is_reschedule;
      const subject = isReschedule ? 'Interview Rescheduled - Vidit Media' : 'Interview Scheduled - Vidit Media';
      
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: application.email,
        subject: subject,
        html: this.getInterviewScheduledTemplate(application, interviewDetails)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Interview ${isReschedule ? 'reschedule' : 'schedule'} email sent to:`, application.email);
      return true;
    } catch (error) {
      console.error('❌ Error sending interview email:', error.message);
      return false;
    }
  }

  // Send application status update (hired/rejected)
  async sendApplicationStatusUpdate(application, status, reason = null) {
    if (!this.isConfigured) {
      console.warn('⚠️ Email service not configured. Skipping status update email');
      return false;
    }

    try {
      const isHired = status === 'hired';
      const subject = isHired ? 'Congratulations! You\'re Hired! 🎉' : 'Application Status Update';
      
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: application.email,
        subject: subject,
        html: isHired ? this.getHiredTemplate(application) : this.getRejectedTemplate(application, reason)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ ${status.toUpperCase()} email sent to:`, application.email);
      return true;
    } catch (error) {
      console.error(`❌ Error sending ${status} email:`, error.message);
      return false;
    }
  }

  // Test email configuration
  async testConnection() {
    if (!this.transporter) {
      console.error('❌ Email transporter not initialized');
      return false;
    }
    
    try {
      await this.transporter.verify();
      console.log('✅ Email service is ready to send emails');
      return true;
    } catch (error) {
      console.error('❌ Email service configuration error:', error.message);
      return false;
    }
  }

  // ==================== EMAIL TEMPLATES ====================

  getWelcomeEmailTemplate(user) {
    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>Welcome to Vidit Media</title></head>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1>Welcome to Vidit Media! 🎉</h1>
          </div>
          <div style="padding: 20px;">
            <p>Dear ${user.name},</p>
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
      <head><meta charset="UTF-8"><title>New Login Alert</title></head>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center;">
            <h1>🔐 New Login Detected</h1>
          </div>
          <div style="padding: 20px;">
            <p>Dear ${user.name},</p>
            <p>A new login was detected to your account at ${loginInfo.time}.</p>
            <p>If this wasn't you, please change your password immediately.</p>
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
      <head><meta charset="UTF-8"><title>Password Reset</title></head>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center;">
            <h1>Password Reset Request</h1>
          </div>
          <div style="padding: 20px;">
            <p>Dear ${user.name},</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background: #4facfe; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>This link expires in 1 hour.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getApplicationReceivedTemplate(application) {
    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>Application Received</title></head>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h1>Application Received! 📝</h1>
          </div>
          <div style="padding: 20px;">
            <p>Dear ${application.name},</p>
            <p>Thank you for applying for the <strong>${application.position}</strong> position at Vidit Media.</p>
            <p>Our recruitment team has received your application and will review it carefully.</p>
            <p>We will contact you within 5-7 business days regarding the next steps.</p>
            <p>Best regards,<br>Vidit Media Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getAdminNotificationTemplate(application) {
    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>New Job Application</title></head>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h1>📝 New Job Application</h1>
          </div>
          <div style="padding: 20px;">
            <h3>Applicant Details:</h3>
            <p><strong>Name:</strong> ${application.name}</p>
            <p><strong>Email:</strong> ${application.email}</p>
            <p><strong>Phone:</strong> ${application.phone}</p>
            <p><strong>Position:</strong> ${application.position}</p>
            <p><strong>Experience:</strong> ${application.experience}</p>
            ${application.message ? `<p><strong>Message:</strong> ${application.message}</p>` : ''}
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getContactAdminTemplate(contactData) {
    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>New Contact Message</title></head>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h1>📧 New Contact Message</h1>
          </div>
          <div style="padding: 20px;">
            <h3>Contact Details:</h3>
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Phone:</strong> ${contactData.contact_number}</p>
            <p><strong>Subject:</strong> ${contactData.subject}</p>
            <p><strong>Message:</strong></p>
            <p style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${contactData.message}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getContactAutoReplyTemplate(contactData) {
    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>Thank You</title></head>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h1>Thank You for Contacting Us! 🙏</h1>
          </div>
          <div style="padding: 20px;">
            <p>Dear ${contactData.name},</p>
            <p>Thank you for reaching out to Vidit Media. We have received your message regarding <strong>${contactData.subject}</strong>.</p>
            <p>Our team will review your inquiry and get back to you within 24-48 hours.</p>
            <p>Best regards,<br>Vidit Media Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getInterviewScheduledTemplate(application, interviewDetails) {
    const isReschedule = interviewDetails.is_reschedule;
    const datetime = new Date(interviewDetails.interview_datetime).toLocaleString();
    
    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>Interview ${isReschedule ? 'Rescheduled' : 'Scheduled'}</title></head>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h1>Interview ${isReschedule ? 'Rescheduled' : 'Scheduled'}! 🎯</h1>
          </div>
          <div style="padding: 20px;">
            <p>Dear ${application.name},</p>
            <p>Your interview for the position of <strong>${application.position}</strong> has been ${isReschedule ? 'rescheduled' : 'scheduled'}.</p>
            <p><strong>Date & Time:</strong> ${datetime}</p>
            ${isReschedule && interviewDetails.reschedule_count ? `<p><strong>Reschedule Attempt:</strong> #${interviewDetails.reschedule_count}</p>` : ''}
            <p>Please be available at the scheduled time.</p>
            <p>Best regards,<br>Vidit Media Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getHiredTemplate(application) {
    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>Congratulations!</title></head>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1>🎉 Congratulations! 🎉</h1>
          </div>
          <div style="padding: 20px;">
            <p>Dear ${application.name},</p>
            <p>We are pleased to inform you that you have been selected for the position of <strong>${application.position}</strong> at Vidit Media.</p>
            <p>Our HR team will contact you shortly with the offer letter and joining details.</p>
            <p>Welcome to the team!</p>
            <p>Best regards,<br>Vidit Media Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getRejectedTemplate(application, reason) {
    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>Application Update</title></head>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center;">
            <h1>Application Update</h1>
          </div>
          <div style="padding: 20px;">
            <p>Dear ${application.name},</p>
            <p>Thank you for your interest in the <strong>${application.position}</strong> position at Vidit Media.</p>
            <p>After careful consideration, we have decided to move forward with other candidates for this role.</p>
            ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
            <p>We appreciate your interest and encourage you to apply for future openings that match your skills.</p>
            <p>Best regards,<br>Vidit Media Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();