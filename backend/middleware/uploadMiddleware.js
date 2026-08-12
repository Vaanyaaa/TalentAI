const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Avatar storage
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'talentai/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
  },
});

// Resume storage
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'talentai/resumes',
    allowed_formats: ['pdf'],
    resource_type: 'raw',
  },
});

// Company logo storage
const logoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'talentai/logos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 300, height: 300, crop: 'fill' }],
  },
});

const uploadAvatar = multer({ storage: avatarStorage });
const uploadResume = multer({ storage: resumeStorage });
const uploadLogo = multer({ storage: logoStorage });

module.exports = { uploadAvatar, uploadResume, uploadLogo };
