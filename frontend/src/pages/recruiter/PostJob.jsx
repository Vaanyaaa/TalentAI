import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Navbar from '../../components/common/Navbar';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { Briefcase, Plus, X } from 'lucide-react';

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];

const PostJob = ({ editData, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: editData?.title || '',
    description: editData?.description || '',
    location: editData?.location || '',
    employmentType: editData?.employmentType || 'Full-time',
    experienceRequired: editData?.experienceRequired || '0',
    salary: editData?.salary || '',
    requiredSkills: editData?.requiredSkills || [],
  });

  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.requiredSkills.includes(s)) {
      setForm(p => ({ ...p, requiredSkills: [...p.requiredSkills, s] }));
    }
    setSkillInput('');
  };

  const removeSkill = (s) => setForm(p => ({ ...p, requiredSkills: p.requiredSkills.filter(sk => sk !== s) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.location || !form.employmentType) {
      return toast.error('Please fill in all required fields');
    }
    setLoading(true);
    try {
      if (editData?._id) {
        await api.put(`/jobs/${editData._id}`, form);
        toast.success('Job updated!');
        onClose && onClose();
      } else {
        await api.post('/jobs', form);
        toast.success('Job posted successfully! 🎉');
        navigate('/recruiter/jobs');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="form-label">Job Title *</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Frontend Developer" className="form-input" required />
        </div>
        <div>
          <label className="form-label">Location *</label>
          <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Bangalore / Remote" className="form-input" required />
        </div>
        <div>
          <label className="form-label">Employment Type *</label>
          <select name="employmentType" value={form.employmentType} onChange={handleChange} className="form-input">
            {EMPLOYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Experience Required</label>
          <input type="text" name="experienceRequired" value={form.experienceRequired} onChange={handleChange} placeholder="0-1, 1-2, 3-5..." className="form-input" />
        </div>
        <div>
          <label className="form-label">Salary (Optional)</label>
          <input type="text" name="salary" value={form.salary} onChange={handleChange} placeholder="e.g. ₹5-8 LPA" className="form-input" />
        </div>
      </div>

      <div>
        <label className="form-label">Job Description *</label>
        <textarea name="description" rows={8} value={form.description} onChange={handleChange} placeholder="Describe the role, responsibilities, and requirements..." className="form-input resize-none" required />
      </div>

      <div>
        <label className="form-label">Required Skills</label>
        <div className="flex gap-2 mb-2">
          <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); }}}
            placeholder="Type a skill and press Enter..." className="form-input flex-1 text-sm" />
          <button type="button" onClick={addSkill} className="btn-secondary text-sm py-2 px-4">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.requiredSkills.map(s => (
            <span key={s} className="badge badge-skill border flex items-center gap-1.5">
              {s}
              <button type="button" onClick={() => removeSkill(s)} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-sm">
        {loading ? <Spinner size="sm" /> : editData ? 'Update Job' : <><Briefcase className="w-4 h-4" /> Post Job</>}
      </button>
    </div>
  );

  if (editData) return (
    <form onSubmit={handleSubmit}>{content}</form>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Post a New Job</h1>
            <p className="text-slate-500 text-sm">Fill in the details to attract the right candidates</p>
          </div>
        </div>
        <div className="card p-6">
          <form onSubmit={handleSubmit}>{content}</form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
