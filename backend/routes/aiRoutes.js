const express = require('express');
const router = express.Router();
const {
  extractResumeText,
  analyzeResume,
  skillMatch,
  generateCoverLetter,
  generateInterviewQuestions,
} = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/extract-resume-text', protect, authorize('student'), extractResumeText);
router.post('/analyze-resume', protect, authorize('student'), analyzeResume);
router.post('/skill-match', protect, authorize('student'), skillMatch);
router.post('/cover-letter', protect, authorize('student'), generateCoverLetter);
router.post('/interview-questions', protect, generateInterviewQuestions);

module.exports = router;
