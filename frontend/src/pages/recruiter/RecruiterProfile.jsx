import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { Building2, Globe, Mail, Edit3, ExternalLink } from 'lucide-react';

const RecruiterProfile = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="card p-6 mb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {user?.company?.logo || user?.profilePicture ? (
                <img src={user.company?.logo || user.profilePicture} alt={user.company?.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 shadow-sm flex-shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-700 to-blue-800 flex items-center justify-center text-3xl font-black text-white flex-shrink-0">
                  {(user?.company?.name || user?.name)?.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">{user?.company?.name || user?.name}</h1>
                {user?.company?.industry && <p className="text-slate-500 text-sm">{user.company.industry}</p>}
                <p className="text-slate-400 text-xs mt-1 flex items-center gap-1"><Mail className="w-3 h-3" />{user?.email}</p>
                {user?.company?.website && (
                  <a href={user.company.website} target="_blank" rel="noreferrer" className="text-blue-600 text-xs hover:underline flex items-center gap-1 mt-1">
                    <Globe className="w-3 h-3" /> {user.company.website}
                  </a>
                )}
              </div>
            </div>
            <Link to="/student/profile/edit" className="btn-secondary text-sm py-2 px-3 flex-shrink-0">
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </Link>
          </div>

          {user?.company?.description && (
            <div className="mt-5 pt-4 border-t border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-2">About the Company</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{user.company.description}</p>
            </div>
          )}
        </div>

        <div className="card p-5">
          <h2 className="font-bold text-slate-900 mb-3">Quick Navigation</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { to: '/recruiter/dashboard', label: 'Dashboard' },
              { to: '/recruiter/jobs', label: 'Manage Jobs' },
              { to: '/recruiter/post-job', label: 'Post a New Job' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm font-medium text-slate-700 hover:text-blue-700">
                <ExternalLink className="w-4 h-4" /> {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;
