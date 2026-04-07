const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  // Send welcome email on registration
  async sendWelcomeEmail(user) {
    try {
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
      console.log('📧 Message ID:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Error sending login notification:', error.message);
      return false;
    }
  }

  // Send password reset email (optional)
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

  // Welcome Email Template
  getWelcomeEmailTemplate(user) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Vidit Media</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 0;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 30px;
          }
          .welcome-message {
            font-size: 18px;
            margin-bottom: 20px;
          }
          .user-details {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #eee;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-links a {
            margin: 0 10px;
            color: #667eea;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Vidit Media! 🎉</h1>
          </div>
          <div class="content">
            <div class="welcome-message">
              <strong>Hello ${user.name}!</strong>
            </div>
            <p>Thank you for registering with Vidit Media. We're excited to have you on board!</p>
            
            <div class="user-details">
              <p><strong>📧 Email:</strong> ${user.email}</p>
              <p><strong>👤 Username:</strong> ${user.name}</p>
              <p><strong>📅 Registered on:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <p>With Vidit Media, you can:</p>
            <ul>
              <li>🎬 Access exclusive content</li>
              <li>💬 Connect with our community</li>
              <li>📱 Manage your profile and preferences</li>
              <li>🔔 Receive updates on new features</li>
            </ul>
            
            <center>
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Get Started</a>
            </center>
            
            <p>If you have any questions, feel free to contact our support team at support@viditmedia.com</p>
          </div>
          <div class="footer">
            <div class="social-links">
              <a href="#">Facebook</a> |
              <a href="#">Twitter</a> |
              <a href="#">Instagram</a> |
              <a href="#">LinkedIn</a>
            </div>
            <p>&copy; 2024 Vidit Media. All rights reserved.</p>
            <p>This email was sent to ${user.email}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Login Notification Email Template
  getLoginNotificationTemplate(user, loginInfo) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Login Alert</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 0;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 30px;
          }
          .alert-message {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            color: #856404;
          }
          .login-details {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #f5576c;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #eee;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 New Login Detected</h1>
          </div>
          <div class="content">
            <p><strong>Hello ${user.name},</strong></p>
            
            <div class="alert-message">
              ⚠️ We noticed a new login to your account. If this wasn't you, please secure your account immediately.
            </div>
            
            <div class="login-details">
              <h3>📱 Login Details:</h3>
              <p><strong>🕐 Time:</strong> ${loginInfo.time}</p>
              <p><strong>🌐 IP Address:</strong> ${loginInfo.ip || 'Unable to detect'}</p>
              <p><strong>🖥️ Browser:</strong> ${loginInfo.browser || 'Unknown'}</p>
              <p><strong>💻 OS:</strong> ${loginInfo.os || 'Unknown'}</p>
              <p><strong>📍 Location:</strong> ${loginInfo.location || 'Unable to detect'}</p>
            </div>
            
            <p>If this was you, you can safely ignore this email.</p>
            <p>If this wasn't you, please:</p>
            <ul>
              <li>🔒 Change your password immediately</li>
              <li>📞 Contact our support team</li>
              <li>🔍 Review your recent account activity</li>
            </ul>
            
            <center>
              <a href="${process.env.FRONTEND_URL}/security" class="button">Secure Your Account</a>
            </center>
          </div>
          <div class="footer">
            <p>&copy; 2024 Vidit Media. All rights reserved.</p>
            <p>This is an automated security notification.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Password Reset Email Template
  getPasswordResetTemplate(user, resetUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 0;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .content {
            padding: 30px;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            color: #856404;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #eee;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p><strong>Hello ${user.name},</strong></p>
            <p>We received a request to reset your password for your Vidit Media account.</p>
            
            <div class="warning">
              ⏰ This password reset link will expire in 1 hour.
            </div>
            
            <p>Click the button below to reset your password:</p>
            
            <center>
              <a href="${resetUrl}" class="button">Reset Password</a>
            </center>
            
            <p>If you didn't request this, you can safely ignore this email. Your password will not be changed.</p>
            
            <hr>
            <p style="font-size: 12px; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="font-size: 12px; color: #666; word-break: break-all;">${resetUrl}</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Vidit Media. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Test email configuration
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service is ready to send emails');
      return true;
    } catch (error) {
      console.error('❌ Email service configuration error:', error.message);
      return false;
    }
  }
}

module.exports = new EmailService();