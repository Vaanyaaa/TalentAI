import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Spinner from '../components/common/Spinner';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error('Please fill in all fields');
    }
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 👋`);
      const dest = from || (user.role === 'student' ? '/student/dashboard' : '/recruiter/dashboard');
      navigate(dest, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'row' }}>
      <style>{`
        @media (max-width: 767px) {
          .login-left-panel { display: none !important; }
          .login-right-panel { flex: 1 1 100% !important; width: 100% !important; padding: 2rem 1.25rem !important; }
        }
      `}</style>
      {/* Left Panel */}
      <div className="login-left-panel" style={{ flex: '0 0 45%', width: '45%', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #0891b2 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-8rem', right: '-8rem', width: '24rem', height: '24rem', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '-8rem', left: '-8rem', width: '24rem', height: '24rem', background: 'rgba(34,211,238,0.2)', borderRadius: '9999px', filter: 'blur(60px)' }} />
        </div>

        <div style={{ position: 'relative' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', background: 'rgba(255,255,255,0.2)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>TalentAI</span>
          </Link>
        </div>

        <div style={{ position: 'relative' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
            Your AI career companion awaits
          </h2>
          <p style={{ color: '#bfdbfe', fontSize: '1.125rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Login to access AI-powered resume analysis, smart job matching, and personalized career insights.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              'AI Resume Score & Feedback',
              'Smart Job Matching',
              'One-click Cover Letter',
              'Interview Question Generator',
            ].map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '1.25rem', height: '1.25rem', background: 'rgba(255,255,255,0.2)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ width: '0.5rem', height: '0.5rem', background: '#67e8f9', borderRadius: '9999px' }} />
                </div>
                <span style={{ color: '#eff6ff', fontSize: '0.875rem' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', color: '#bfdbfe', fontSize: '0.875rem' }}>
          New to TalentAI?{' '}
          <Link to="/register" style={{ color: 'white', fontWeight: 600, textDecoration: 'underline' }}>
            Create a free account →
          </Link>
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right-panel" style={{ flex: '0 0 55%', width: '55%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '3rem 2rem', background: 'white' }}>
        <div style={{ width: '100%', maxWidth: '24rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>Welcome back</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#94a3b8', zIndex: 1 }} />
                <input
                  type="email"
                  name="email"
                  id="login-email"
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
                  id="login-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  autoComplete="current-password"
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
              id="login-submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3 text-base"
            >
              {loading ? <Spinner size="sm" /> : <>Sign In <ArrowRight style={{ width: '1rem', height: '1rem' }} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#64748b', marginTop: '1.5rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2563eb', fontWeight: 600 }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
