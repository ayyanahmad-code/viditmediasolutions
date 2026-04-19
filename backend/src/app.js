const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const careerRoutes = require('./routes/careerRoutes');
const careerHiringRoutes = require('./routes/careerHiringRoutes');
const videoRoutes = require('./routes/videoRoutes');
const ourClientsRoutes = require('./routes/ourClientsRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const partnerGalleryRoutes = require('./routes/partnerGalleryRoutes'); 
const visitorRoutes = require('./routes/visitorRoutes');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create necessary directories if they don't exist
const createDirectories = () => {
  const dirs = [
    path.join(__dirname, '../public/thumbnails/main-slider'),
    path.join(__dirname, '../public/thumbnails/secondary-slider'),
    path.join(__dirname, '../public/temp'),
    path.join(__dirname, '../public/our-clients'),
    path.join(__dirname, '../public/uploads/resumes'), // New directory for resumes
    path.join(__dirname, '../public/uploads/gallery/images'),
    path.join(__dirname, '../public/uploads/gallery/videos')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
};

createDirectories();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/thumbnails', express.static(path.join(__dirname, '../public/thumbnails')));
app.use('/our-clients', express.static(path.join(__dirname, '../public/our-clients')));

console.log('✅ Static files served from public directory');
console.log(`   - Public path: ${path.join(__dirname, '../public')}`);
console.log(`   - Uploads path: ${path.join(__dirname, '../public/uploads')}`);

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/career-hiring', careerHiringRoutes);
app.use('/api/our-clients', ourClientsRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/partner-gallery', partnerGalleryRoutes); 
app.use('/api/visitors', visitorRoutes);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Server error' 
  });
});

module.exports = app;