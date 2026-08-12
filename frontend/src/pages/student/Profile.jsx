import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import {
  User, Mail, MapPin, Link2, FileText, Edit3,
  GraduationCap, Briefcase, FolderOpen, Code, Star, ExternalLink, Globe
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="card p-6 mb-5">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-200 shadow-sm flex-shrink-0" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-4xl font-black text-white flex-shrink-0 shadow-sm">
                {user?.name?.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">{user?.name}</h1>
                  <p className="text-slate-500 text-sm capitalize">{user?.role} · TalentAI</p>
                </div>
                <Link to="/student/profile/edit" className="btn-primary text-sm py-2 px-4 flex-shrink-0">
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </Link>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">{user?.bio || 'No bio added yet. Click Edit Profile to add one.'}</p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{user?.email}</span>
                {user?.resumeScore > 0 && (
                  <span className="flex items-center gap-1 text-amber-600 font-medium">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> Resume Score: {user.resumeScore}/100
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Skills */}
          <div className="card p-5">
            <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-600" /> Skills
            </h2>
            {user?.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map(s => (
                  <span key={s} className="badge badge-skill border">{s}</span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No skills added yet</p>
            )}
          </div>

          {/* Resume */}
          <div className="card p-5">
            <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" /> Resume
            </h2>
            {user?.resume ? (
              <a href={user.resume} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium">
                <ExternalLink className="w-4 h-4" /> View Resume PDF
              </a>
            ) : (
              <p className="text-slate-400 text-sm">No resume uploaded</p>
            )}
          </div>

          {/* Portfolio Links */}
          <div className="card p-5">
            <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-blue-600" /> Portfolio
            </h2>
            {user?.portfolioLinks?.filter(Boolean).length > 0 ? (
              <div className="space-y-2">
                {user.portfolioLinks.filter(Boolean).map((link, i) => (
                  <a key={i} href={link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline text-sm truncate">
                    <Globe className="w-3.5 h-3.5 flex-shrink-0" /> {link}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No links added</p>
            )}
          </div>
        </div>

        {/* Education */}
        {user?.education?.length > 0 && (
          <div className="card p-5 mt-5">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600" /> Education
            </h2>
            <div className="space-y-4">
              {user.education.map((edu, i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</p>
                    <p className="text-slate-600 text-sm">{edu.institution}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {edu.startYear} – {edu.endYear || 'Present'}
                      {edu.grade && ` · ${edu.grade}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {user?.experience?.length > 0 && (
          <div className="card p-5 mt-5">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" /> Experience
            </h2>
            <div className="space-y-4">
              {user.experience.map((exp, i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900">{exp.role}</p>
                    <p className="text-slate-600 text-sm">{exp.company}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</p>
                    {exp.description && <p className="text-slate-600 text-sm mt-1.5 leading-relaxed">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {user?.projects?.length > 0 && (
          <div className="card p-5 mt-5">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-blue-600" /> Projects
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {user.projects.map((proj, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all">
                  <h3 className="font-semibold text-slate-900 mb-1">{proj.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-2">{proj.description}</p>
                  {proj.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {proj.techStack.map(t => <span key={t} className="badge badge-skill border text-xs">{t}</span>)}
                    </div>
                  )}
                  <div className="flex gap-3 text-xs">
                    {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3" /> Live</a>}
                    {proj.github && <a href={proj.github} target="_blank" rel="noreferrer" className="text-slate-600 hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3" /> GitHub</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!user?.education?.length && !user?.experience?.length && !user?.projects?.length && (
          <div className="card p-10 mt-5 text-center">
            <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-bold text-slate-700 mb-2">Complete your profile to stand out!</h3>
            <p className="text-slate-500 text-sm mb-4">Add your education, experience, projects and skills to get noticed by recruiters.</p>
            <Link to="/student/profile/edit" className="btn-primary text-sm py-2 px-6">Complete Profile</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
