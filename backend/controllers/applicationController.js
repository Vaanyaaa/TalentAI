const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (student)
const applyForJob = async (req, res) => {
  const { jobId } = req.params;
  const { coverLetter } = req.body;

  const job = await Job.findById(jobId);
  if (!job || !job.isActive) {
    res.status(404);
    throw new Error('Job not found or no longer active');
  }

  const existingApp = await Application.findOne({
    job: jobId,
    applicant: req.user._id,
  });

  if (existingApp) {
    res.status(409);
    throw new Error('You have already applied for this job');
  }

  const application = await Application.create({
    job: jobId,
    applicant: req.user._id,
    coverLetter: coverLetter || '',
    resumeUrl: req.user.resume || '',
    status: 'Applied',
  });

  // Increment applications count
  await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

  res.status(201).json({ success: true, application });
};

// @desc    Get student's applications
// @route   GET /api/applications/my
// @access  Private (student)
const getMyApplications = async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id })
    .populate({
      path: 'job',
      select: 'title company location employmentType salary isActive',
    })
    .sort({ createdAt: -1 });

  res.json({ success: true, applications });
};

// @desc    Get all applicants for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (recruiter)
const getJobApplicants = async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  if (job.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to view this job's applicants");
  }

  const applications = await Application.find({ job: req.params.jobId })
    .populate('applicant', 'name email profilePicture skills bio resume education experience')
    .sort({ createdAt: -1 });

  res.json({ success: true, applications });
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (recruiter)
const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;

  const validStatuses = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const application = await Application.findById(req.params.id).populate('job');

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  if (application.job.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  application.status = status;
  await application.save();

  res.json({ success: true, application });
};

// @desc    Get recruiter dashboard stats
// @route   GET /api/applications/recruiter/stats
// @access  Private (recruiter)
const getRecruiterStats = async (req, res) => {
  const myJobIds = await Job.find({ postedBy: req.user._id }).distinct('_id');

  const totalJobs = myJobIds.length;
  const totalApplicants = await Application.countDocuments({ job: { $in: myJobIds } });
  const shortlisted = await Application.countDocuments({
    job: { $in: myJobIds },
    status: { $in: ['Shortlisted', 'Interview Scheduled', 'Selected'] },
  });

  const recentApplications = await Application.find({ job: { $in: myJobIds } })
    .populate('applicant', 'name email profilePicture')
    .populate('job', 'title')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    stats: { totalJobs, totalApplicants, shortlisted },
    recentApplications,
  });
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  getRecruiterStats,
};
