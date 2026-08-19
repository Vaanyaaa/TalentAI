import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Navbar from '../../components/common/Navbar';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import {
  User, Mail, Briefcase, GraduationCap, Code, FolderOpen,
  Link2, Upload, Camera, FileText, Plus, Trash2, Edit3,
  CheckCircle2, Save, X, Download, ExternalLink
} from 'lucide-react';
import { viewResumePdf, downloadResumePdf } from '../../utils/resumeUtils';

const SKILL_OPTIONS = [
  'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'MongoDB', 'SQL', 'Express.js',
  'TypeScript', 'HTML', 'CSS', 'Tailwind CSS', 'Git', 'Docker', 'AWS', 'Machine Learning',
  'Data Analysis', 'C++', 'PHP', 'Flutter', 'React Native', 'GraphQL', 'REST APIs',
];

const EditProfile = () => {
  const { user, updateUser, loadUser } = useAuth();

  const [section, setSection] = useState('basic');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const [basic, setBasic] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
  });

  const [skills, setSkills] = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState('');

  const [education, setEducation] = useState(user?.education || []);
  const [experience, setExperience] = useState(user?.experience || []);
  const [projects, setProjects] = useState(user?.projects || []);
  const [portfolioLinks, setPortfolioLinks] = useState(user?.portfolioLinks || []);

  const [company, setCompany] = useState(user?.company || {
    name: '', description: '', website: '', industry: ''
  });

  const SECTIONS = user?.role === 'student'
    ? [
        { id: 'basic', label: 'Basic Info', icon: User },
        { id: 'skills', label: 'Skills', icon: Code },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'projects', label: 'Projects', icon: FolderOpen },
        { id: 'links', label: 'Links & Resume', icon: Link2 },
      ]
    : [
        { id: 'basic', label: 'Basic Info', icon: User },
        { id: 'company', label: 'Company', icon: Briefcase },
        { id: 'links', label: 'Logo & Info', icon: Link2 },
      ];

  const addSkill = (skill) => {
    const s = (skill || skillInput).trim();
    if (s && !skills.includes(s)) setSkills([...skills, s]);
    setSkillInput('');
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const payload = {
        name: basic.name,
        bio: basic.bio,
        ...(user?.role === 'student' ? { skills, education, experience, projects, portfolioLinks } : {}),
        ...(user?.role === 'recruiter' ? { company } : {}),
      };
      const { data } = await api.put('/users/profile', payload);
      updateUser(data.user);
      toast.success('Profile saved! ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAvatar(true);
    const fd = new FormData();
    fd.append('avatar', file);
    try {
      const { data } = await api.post('/users/upload-avatar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(data.user);
      toast.success('Profile picture updated!');
    } catch { toast.error('Upload failed'); } finally { setUploadingAvatar(false); }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingResume(true);
    const fd = new FormData();
    fd.append('resume', file);
    try {
      const { data } = await api.post('/users/upload-resume', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(data.user);
      toast.success('Resume uploaded!');
    } catch { toast.error('Upload failed'); } finally { setUploadingResume(false); }
  };

  const addEdu = () => setEducation([...education, { institution: '', degree: '', field: '', startYear: '', endYear: '', grade: '' }]);
  const removeEdu = (i) => setEducation(education.filter((_, idx) => idx !== i));
  const updateEdu = (i, key, val) => setEducation(education.map((e, idx) => idx === i ? { ...e, [key]: val } : e));

  const addExp = () => setExperience([...experience, { company: '', role: '', location: '', startDate: '', endDate: '', description: '', current: false }]);
  const removeExp = (i) => setExperience(experience.filter((_, idx) => idx !== i));
  const updateExp = (i, key, val) => setExperience(experience.map((e, idx) => idx === i ? { ...e, [key]: val } : e));

  const addProject = () => setProjects([...projects, { title: '', description: '', techStack: [], link: '', github: '' }]);
  const removeProject = (i) => setProjects(projects.filter((_, idx) => idx !== i));
  const updateProject = (i, key, val) => setProjects(projects.map((p, idx) => idx === i ? { ...p, [key]: val } : p));

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Edit Profile</h1>
            <p className="text-slate-500 text-sm">Keep your profile updated to attract recruiters</p>
          </div>
          <Link to="/student/profile" className="btn-secondary text-sm py-2">← Back to Profile</Link>
        </div>

        {/* Avatar */}
        <div className="card p-5 mb-6 flex items-center gap-5">
          <div className="relative">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-3xl font-black text-white">
                {user?.name?.charAt(0)}
              </div>
            )}
            <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
              {uploadingAvatar ? <Spinner size="sm" /> : <Camera className="w-3.5 h-3.5 text-white" />}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>
          <div>
            <p className="font-bold text-slate-900">{user?.name}</p>
            <p className="text-sm text-slate-500 capitalize">{user?.role}</p>
            <p className="text-xs text-slate-400 mt-1">Click the camera icon to change your photo</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Section Nav */}
          <div className="lg:col-span-1">
            <div className="card p-2 sticky top-24">
              {SECTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSection(id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    section === id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 card p-6">
            {/* BASIC */}
            {section === 'basic' && (
              <div className="space-y-4">
                <h2 className="font-bold text-slate-900 flex items-center gap-2"><User className="w-4 h-4 text-blue-600" /> Basic Info</h2>
                <div>
                  <label className="form-label">Full Name</label>
                  <input type="text" value={basic.name} onChange={e => setBasic(p => ({...p, name: e.target.value}))} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Professional Bio</label>
                  <textarea rows={4} value={basic.bio} onChange={e => setBasic(p => ({...p, bio: e.target.value}))} placeholder="Write a short bio about yourself..." className="form-input resize-none" />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input type="email" value={user?.email || ''} disabled className="form-input bg-slate-50 text-slate-500 cursor-not-allowed" />
                </div>
              </div>
            )}

            {/* SKILLS */}
            {section === 'skills' && (
              <div className="space-y-4">
                <h2 className="font-bold text-slate-900 flex items-center gap-2"><Code className="w-4 h-4 text-blue-600" /> Skills</h2>
                <div className="flex gap-2">
                  <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); }}}
                    placeholder="Type a skill and press Enter..."
                    className="form-input flex-1 text-sm" />
                  <button onClick={() => addSkill()} className="btn-primary text-sm py-2 px-4">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map(s => (
                    <span key={s} className="badge badge-skill border flex items-center gap-1.5">
                      {s}
                      <button onClick={() => setSkills(skills.filter(sk => sk !== s))} className="hover:text-red-500 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="mt-2">
                  <p className="form-label mb-2">Quick Add:</p>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_OPTIONS.filter(s => !skills.includes(s)).map(s => (
                      <button key={s} onClick={() => addSkill(s)} className="badge bg-slate-100 text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors cursor-pointer">
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* EDUCATION */}
            {section === 'education' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-slate-900 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-blue-600" /> Education</h2>
                  <button onClick={addEdu} className="btn-secondary text-sm py-1.5"><Plus className="w-3.5 h-3.5" /> Add</button>
                </div>
                {education.map((edu, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-4 space-y-3 relative">
                    <button onClick={() => removeEdu(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="form-label">Institution *</label>
                        <input type="text" value={edu.institution} onChange={e => updateEdu(i, 'institution', e.target.value)} className="form-input text-sm" placeholder="College/University name" />
                      </div>
                      <div>
                        <label className="form-label">Degree *</label>
                        <input type="text" value={edu.degree} onChange={e => updateEdu(i, 'degree', e.target.value)} className="form-input text-sm" placeholder="B.Tech, BCA..." />
                      </div>
                      <div>
                        <label className="form-label">Field of Study</label>
                        <input type="text" value={edu.field} onChange={e => updateEdu(i, 'field', e.target.value)} className="form-input text-sm" placeholder="Computer Science..." />
                      </div>
                      <div>
                        <label className="form-label">Grade/CGPA</label>
                        <input type="text" value={edu.grade} onChange={e => updateEdu(i, 'grade', e.target.value)} className="form-input text-sm" placeholder="8.5 CGPA / 85%" />
                      </div>
                      <div>
                        <label className="form-label">Start Year</label>
                        <input type="text" value={edu.startYear} onChange={e => updateEdu(i, 'startYear', e.target.value)} className="form-input text-sm" placeholder="2021" />
                      </div>
                      <div>
                        <label className="form-label">End Year</label>
                        <input type="text" value={edu.endYear} onChange={e => updateEdu(i, 'endYear', e.target.value)} className="form-input text-sm" placeholder="2025 or Present" />
                      </div>
                    </div>
                  </div>
                ))}
                {education.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
                    Click "Add" to add your education details
                  </div>
                )}
              </div>
            )}

            {/* EXPERIENCE */}
            {section === 'experience' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-slate-900 flex items-center gap-2"><Briefcase className="w-4 h-4 text-blue-600" /> Experience</h2>
                  <button onClick={addExp} className="btn-secondary text-sm py-1.5"><Plus className="w-3.5 h-3.5" /> Add</button>
                </div>
                {experience.map((exp, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-4 space-y-3 relative">
                    <button onClick={() => removeExp(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="form-label">Company *</label>
                        <input type="text" value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} className="form-input text-sm" />
                      </div>
                      <div>
                        <label className="form-label">Role/Position *</label>
                        <input type="text" value={exp.role} onChange={e => updateExp(i, 'role', e.target.value)} className="form-input text-sm" />
                      </div>
                      <div>
                        <label className="form-label">Start Date</label>
                        <input type="text" value={exp.startDate} onChange={e => updateExp(i, 'startDate', e.target.value)} className="form-input text-sm" placeholder="Jan 2024" />
                      </div>
                      <div>
                        <label className="form-label">End Date</label>
                        <input type="text" value={exp.endDate} onChange={e => updateExp(i, 'endDate', e.target.value)} className="form-input text-sm" placeholder="Jun 2024 or Present" disabled={exp.current} />
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Description</label>
                      <textarea rows={3} value={exp.description} onChange={e => updateExp(i, 'description', e.target.value)} className="form-input text-sm resize-none" placeholder="Describe your responsibilities..." />
                    </div>
                  </div>
                ))}
                {experience.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
                    Click "Add" to add work experience or internships
                  </div>
                )}
              </div>
            )}

            {/* PROJECTS */}
            {section === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-slate-900 flex items-center gap-2"><FolderOpen className="w-4 h-4 text-blue-600" /> Projects</h2>
                  <button onClick={addProject} className="btn-secondary text-sm py-1.5"><Plus className="w-3.5 h-3.5" /> Add</button>
                </div>
                {projects.map((proj, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-4 space-y-3 relative">
                    <button onClick={() => removeProject(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div>
                      <label className="form-label">Project Title *</label>
                      <input type="text" value={proj.title} onChange={e => updateProject(i, 'title', e.target.value)} className="form-input text-sm" />
                    </div>
                    <div>
                      <label className="form-label">Description</label>
                      <textarea rows={3} value={proj.description} onChange={e => updateProject(i, 'description', e.target.value)} className="form-input text-sm resize-none" />
                    </div>
                    <div>
                      <label className="form-label">Tech Stack (comma-separated)</label>
                      <input type="text" value={proj.techStack?.join(', ')} onChange={e => updateProject(i, 'techStack', e.target.value.split(',').map(t => t.trim()))} className="form-input text-sm" placeholder="React, Node.js, MongoDB" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="form-label">Live Link</label>
                        <input type="url" value={proj.link} onChange={e => updateProject(i, 'link', e.target.value)} className="form-input text-sm" placeholder="https://..." />
                      </div>
                      <div>
                        <label className="form-label">GitHub Link</label>
                        <input type="url" value={proj.github} onChange={e => updateProject(i, 'github', e.target.value)} className="form-input text-sm" placeholder="https://github.com/..." />
                      </div>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
                    Click "Add" to showcase your projects
                  </div>
                )}
              </div>
            )}

            {/* LINKS & RESUME */}
            {section === 'links' && (
              <div className="space-y-5">
                <h2 className="font-bold text-slate-900 flex items-center gap-2"><Link2 className="w-4 h-4 text-blue-600" /> Links & Resume</h2>

                {/* Resume Upload */}
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                  {user?.resume ? (
                    <div>
                      <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                      <p className="font-semibold text-slate-900 mb-1">Resume Uploaded ✓</p>
                      <div className="flex items-center justify-center gap-4 mt-2 mb-1">
                        <button
                          type="button"
                          onClick={() => viewResumePdf(user.resume, user.name)}
                          className="text-blue-600 text-sm hover:underline inline-flex items-center gap-1 font-medium bg-transparent border-0 cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> View PDF
                        </button>
                        <span className="text-slate-300">·</span>
                        <button
                          type="button"
                          onClick={() => downloadResumePdf(user.resume, user.name)}
                          className="text-slate-600 text-sm hover:underline inline-flex items-center gap-1 bg-transparent border-0 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> Download .pdf
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">Upload a new file below to replace it</p>
                    </div>
                  ) : (
                    <div>
                      <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700 mb-1">Upload Your Resume</p>
                      <p className="text-sm text-slate-500">PDF format, max 10MB</p>
                    </div>
                  )}
                  <label className="btn-secondary mt-4 cursor-pointer inline-flex items-center gap-2 text-sm">
                    {uploadingResume ? <Spinner size="sm" /> : <><Upload className="w-4 h-4" /> Upload PDF</>}
                    <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} />
                  </label>
                </div>

                {/* Portfolio Links */}
                <div>
                  <label className="form-label">Portfolio Links</label>
                  {portfolioLinks.map((link, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input type="url" value={link} onChange={e => setPortfolioLinks(portfolioLinks.map((l, idx) => idx === i ? e.target.value : l))} className="form-input flex-1 text-sm" placeholder="https://..." />
                      <button onClick={() => setPortfolioLinks(portfolioLinks.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => setPortfolioLinks([...portfolioLinks, ''])} className="btn-secondary text-sm py-1.5 mt-1">
                    <Plus className="w-3.5 h-3.5" /> Add Link
                  </button>
                </div>
              </div>
            )}

            {/* COMPANY */}
            {section === 'company' && (
              <div className="space-y-4">
                <h2 className="font-bold text-slate-900 flex items-center gap-2"><Briefcase className="w-4 h-4 text-blue-600" /> Company Details</h2>
                {[
                  { key: 'name', label: 'Company Name *', placeholder: 'Acme Corp' },
                  { key: 'industry', label: 'Industry', placeholder: 'Technology, Finance...' },
                  { key: 'website', label: 'Website', placeholder: 'https://company.com' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="form-label">{label}</label>
                    <input type="text" value={company[key] || ''} onChange={e => setCompany(p => ({...p, [key]: e.target.value}))} placeholder={placeholder} className="form-input text-sm" />
                  </div>
                ))}
                <div>
                  <label className="form-label">Company Description</label>
                  <textarea rows={4} value={company.description || ''} onChange={e => setCompany(p => ({...p, description: e.target.value}))} className="form-input resize-none text-sm" placeholder="Tell candidates about your company..." />
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex justify-end">
              <button onClick={saveProfile} disabled={saving} className="btn-primary px-8 py-2.5">
                {saving ? <Spinner size="sm" /> : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
