import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/common/Navbar';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  MapPin, Briefcase, Clock, DollarSign, Building2, ArrowLeft,
  CheckCircle2, Send, Target, MessageSquare, ExternalLink
} from 'lucide-react';

const STATUS_COLORS = {
  'Full-time': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Part-time': 'bg-purple-50 text-purple-700 border-purple-200',
  Internship: 'bg-orange-50 text-orange-700 border-orange-200',
  Contract: 'bg-slate-50 text-slate-700 border-slate-200',
  Remote: 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data.job);

        // Check if already applied
        if (user?.role === 'student') {
          const appRes = await api.get('/applications/my');
          const applied = appRes.data.applications?.some(a => a.job?._id === id || a.job === id);
          setHasApplied(applied);
        }
      } catch {
        toast.error('Job not found');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, user, navigate]);

  const handleApply = async () => {
    if (!user) return navigate('/login');
    setApplying(true);
    try {
      await api.post(`/applications/${id}`, { coverLetter });
      setHasApplied(true);
      setShowApplyModal(false);
      toast.success('Application submitted! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const generateCoverLetter = async () => {
    if (!user?.resume) return toast.error('Please upload your resume first to generate a cover letter');
    setGenerating(true);
    try {
      const { data } = await api.post('/ai/cover-letter', {
        resumeText: `Name: ${user.name}, Skills: ${user.skills?.join(', ')}, Bio: ${user.bio}`,
        jobDescription: job.description,
        jobTitle: job.title,
        companyName: job.company?.name,
        applicantName: user.name,
      });
      setCoverLetter(data.coverLetter);
      toast.success('Cover letter generated! ✨');
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (err.response?.status === 429 || msg.toLowerCase().includes('quota')) {
        toast.error('⏳ AI quota limit reached. Please wait a moment and try again.');
      } else {
        toast.error('Failed to generate cover letter. Please try again.');
      }
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Jobs
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            {/* Header Card */}
            <div className="card p-6">
              <div className="flex items-start gap-4 mb-4">
                {job.company?.logo ? (
                  <img src={job.company.logo} alt={job.company.name} className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-200">
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900">{job.title}</h1>
                  <p className="text-slate-500 font-medium">{job.company?.name}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`badge border ${STATUS_COLORS[job.employmentType] || 'badge-type'}`}>
                      {job.employmentType}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-slate-600 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400" />{job.location}</div>
                <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-blue-400" />{job.experienceRequired || '0'} yrs exp</div>
                {job.salary && <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-blue-400" />{job.salary}</div>}
                {job.company?.industry && <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-400" />{job.company.industry}</div>}
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="font-bold text-slate-900 mb-3">Job Description</h2>
              <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{job.description}</div>
            </div>

            {/* Skills */}
            {job.requiredSkills?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-bold text-slate-900 mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill) => (
                    <span key={skill} className="badge badge-skill border">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Apply */}
            {user?.role === 'student' ? (
              <div className="card p-5">
                {hasApplied ? (
                  <div className="text-center">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">Already Applied!</h3>
                    <p className="text-sm text-slate-500 mb-3">Track your application status below.</p>
                    <Link to="/student/applied" className="btn-secondary w-full justify-center text-sm py-2.5">
                      View Applications
                    </Link>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setShowApplyModal(true)}
                      className="btn-primary w-full justify-center py-3 text-sm mb-3"
                    >
                      <Send className="w-4 h-4" /> Apply Now
                    </button>
                    <div className="flex gap-2">
                      <Link to={`/student/ai`} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 bg-purple-50 rounded-lg py-2 transition-colors border border-purple-200">
                        <Target className="w-3.5 h-3.5" /> Check Fit
                      </Link>
                      <Link to={`/student/ai`} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-cyan-600 hover:text-cyan-700 bg-cyan-50 rounded-lg py-2 transition-colors border border-cyan-200">
                        <MessageSquare className="w-3.5 h-3.5" /> Interview Prep
                      </Link>
                    </div>
                  </>
                )}
              </div>
            ) : !user ? (
              <div className="card p-5 text-center">
                <p className="text-sm text-slate-600 mb-3">Sign in to apply for this job</p>
                <Link to="/login" className="btn-primary w-full justify-center text-sm py-2.5">
                  Sign In to Apply
                </Link>
              </div>
            ) : null}

            {/* Company Info */}
            <div className="card p-5">
              <h3 className="font-bold text-slate-900 mb-3">About the Company</h3>
              <p className="font-semibold text-slate-800">{job.company?.name}</p>
              {job.company?.industry && (
                <p className="text-xs text-slate-500 mt-1 mb-2">{job.company.industry}</p>
              )}
              {job.company?.website && (
                <a href={job.company.website} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" /> Visit Website
                </a>
              )}
            </div>

            <div className="card p-4 text-xs text-slate-500 text-center">
              <Clock className="w-4 h-4 mx-auto mb-1 text-slate-400" />
              Posted {new Date(job.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
              <br />
              <span className="font-medium text-slate-600">{job.applicationsCount || 0} applicants</span>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-fade-in-up">
            <h2 className="text-xl font-extrabold text-slate-900 mb-1">Apply for {job.title}</h2>
            <p className="text-slate-500 text-sm mb-5">{job.company?.name}</p>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="form-label">Cover Letter</label>
                <button
                  onClick={generateCoverLetter}
                  disabled={generating}
                  className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200 transition-colors"
                >
                  {generating ? <Spinner size="sm" /> : '✨ AI Generate'}
                </button>
              </div>
              <textarea
                rows={8}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Write a cover letter or click 'AI Generate' to create one instantly..."
                className="form-input resize-none text-sm"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowApplyModal(false)}
                className="btn-secondary flex-1 justify-center py-2.5 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applying}
                className="btn-primary flex-1 justify-center py-2.5 text-sm"
              >
                {applying ? <Spinner size="sm" /> : <><Send className="w-4 h-4" /> Submit Application</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
