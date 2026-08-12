const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  getRecruiterStats,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/:jobId', protect, authorize('student'), applyForJob);
router.get('/my', protect, authorize('student'), getMyApplications);
router.get('/recruiter/stats', protect, authorize('recruiter'), getRecruiterStats);
router.get('/job/:jobId', protect, authorize('recruiter'), getJobApplicants);
router.put('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);

module.exports = router;
