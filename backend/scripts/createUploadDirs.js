const fs = require('fs');
const path = require('path');

// Get the backend root directory (parent of scripts folder)
const backendRoot = path.join(__dirname, '..');

const directories = [
  // Public upload directories
  path.join(backendRoot, 'public/uploads'),
  path.join(backendRoot, 'public/uploads/gallery'),
  path.join(backendRoot, 'public/uploads/gallery/images'),
  path.join(backendRoot, 'public/uploads/gallery/videos'),
  path.join(backendRoot, 'public/thumbnails'),
  path.join(backendRoot, 'public/our-clients'),
  
  // Root uploads directory
  path.join(backendRoot, 'uploads'),
  path.join(backendRoot, 'uploads/gallery'),
  path.join(backendRoot, 'uploads/gallery/images'),
  path.join(backendRoot, 'uploads/gallery/videos'),
  
  // Temp directory for file processing
  path.join(backendRoot, 'public/temp')
];

console.log('\n📁 Creating upload directories...\n');

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created: ${path.relative(backendRoot, dir)}`);
  } else {
    console.log(`📁 Already exists: ${path.relative(backendRoot, dir)}`);
  }
});

console.log('\n🎉 All upload directories created successfully!\n');
console.log('📂 Directory structure:');
console.log('   backend/');
console.log('   ├── public/');
console.log('   │   ├── uploads/');
console.log('   │   │   └── gallery/');
console.log('   │   │       ├── images/');
console.log('   │   │       └── videos/');
console.log('   │   ├── thumbnails/');
console.log('   │   └── our-clients/');
console.log('   └── uploads/');
console.log('       └── gallery/');
console.log('           ├── images/');
console.log('           └── videos/\n');