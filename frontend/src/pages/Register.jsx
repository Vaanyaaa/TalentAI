import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Mail, Lock, User, Eye, EyeOff, GraduationCap, Building2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Spinner from '../components/common/Spinner';

const Register = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'student';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: defaultRole,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return toast.error('All fields are required');
    }
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const user = await register(formData);
      toast.success(`Welcome to TalentAI, ${user.name.split(' ')[0]}! 🎉`);
      navigate(user.role === 'student' ? '/student/dashboard' : '/recruiter/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'row' }}>
      {/* Left Panel */}
      <div style={{ flex: '0 0 45%', width: '45%', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        </div>

        <Link to="/" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Briefcase style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>TalentAI</span>
        </Link>

        <div style={{ position: 'relative' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2 }}>
            Start your AI-powered
            <br />
            <span style={{ color: '#22d3ee' }}>career journey</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { icon: GraduationCap, title: 'For Students', desc: 'Build your profile, apply to jobs, and get AI feedback on your resume.' },
              { icon: Building2, title: 'For Recruiters', desc: 'Post jobs, review candidates, and find the perfect match using AI insights.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Icon style={{ width: '1.5rem', height: '1.5rem', color: '#22d3ee', marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{title}</h4>
                <p style={{ fontSize: '0.75rem', color: '#bfdbfe', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ position: 'relative', color: '#94a3b8', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'white', fontWeight: 600, textDecoration: 'underline' }}>Sign in →</Link>
        </p>
      </div>

      {/* Right Panel */}
      <div style={{ flex: '0 0 55%', width: '55%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '3rem 2rem', background: 'white' }}>
        <div style={{ width: '100%', maxWidth: '24rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>Create account</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Join thousands of students and recruiters</p>

          {/* Role Toggle */}
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '0.75rem', padding: '0.25rem', marginBottom: '1.5rem' }}>
            {['student', 'recruiter'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setFormData((p) => ({ ...p, role }))}
                style={{
                  flex: 1, padding: '0.625rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600,
                  border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                  background: formData.role === role ? 'white' : 'transparent',
                  color: formData.role === role ? '#1d4ed8' : '#64748b',
                  boxShadow: formData.role === role ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {role === 'student' ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                    <GraduationCap style={{ width: '1rem', height: '1rem' }} /> Student
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                    <Building2 style={{ width: '1rem', height: '1rem' }} /> Recruiter
                  </span>
                )}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#94a3b8', zIndex: 1 }} />
                <input
                  type="text"
                  name="name"
                  id="register-name"
                  placeholder={formData.role === 'student' ? 'Rahul Sharma' : 'Priya Mehta'}
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#94a3b8', zIndex: 1 }} />
                <input
                  type="email"
                  name="email"
                  id="register-email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#94a3b8', zIndex: 1 }} />
                <input
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  id="register-password"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  {showPwd ? <EyeOff style={{ width: '1rem', height: '1rem' }} /> : <Eye style={{ width: '1rem', height: '1rem' }} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="register-submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3 text-base mt-2"
            >
              {loading ? <Spinner size="sm" /> : (
                <>Create Account <ArrowRight style={{ width: '1rem', height: '1rem' }} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '1rem' }}>
            By signing up, you agree to our{' '}
            <a href="#" style={{ color: '#2563eb' }}>Terms</a> and{' '}
            <a href="#" style={{ color: '#2563eb' }}>Privacy Policy</a>
          </p>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#64748b', marginTop: '1rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
