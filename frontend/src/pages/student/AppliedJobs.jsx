import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/common/Navbar';
import Spinner from '../../components/common/Spinner';
import { Briefcase, MapPin, Clock, ChevronRight } from 'lucide-react';

const STATUS_CONFIG = {
  Applied:               { badge: 'badge-applied',     label: 'Applied',            step: 0 },
  Shortlisted:           { badge: 'badge-shortlisted',  label: 'Shortlisted',        step: 1 },
  'Interview Scheduled': { badge: 'badge-interview',    label: 'Interview Scheduled', step: 2 },
  Selected:              { badge: 'badge-selected',     label: 'Selected 🎉',         step: 3 },
  Rejected:              { badge: 'badge-rejected',     label: 'Rejected',            step: -1 },
};

const PIPELINE = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected'];

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    api.get('/applications/my')
      .then(({ data }) => setApplications(data.applications || []))
      .finally(() => setLoading(false));
  }, []);

  const statuses = ['All', ...Object.keys(STATUS_CONFIG)];
  const filtered = filter === 'All' ? applications : applications.filter(a => a.status === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">My Applications</h1>
        <p className="text-slate-500 text-sm mb-6">{applications.length} total applications</p>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === s
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {s}
              {s !== 'All' && (
                <span className={`ml-1.5 ${filter === s ? 'text-blue-200' : 'text-slate-400'}`}>
                  ({applications.filter(a => a.status === s).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-bold text-slate-700 mb-1">No applications {filter !== 'All' ? `with "${filter}" status` : 'yet'}</h3>
            {filter === 'All' && (
              <Link to="/jobs" className="text-blue-600 text-sm hover:underline">Browse and apply to jobs →</Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app) => {
              const sc = STATUS_CONFIG[app.status] || STATUS_CONFIG.Applied;
              const currentStep = sc.step;

              return (
                <div key={app._id} className="card p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900">{app.job?.title}</h3>
                      <p className="text-sm text-slate-500">{app.job?.company?.name}</p>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs text-slate-500">
                        {app.job?.location && (
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{app.job.location}</span>
                        )}
                        {app.job?.employmentType && (
                          <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{app.job.employmentType}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(app.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </span>
                      </div>
                    </div>
                    <span className={`badge ${sc.badge} flex-shrink-0`}>{sc.label}</span>
                  </div>

                  {/* Status Pipeline (not rejected) */}
                  {app.status !== 'Rejected' && (
                    <div className="flex items-center gap-0 mt-2">
                      {PIPELINE.map((step, idx) => (
                        <div key={step} className="flex items-center flex-1">
                          <div className={`flex flex-col items-center flex-1 ${idx > 0 ? 'relative' : ''}`}>
                            {idx > 0 && (
                              <div className={`absolute -left-1/2 right-1/2 h-0.5 top-2 ${
                                idx <= currentStep ? 'bg-blue-500' : 'bg-slate-200'
                              }`} />
                            )}
                            <div className={`w-4 h-4 rounded-full border-2 z-10 relative transition-colors ${
                              idx < currentStep
                                ? 'bg-emerald-500 border-emerald-500'
                                : idx === currentStep
                                ? 'bg-blue-600 border-blue-600'
                                : 'bg-white border-slate-300'
                            }`} />
                            <span className={`text-xs mt-1 text-center hidden sm:block ${
                              idx <= currentStep ? 'text-slate-700 font-medium' : 'text-slate-400'
                            }`}>
                              {step === 'Interview Scheduled' ? 'Interview' : step}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {app.job?._id && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <Link to={`/jobs/${app.job._id}`} className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium">
                        View Job <ChevronRight className="w-3 h-3" />
                      </Link>
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

export default AppliedJobs;
