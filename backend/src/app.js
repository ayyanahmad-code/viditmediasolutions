// // backend/src/app.js
// const express = require('express');
// const cors = require('cors');
// const authRoutes = require('./routes/authRoutes');
// const contactRoutes = require('./routes/contactRoutes');
// const careerRoutes = require('./routes/careerRoutes');
// const careerHiringRoutes = require('./routes/careerHiringRoutes');
// const videoRoutes = require('./routes/videoRoutes');
// const path = require('path');

// const app = express();

// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve static files from public directory
// app.use('/thumbnails', express.static(path.join(__dirname, '../public/thumbnails')));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Register routes
// app.use('/api/auth', authRoutes);
// app.use('/api/contact', contactRoutes);
// app.use('/api/career', careerRoutes);
// app.use('/api/career-hiring', careerHiringRoutes);
// app.use('/api/videos', videoRoutes);

// app.get('/health', (req, res) => {
//   res.json({ success: true, message: 'Server is running' });
// });

// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ success: false, message: 'Server error' });
// });

// module.exports = app;




// backend/src/app.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const careerRoutes = require('./routes/careerRoutes');
const careerHiringRoutes = require('./routes/careerHiringRoutes');
const videoRoutes = require('./routes/videoRoutes');
const ourClientsRoutes = require('./routes/ourClientsRoutes');
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
    path.join(__dirname, 'uploads')
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
app.use('/thumbnails', express.static(path.join(__dirname, '../public/thumbnails')));
app.use('/our-clients', express.static(path.join(__dirname, '../public/our-clients')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log('✅ Static files served from /thumbnails');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/career-hiring', careerHiringRoutes);
app.use('/api/our-clients', ourClientsRoutes);
app.use('/api/videos', videoRoutes);

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