const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage configuration for categories
const categoryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'categories', // Specify a different folder for category images
    allowedFormats: ['jpg', 'jpeg', 'png'],
  },
});

const categoryUpload = multer({ storage: categoryStorage });

module.exports = { cloudinary, categoryUpload };
