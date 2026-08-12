import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/common/Navbar';
import Spinner from '../../components/common/Spinner';
import PostJob from './PostJob';
import toast from 'react-hot-toast';
import {
  Briefcase, MapPin, Users, Edit3, Trash2, Eye,
  Plus, ToggleLeft, ToggleRight, X
} from 'lucide-react';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editJob, setEditJob] = useState(null);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/jobs/recruiter/my-jobs');
      setJobs(data.jobs || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter(j => j._id !== id));
      toast.success('Job deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleToggle = async (job) => {
    try {
      const { data } = await api.put(`/jobs/${job._id}`, { isActive: !job.isActive });
      setJobs(jobs.map(j => j._id === job._id ? data.job : j));
      toast.success(data.job.isActive ? 'Job activated' : 'Job deactivated');
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Manage Jobs</h1>
            <p className="text-slate-500 text-sm">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
          </div>
          <Link to="/recruiter/post-job" className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" /> Post New Job
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : jobs.length === 0 ? (
          <div className="card p-12 text-center">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-bold text-slate-700 mb-2">No jobs posted yet</h3>
            <p className="text-slate-500 text-sm mb-5">Post your first job to start receiving applications</p>
            <Link to="/recruiter/post-job" className="btn-primary text-sm">
              <Plus className="w-4 h-4" /> Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job._id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900">{job.title}</h3>
                      <span className={`badge ${job.isActive ? 'badge-selected' : 'badge-rejected'}`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.employmentType}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{job.applicationsCount || 0} applicants</span>
                    </div>
                    {job.requiredSkills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {job.requiredSkills.slice(0, 5).map(s => (
                          <span key={s} className="badge badge-skill border text-xs">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link to={`/recruiter/jobs/${job._id}/applicants`} className="p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors" title="View Applicants">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button onClick={() => setEditJob(job)} className="p-2 rounded-lg text-slate-500 hover:bg-amber-50 hover:text-amber-600 transition-colors" title="Edit Job">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleToggle(job)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors" title={job.isActive ? 'Deactivate' : 'Activate'}>
                      {job.isActive ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDelete(job._id)} className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editJob && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Edit Job</h2>
              <button onClick={() => setEditJob(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <PostJob
                editData={editJob}
                onClose={() => {
                  setEditJob(null);
                  fetchJobs();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
