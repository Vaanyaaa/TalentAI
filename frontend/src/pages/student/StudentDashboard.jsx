import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import StatWidget from '../../components/dashboard/StatWidget';
import JobCard from '../../components/jobs/JobCard';
import Spinner from '../../components/common/Spinner';
import Navbar from '../../components/common/Navbar';
import {
  Briefcase, BookmarkCheck, FileText, Star, ChevronRight,
  User, Upload, AlertCircle, CheckCircle2, ArrowRight, Sparkles, Target
} from 'lucide-react';

const STATUS_CONFIG = {
  Applied:            { bg: 'badge-applied',     label: 'Applied' },
  Shortlisted:        { bg: 'badge-shortlisted',  label: 'Shortlisted' },
  'Interview Scheduled': { bg: 'badge-interview', label: 'Interview' },
  Selected:           { bg: 'badge-selected',     label: 'Selected' },
  Rejected:           { bg: 'badge-rejected',     label: 'Rejected' },
};

const getProfileCompletion = (user) => {
  const checks = [
    !!user?.profilePicture,
    !!user?.bio,
    (user?.skills?.length || 0) > 0,
    (user?.education?.length || 0) > 0,
    !!user?.resume,
    (user?.experience?.length || 0) > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, savedRes] = await Promise.all([
          api.get('/applications/my'),
          api.get('/users/saved-jobs'),
        ]);
        setApplications(appRes.data.applications || []);
        setSavedJobs(savedRes.data.savedJobs || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const profileCompletion = getProfileCompletion(user);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size="lg" />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)', color: 'white', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} style={{ width: '4rem', height: '4rem', borderRadius: '1rem', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
            ) : (
              <div style={{ width: '4rem', height: '4rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, border: '1px solid rgba(255,255,255,0.3)' }}>
                {user?.name?.charAt(0)}
              </div>
            )}
            <div>
              <p style={{ color: '#bfdbfe', fontSize: '0.875rem', fontWeight: 500 }}>Good evening 👋</p>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user?.name}</h1>
              <p style={{ color: '#bfdbfe', fontSize: '0.875rem' }}>Student · TalentAI</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <StatWidget label="Total Applications" value={applications.length} icon={Briefcase} color="blue" />
          <StatWidget
            label="Shortlisted"
            value={applications.filter(a => ['Shortlisted', 'Interview Scheduled', 'Selected'].includes(a.status)).length}
            icon={CheckCircle2}
            color="green"
          />
          <StatWidget label="Saved Jobs" value={savedJobs.length} icon={BookmarkCheck} color="purple" />
          <StatWidget
            label="Resume Score"
            value={user?.resumeScore ? `${user.resumeScore}/100` : 'N/A'}
            icon={Star}
            color={user?.resumeScore >= 70 ? 'green' : 'yellow'}
            description={user?.resumeScore ? 'AI analyzed' : 'Upload resume first'}
          />
        </div>

        {/* Main + Sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
          {/* Main Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Recent Applications */}
            <div className="card">
              <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                  <Briefcase style={{ width: '1rem', height: '1rem', color: '#2563eb' }} /> Recent Applications
                </h2>
                <Link to="/student/applied" style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
                  View all <ChevronRight style={{ width: '1rem', height: '1rem' }} />
                </Link>
              </div>
              <div style={{ borderTop: '1px solid #f1f5f9' }}>
                {applications.length === 0 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
                    <Briefcase style={{ width: '2rem', height: '2rem', color: '#cbd5e1', margin: '0 auto 0.5rem' }} />
                    No applications yet.{' '}
                    <Link to="/jobs" style={{ color: '#2563eb', fontWeight: 500 }}>Browse jobs →</Link>
                  </div>
                ) : (
                  applications.slice(0, 5).map((app) => {
                    const sc = STATUS_CONFIG[app.status] || STATUS_CONFIG.Applied;
                    return (
                      <div key={app._id} style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.job?.title}</p>
                          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.job?.company?.name} · {app.job?.location}</p>
                        </div>
                        <span className={`badge ${sc.bg}`} style={{ flexShrink: 0 }}>{sc.label}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Saved Jobs */}
            {savedJobs.length > 0 && (
              <div>
                <h2 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                  <BookmarkCheck style={{ width: '1rem', height: '1rem', color: '#2563eb' }} /> Saved Jobs
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {savedJobs.slice(0, 4).map((job) => (
                    <JobCard key={job._id} job={job} saved />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Profile Completion */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <User style={{ width: '1rem', height: '1rem', color: '#2563eb' }} /> Profile Completion
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#2563eb' }}>{profileCompletion}%</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {profileCompletion === 100 ? '✅ Complete!' : 'Keep going!'}
                </span>
              </div>
              <div className="skill-bar" style={{ marginBottom: '1rem' }}>
                <div className="skill-bar-fill" style={{ width: `${profileCompletion}%` }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { label: 'Profile Photo', done: !!user?.profilePicture },
                  { label: 'Bio', done: !!user?.bio },
                  { label: 'Skills', done: (user?.skills?.length || 0) > 0 },
                  { label: 'Education', done: (user?.education?.length || 0) > 0 },
                  { label: 'Resume', done: !!user?.resume },
                ].map(({ label, done }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                    {done ? (
                      <CheckCircle2 style={{ width: '0.875rem', height: '0.875rem', color: '#10b981', flexShrink: 0 }} />
                    ) : (
                      <AlertCircle style={{ width: '0.875rem', height: '0.875rem', color: '#cbd5e1', flexShrink: 0 }} />
                    )}
                    <span style={{ color: done ? '#475569' : '#94a3b8' }}>{label}</span>
                  </div>
                ))}
              </div>
              <Link to="/student/profile/edit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', fontSize: '0.875rem', padding: '0.5rem 1rem', display: 'flex' }}>
                Complete Profile
              </Link>
            </div>

            {/* AI Tools */}
            <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)', borderRadius: '1rem', padding: '1.25rem', color: 'white' }}>
              <Sparkles style={{ width: '1.75rem', height: '1.75rem', marginBottom: '0.75rem', color: '#a5f3fc' }} />
              <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>AI Career Tools</h3>
              <p style={{ color: '#bfdbfe', fontSize: '0.75rem', marginBottom: '1rem' }}>Get your resume analyzed and match jobs with AI.</p>
              <Link
                to="/student/ai"
                style={{ background: 'white', color: '#2563eb', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none' }}
              >
                <Target style={{ width: '1rem', height: '1rem' }} /> Open AI Tools
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { to: '/jobs', label: 'Browse All Jobs', icon: Briefcase, bg: '#eff6ff', color: '#2563eb' },
                  { to: '/student/ai', label: 'Analyze Resume', icon: FileText, bg: '#faf5ff', color: '#7c3aed' },
                  { to: '/student/profile/edit', label: 'Edit Profile', icon: User, bg: '#f0fdf4', color: '#059669' },
                ].map(({ to, label, icon: Icon, bg, color }) => (
                  <Link
                    key={to}
                    to={to}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.75rem', textDecoration: 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon style={{ width: '1rem', height: '1rem', color }} />
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>{label}</span>
                    <ArrowRight style={{ width: '0.875rem', height: '0.875rem', color: '#cbd5e1', marginLeft: 'auto' }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
