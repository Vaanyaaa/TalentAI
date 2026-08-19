const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadAvatar,
  uploadResume,
  getResume,
  saveJob,
  unsaveJob,
  getSavedJobs,
  getUserById,
  updateResumeScore,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadAvatar: avatarUpload, uploadResume: resumeUpload } = require('../middleware/uploadMiddleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/upload-avatar', protect, avatarUpload.single('avatar'), uploadAvatar);
router.post('/upload-resume', protect, authorize('student'), resumeUpload.single('resume'), uploadResume);
router.get('/resume', protect, getResume);
router.get('/resume/:id', getResume);
router.post('/save-job/:jobId', protect, authorize('student'), saveJob);
router.delete('/save-job/:jobId', protect, authorize('student'), unsaveJob);
router.get('/saved-jobs', protect, authorize('student'), getSavedJobs);
router.put('/resume-score', protect, authorize('student'), updateResumeScore);
router.get('/:id', protect, getUserById);

module.exports = router;
