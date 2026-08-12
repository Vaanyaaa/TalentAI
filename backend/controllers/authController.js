const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('All fields are required');
  }

  if (!['student', 'recruiter'].includes(role)) {
    res.status(400);
    throw new Error('Invalid role. Must be student or recruiter');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409);
    throw new Error('User with this email already exists');
  }

  const user = await User.create({ name, email, password, role });
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user,
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id);
  const userData = user.toJSON();

  res.json({
    success: true,
    token,
    user: userData,
  });
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('savedJobs', 'title company location employmentType');

  res.json({ success: true, user });
};

module.exports = { register, login, getMe };
