const path = require('path');
const fs = require('fs');

// Ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Upload multiple files
const uploadMultipleFiles = async (files, subFolder) => {
  const uploadedPaths = [];
  const uploadDir = path.join(__dirname, '../../public/uploads', subFolder);
  
  ensureDirectoryExists(uploadDir);

  for (const file of files) {
    const fileExt = path.extname(file.name);
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substr(2, 9);
    const filename = `${timestamp}_${randomStr}${fileExt}`;
    const uploadPath = path.join(uploadDir, filename);
    
    await file.mv(uploadPath);
    uploadedPaths.push(`/uploads/${subFolder}/${filename}`);
  }

  return uploadedPaths;
};

// Upload single file
const uploadSingleFile = async (file, subFolder) => {
  const uploadDir = path.join(__dirname, '../../public/uploads', subFolder);
  ensureDirectoryExists(uploadDir);

  const fileExt = path.extname(file.name);
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substr(2, 9);
  const filename = `${timestamp}_${randomStr}${fileExt}`;
  const uploadPath = path.join(uploadDir, filename);
  
  await file.mv(uploadPath);
  return `/uploads/${subFolder}/${filename}`;
};

// Delete file
const deleteFile = (filePath) => {
  if (filePath) {
    const fullPath = path.join(__dirname, '../../public', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
  }
  return false;
};

module.exports = {
  uploadMultipleFiles,
  uploadSingleFile,
  deleteFile,
  ensureDirectoryExists
};