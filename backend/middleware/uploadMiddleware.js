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
  params: async (req, file) => {
    const rawName = (file.originalname || 'resume')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now();
    return {
      folder: 'talentai/resumes',
      resource_type: 'raw',
      format: 'pdf',
      public_id: `${rawName}_${uniqueSuffix}.pdf`,
    };
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
const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/pdf' ||
      file.originalname.toLowerCase().endsWith('.pdf')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files (.pdf) are allowed for resumes'), false);
    }
  },
});
const uploadLogo = multer({ storage: logoStorage });

module.exports = { uploadAvatar, uploadResume, uploadLogo };

