const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requiredSkills: [{ type: String }],
    experienceRequired: { type: String, default: '0' }, // e.g. "0-1", "2-3"
    location: { type: String, required: true },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'],
      required: true,
    },
    salary: { type: String, default: '' }, // Optional
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      name: { type: String, required: true },
      logo: { type: String, default: '' },
      website: { type: String, default: '' },
      industry: { type: String, default: '' },
    },
    isActive: { type: Boolean, default: true },
    applicationsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Index for search
jobSchema.index({ title: 'text', 'company.name': 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);
