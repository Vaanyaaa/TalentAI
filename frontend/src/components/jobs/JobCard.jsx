import { MapPin, Briefcase, Clock, DollarSign, Bookmark, BookmarkCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const employmentColors = {
  'Full-time': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Part-time': 'bg-purple-50 text-purple-700 border-purple-200',
  Internship: 'bg-orange-50 text-orange-700 border-orange-200',
  Contract: 'bg-slate-50 text-slate-700 border-slate-200',
  Remote: 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

const JobCard = ({ job, saved: initialSaved = false, onUnsave }) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to save jobs');
    setSaving(true);
    try {
      if (saved) {
        await api.delete(`/users/save-job/${job._id}`);
        setSaved(false);
        toast.success('Job removed from saved');
        onUnsave && onUnsave(job._id);
      } else {
        await api.post(`/users/save-job/${job._id}`);
        setSaved(true);
        toast.success('Job saved!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)}w ago`;
  };

  return (
    <div className="card group relative overflow-hidden">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            {job.company?.logo ? (
              <img
                src={job.company.logo}
                alt={job.company.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center flex-shrink-0 border border-blue-200">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                {job.title}
              </h3>
              <p className="text-sm text-slate-500 truncate">{job.company?.name}</p>
            </div>
          </div>

          {user?.role === 'student' && (
            <button
              onClick={handleSave}
              disabled={saving}
              className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                saved
                  ? 'bg-blue-50 text-blue-600 hover:bg-red-50 hover:text-red-500'
                  : 'text-slate-400 hover:bg-blue-50 hover:text-blue-600'
              }`}
              title={saved ? 'Unsave job' : 'Save job'}
            >
              {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`badge border ${employmentColors[job.employmentType] || 'badge-type'}`}>
            {job.employmentType}
          </span>
          {job.requiredSkills?.slice(0, 2).map((skill) => (
            <span key={skill} className="badge badge-skill border">
              {skill}
            </span>
          ))}
          {job.requiredSkills?.length > 2 && (
            <span className="badge bg-slate-50 text-slate-500 border border-slate-200">
              +{job.requiredSkills.length - 2}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          {job.salary && (
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{job.salary}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{job.experienceRequired || '0'} yrs exp</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{timeAgo(job.createdAt)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-400">
            {job.applicationsCount || 0} applicants
          </span>
          <Link
            to={`/jobs/${job._id}`}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
