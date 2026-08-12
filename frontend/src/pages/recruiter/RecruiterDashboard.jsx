import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Navbar from '../../components/common/Navbar';
import StatWidget from '../../components/dashboard/StatWidget';
import Spinner from '../../components/common/Spinner';
import {
  Briefcase, Users, CheckCircle2, Clock, Plus,
  ChevronRight, ArrowRight, Eye, Building2
} from 'lucide-react';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          api.get('/applications/recruiter/stats'),
          api.get('/jobs/recruiter/my-jobs'),
        ]);
        setStats(statsRes.data);
        setJobs(jobsRes.data.jobs || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const STATUS_CONFIG = {
    Applied:               { badge: 'badge-applied',     label: 'Applied' },
    Shortlisted:           { badge: 'badge-shortlisted',  label: 'Shortlisted' },
    'Interview Scheduled': { badge: 'badge-interview',    label: 'Interview' },
    Selected:              { badge: 'badge-selected',     label: 'Selected' },
    Rejected:              { badge: 'badge-rejected',     label: 'Rejected' },
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-4 py-8">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          {user?.company?.logo ? (
            <img src={user.company.logo} alt={user.company.name} className="w-16 h-16 rounded-2xl object-cover border border-white/20 shadow-lg" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl font-black">
              {(user?.company?.name || user?.name)?.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-blue-300 text-sm font-medium">Recruiter Dashboard</p>
            <h1 className="text-2xl font-extrabold">{user?.company?.name || user?.name}</h1>
            <p className="text-slate-400 text-sm">{user?.company?.industry || 'Company'}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatWidget label="Total Jobs" value={stats?.stats?.totalJobs || 0} icon={Briefcase} color="blue" />
          <StatWidget label="Total Applicants" value={stats?.stats?.totalApplicants || 0} icon={Users} color="purple" />
          <StatWidget label="Shortlisted" value={stats?.stats?.shortlisted || 0} icon={CheckCircle2} color="green" />
          <StatWidget label="Active Jobs" value={jobs.filter(j => j.isActive).length} icon={Clock} color="cyan" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <div className="lg:col-span-2 card">
            <div className="card-header flex items-center justify-between">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" /> Recent Applicants
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {(!stats?.recentApplications || stats.recentApplications.length === 0) ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  No applications received yet.
                </div>
              ) : (
                stats.recentApplications.map((app) => {
                  const sc = STATUS_CONFIG[app.status] || STATUS_CONFIG.Applied;
                  return (
                    <div key={app._id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        {app.applicant?.profilePicture ? (
                          <img src={app.applicant.profilePicture} alt={app.applicant.name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {app.applicant?.name?.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">{app.applicant?.name}</p>
                          <p className="text-xs text-slate-500 truncate">{app.job?.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`badge ${sc.badge}`}>{sc.label}</span>
                        {app.job?._id && (
                          <Link to={`/recruiter/jobs/${app.job._id}/applicants`} className="text-slate-400 hover:text-blue-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick Actions */}
            <div className="card p-5">
              <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link to="/recruiter/post-job" className="btn-primary w-full justify-center text-sm py-3">
                  <Plus className="w-4 h-4" /> Post a New Job
                </Link>
                <Link to="/recruiter/jobs" className="btn-secondary w-full justify-center text-sm py-2.5">
                  <Briefcase className="w-4 h-4" /> Manage All Jobs
                </Link>
                <Link to="/recruiter/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group border border-slate-200">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">Company Profile</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 ml-auto" />
                </Link>
              </div>
            </div>

            {/* Recent Jobs */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">Your Jobs</h3>
                <Link to="/recruiter/jobs" className="text-sm text-blue-600 hover:underline">All →</Link>
              </div>
              {jobs.length === 0 ? (
                <p className="text-slate-400 text-sm">No jobs posted yet</p>
              ) : (
                <div className="space-y-3">
                  {jobs.slice(0, 4).map(job => (
                    <div key={job._id} className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 last:border-0">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{job.title}</p>
                        <p className="text-xs text-slate-400">{job.applicationsCount || 0} applicants</p>
                      </div>
                      <Link to={`/recruiter/jobs/${job._id}/applicants`} className="text-xs text-blue-600 hover:underline flex-shrink-0">View</Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
