// backend/src/app.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const careerRoutes = require('./routes/careerRoutes');
const careerHiringRoutes = require('./routes/careerHiringRoutes');
const videoRoutes = require('./routes/videoRoutes');
const path = require('path');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use('/thumbnails', express.static(path.join(__dirname, '../public/thumbnails')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/career-hiring', careerHiringRoutes);
app.use('/api/videos', videoRoutes);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Server error' });
});

module.exports = app;