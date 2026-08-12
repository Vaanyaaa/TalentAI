const User = require('../models/User');

// @desc    Get current user's profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).populate('savedJobs', 'title company location employmentType salary');
  res.json({ success: true, user });
};

// @desc    Update profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Common fields
  user.name = req.body.name || user.name;
  user.bio = req.body.bio || user.bio;

  // Student-specific
  if (req.user.role === 'student') {
    if (req.body.skills) user.skills = req.body.skills;
    if (req.body.education) user.education = req.body.education;
    if (req.body.experience) user.experience = req.body.experience;
    if (req.body.projects) user.projects = req.body.projects;
    if (req.body.portfolioLinks) user.portfolioLinks = req.body.portfolioLinks;
  }

  // Recruiter-specific
  if (req.user.role === 'recruiter') {
    if (req.body.company) {
      user.company = { ...user.company.toObject(), ...req.body.company };
    }
  }

  const updated = await user.save();
  res.json({ success: true, user: updated });
};

// @desc    Upload avatar
// @route   POST /api/users/upload-avatar
// @access  Private
const uploadAvatar = async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profilePicture: req.file.path },
    { new: true }
  );

  // Recruiter company logo
  if (req.user.role === 'recruiter') {
    user.company.logo = req.file.path;
    await user.save();
  }

  res.json({ success: true, profilePicture: req.file.path, user });
};

// @desc    Upload resume
// @route   POST /api/users/upload-resume
// @access  Private (student)
const uploadResume = async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { resume: req.file.path },
    { new: true }
  );

  res.json({ success: true, resumeUrl: req.file.path, user });
};

// @desc    Save a job
// @route   POST /api/users/save-job/:jobId
// @access  Private (student)
const saveJob = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.savedJobs.includes(req.params.jobId)) {
    return res.json({ success: true, message: 'Job already saved' });
  }

  user.savedJobs.push(req.params.jobId);
  await user.save();

  res.json({ success: true, message: 'Job saved successfully' });
};

// @desc    Unsave a job
// @route   DELETE /api/users/save-job/:jobId
// @access  Private (student)
const unsaveJob = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { savedJobs: req.params.jobId },
  });

  res.json({ success: true, message: 'Job removed from saved list' });
};

// @desc    Get saved jobs
// @route   GET /api/users/saved-jobs
// @access  Private (student)
const getSavedJobs = async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'savedJobs',
    populate: { path: 'postedBy', select: 'name company' },
  });

  res.json({ success: true, savedJobs: user.savedJobs });
};

// @desc    Get any user profile by ID (recruiter viewing student)
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ success: true, user });
};

// @desc    Update resume score
// @route   PUT /api/users/resume-score
// @access  Private (student)
const updateResumeScore = async (req, res) => {
  const { score } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { resumeScore: score },
    { new: true }
  );
  res.json({ success: true, user });
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  uploadResume,
  saveJob,
  unsaveJob,
  getSavedJobs,
  getUserById,
  updateResumeScore,
};
