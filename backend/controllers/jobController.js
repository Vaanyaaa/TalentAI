const Job = require('../models/Job');

// @desc    Get all jobs with search & filter
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  const {
    keyword,
    location,
    employmentType,
    experienceRequired,
    skills,
    page = 1,
    limit = 12,
  } = req.query;

  const query = { isActive: true };

  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { 'company.name': { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
  }

  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }

  if (employmentType) {
    query.employmentType = employmentType;
  }

  if (experienceRequired) {
    query.experienceRequired = experienceRequired;
  }

  if (skills) {
    const skillsArray = skills.split(',').map((s) => s.trim());
    query.requiredSkills = { $in: skillsArray.map(s => new RegExp(s, 'i')) };
  }

  const total = await Job.countDocuments(query);
  const jobs = await Job.find(query)
    .populate('postedBy', 'name company')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    success: true,
    jobs,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  });
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  const job = await Job.findById(req.params.id).populate('postedBy', 'name email company');

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  res.json({ success: true, job });
};

// @desc    Create job
// @route   POST /api/jobs
// @access  Private (recruiter)
const createJob = async (req, res) => {
  const {
    title,
    description,
    requiredSkills,
    experienceRequired,
    location,
    employmentType,
    salary,
  } = req.body;

  if (!title || !description || !location || !employmentType) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  const recruiter = req.user;

  const job = await Job.create({
    title,
    description,
    requiredSkills: requiredSkills || [],
    experienceRequired: experienceRequired || '0',
    location,
    employmentType,
    salary,
    postedBy: recruiter._id,
    company: {
      name: recruiter.company.name || recruiter.name,
      logo: recruiter.company.logo || '',
      website: recruiter.company.website || '',
      industry: recruiter.company.industry || '',
    },
  });

  res.status(201).json({ success: true, job });
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (recruiter - owner only)
const updateJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  if (job.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this job');
  }

  const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, job: updated });
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (recruiter - owner only)
const deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  if (job.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this job');
  }

  await job.deleteOne();
  res.json({ success: true, message: 'Job deleted successfully' });
};

// @desc    Get recruiter's own jobs
// @route   GET /api/jobs/recruiter/my-jobs
// @access  Private (recruiter)
const getMyJobs = async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, jobs });
};

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob, getMyJobs };
