const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String },
  startYear: { type: String },
  endYear: { type: String },
  grade: { type: String },
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  description: { type: String },
  current: { type: Boolean, default: false },
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  techStack: [{ type: String }],
  link: { type: String },
  github: { type: String },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['student', 'recruiter'], required: true },
    profilePicture: { type: String, default: '' },

    // Student-specific fields
    bio: { type: String, default: '' },
    skills: [{ type: String }],
    education: [educationSchema],
    experience: [experienceSchema],
    projects: [projectSchema],
    resume: { type: String, default: '' }, // Cloudinary URL
    portfolioLinks: [{ type: String }],
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    resumeScore: { type: Number, default: 0 },

    // Recruiter-specific fields
    company: {
      name: { type: String, default: '' },
      logo: { type: String, default: '' },
      description: { type: String, default: '' },
      website: { type: String, default: '' },
      industry: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
