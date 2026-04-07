const User = require('../models/User');
const jwt = require('jsonwebtoken');
const emailService = require('../utils/emailService');

const generateToken = (id, email, name, role) => {
  return jwt.sign(
    { id, email, name, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Helper function to get client IP
const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.ip;
};

// Helper function to get browser info (simplified)
const getBrowserInfo = (req) => {
  const userAgent = req.headers['user-agent'] || '';
  let browser = 'Unknown';
  let os = 'Unknown';
  
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iOS')) os = 'iOS';
  
  return { browser, os };
};

exports.register = async (req, res) => {
  try {
    console.log('📝 Registration request received:', { 
      name: req.body.name, 
      email: req.body.email,
      hasPassword: !!req.body.password
    });
    
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if email exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Check if username exists
    const existingName = await User.findOne({ name });
    if (existingName) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken'
      });
    }

    // Create user
    const user = await User.create({ 
      name, 
      email: email.toLowerCase(), 
      password 
    });
    
    console.log('✅ User created successfully:', { id: user.id, name: user.name });
    
    // Send welcome email (don't await - send in background)
    emailService.sendWelcomeEmail(user).catch(err => {
      console.error('Background email sending failed:', err);
    });
    
    const token = generateToken(user.id, user.email, user.name, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    const user = await User.findOne({ name });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    const isPasswordMatch = await User.verifyPassword(user, password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    await User.updateLastLogin(user.id);

    // Get login information for notification
    const loginInfo = {
      time: new Date().toLocaleString(),
      ip: getClientIp(req),
      ...getBrowserInfo(req),
      location: 'Location detection available with IP geolocation service'
    };

    // Send login notification email (don't await - send in background)
    emailService.sendLoginNotificationEmail(user, loginInfo).catch(err => {
      console.error('Background login email sending failed:', err);
    });

    const token = generateToken(user.id, user.email, user.name, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};