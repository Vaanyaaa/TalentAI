import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/common/Navbar';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import {
  Users, ArrowLeft, Mail, FileText, Eye, ChevronDown,
  CheckCircle2, XCircle, Clock, Star
} from 'lucide-react';

import { viewResumePdf } from '../../utils/resumeUtils';

const STATUS_OPTIONS = [
  { value: 'Applied',            label: 'Applied',             badge: 'badge-applied' },
  { value: 'Shortlisted',        label: 'Shortlisted',         badge: 'badge-shortlisted' },
  { value: 'Interview Scheduled',label: 'Interview Scheduled', badge: 'badge-interview' },
  { value: 'Selected',           label: 'Selected',            badge: 'badge-selected' },
  { value: 'Rejected',           label: 'Rejected',            badge: 'badge-rejected' },
];

const ViewApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, jobRes] = await Promise.all([
          api.get(`/applications/job/${jobId}`),
          api.get(`/jobs/${jobId}`),
        ]);
        setApplications(appRes.data.applications || []);
        setJob(jobRes.data.job);
      } catch {
        toast.error('Failed to load applicants');
        navigate('/recruiter/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId, navigate]);

  const updateStatus = async (appId, status) => {
    setUpdating(appId);
    try {
      const { data } = await api.put(`/applications/${appId}/status`, { status });
      setApplications(applications.map(a => a._id === appId ? { ...a, status } : a));
      toast.success(`Status updated to "${status}"`);
    } catch { toast.error('Failed to update status'); } finally { setUpdating(null); }
  };

  const filtered = filterStatus === 'All' ? applications : applications.filter(a => a.status === filterStatus);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-5 group transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        {job && (
          <div className="card p-5 mb-6">
            <h1 className="text-xl font-extrabold text-slate-900">{job.title}</h1>
            <p className="text-slate-500 text-sm">{job.company?.name} · {job.location} · {job.employmentType}</p>
            <p className="text-slate-400 text-xs mt-1">{applications.length} total applications</p>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-5">
          {['All', ...STATUS_OPTIONS.map(s => s.value)].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filterStatus === s
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {s} ({s === 'All' ? applications.length : applications.filter(a => a.status === s).length})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-bold text-slate-700 mb-1">No applicants {filterStatus !== 'All' ? `with "${filterStatus}" status` : 'yet'}</h3>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(app => {
              const sc = STATUS_OPTIONS.find(s => s.value === app.status) || STATUS_OPTIONS[0];
              return (
                <div key={app._id} className="card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {app.applicant?.profilePicture ? (
                        <img src={app.applicant.profilePicture} alt={app.applicant.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-slate-200" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {app.applicant?.name?.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900">{app.applicant?.name}</h3>
                        <p className="text-sm text-slate-500">{app.applicant?.email}</p>
                        {app.applicant?.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {app.applicant.skills.slice(0, 4).map(s => (
                              <span key={s} className="badge badge-skill border text-xs">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`badge ${sc.badge}`}>{sc.label}</span>
                      {app.applicant?.resume && (
                        <button
                          type="button"
                          onClick={() => viewResumePdf(app.applicant.resume, app.applicant.name)}
                          className="p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors bg-transparent border-0 cursor-pointer"
                          title="View Resume PDF"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedApp(selectedApp?._id === app._id ? null : app)}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors" title="View Profile">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedApp?._id === app._id && (
                    <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in">
                      {app.coverLetter && (
                        <div className="mb-4 bg-slate-50 rounded-xl p-4">
                          <p className="text-xs font-semibold text-slate-500 mb-2">Cover Letter</p>
                          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{app.coverLetter}</p>
                        </div>
                      )}
                      {app.applicant?.bio && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-slate-500 mb-1">Bio</p>
                          <p className="text-sm text-slate-600">{app.applicant.bio}</p>
                        </div>
                      )}

                      {/* Status Update */}
                      <div className="flex items-center gap-2 flex-wrap mt-3">
                        <span className="text-xs font-semibold text-slate-500 mr-1">Update Status:</span>
                        {STATUS_OPTIONS.map(({ value, label, badge }) => (
                          <button
                            key={value}
                            disabled={app.status === value || updating === app._id}
                            onClick={() => updateStatus(app._id, value)}
                            className={`badge ${badge} border cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-default`}
                          >
                            {updating === app._id ? '...' : label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewApplicants;
