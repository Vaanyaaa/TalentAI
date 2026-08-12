import { Link } from 'react-router-dom';
import { 
  Briefcase, Zap, Target, FileText, MessageSquare, 
  ChevronRight, Star, Users, TrendingUp, CheckCircle2,
  ArrowRight, Sparkles, Brain, Search, Plus
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Resume Analyzer',
    desc: 'Get an instant AI-powered score and actionable feedback to make your resume stand out.',
    color: 'blue',
  },
  {
    icon: Target,
    title: 'Smart Skill Matching',
    desc: 'Compare your profile against any job and see exactly how well you match—with a score.',
    color: 'cyan',
  },
  {
    icon: FileText,
    title: 'Cover Letter Generator',
    desc: 'Generate a personalized, professional cover letter in seconds using your resume and the job description.',
    color: 'purple',
  },
  {
    icon: MessageSquare,
    title: 'Interview Prep',
    desc: 'AI-generated technical, HR, and behavioral questions tailored to your target role.',
    color: 'green',
  },
];



const HOW_IT_WORKS_STUDENT = [
  { step: '01', title: 'Create Your Profile', desc: 'Sign up as a student and build your complete profile with skills, education, and projects.' },
  { step: '02', title: 'Upload Your Resume', desc: 'Upload your PDF resume and let AI analyze your strengths and suggest improvements.' },
  { step: '03', title: 'Browse & Match Jobs', desc: 'Search through curated job listings and see your AI-powered match score for each.' },
  { step: '04', title: 'Apply & Track', desc: 'Apply with one click, generate cover letters, and track your application status in real-time.' },
];

const HOW_IT_WORKS_RECRUITER = [
  { step: '01', title: 'Create Profile', desc: 'Sign up and set up your company details, logo, website, and industry.' },
  { step: '02', title: 'Post Job Openings', desc: 'Add job listings with required skills, experience levels, location, and salary.' },
  { step: '03', title: 'Smart AI Screening', desc: 'Instantly view AI-generated match scores and insights for each applicant.' },
  { step: '04', title: 'Shortlist & Hire', desc: 'Manage application statuses, communicate with candidates, and select top talent.' },
];

const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'bg-blue-600', border: 'border-blue-200' },
  cyan: { bg: 'bg-cyan-50', icon: 'bg-cyan-600', border: 'border-cyan-200' },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-600', border: 'border-purple-200' },
  green: { bg: 'bg-emerald-50', icon: 'bg-emerald-600', border: 'border-emerald-200' },
};

const LandingPage = () => {
  const { user } = useAuth();
  const dashboardLink = user ? (user.role === 'student' ? '/student/dashboard' : '/recruiter/dashboard') : '/register';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient py-20 lg:py-32 px-6 overflow-hidden relative" style={{ textAlign: 'center' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
        </div>

        <div style={{ maxWidth: '72rem', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', border: '1px solid #bfdbfe', borderRadius: '9999px', padding: '0.375rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: '#1d4ed8', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <Sparkles style={{ width: '0.875rem', height: '0.875rem' }} />
            Powered by Google Gemini AI
          </div>

          <h1 style={{ fontSize: 'clamp(2.25rem, 6vw, 3.75rem)', fontWeight: 800, color: '#0f172a', lineHeight: 1.15, marginBottom: '1.5rem', textAlign: 'center' }}>
            Land Your Dream Job
            <br />
            <span className="gradient-text">With AI-Powered Edge</span>
          </h1>

          <p style={{ fontSize: '1.125rem', color: '#475569', maxWidth: '42rem', margin: '0 auto 2.5rem', textAlign: 'center' }}>
            TalentAI helps students showcase their skills, analyze resumes, match with jobs,
            and prepare for interviews — all in one platform.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '2.5rem' }}>
            <Link
              to={dashboardLink}
              className="btn-primary text-base px-8 py-3 shadow-lg shadow-blue-200"
            >
              {user ? 'Go to Dashboard' : 'Get Started Free'} <ArrowRight className="w-5 h-5" />
            </Link>
            {user?.role === 'recruiter' ? (
              <Link
                to="/recruiter/post-job"
                className="btn-secondary text-base px-8 py-3"
              >
                <Plus className="w-5 h-5" /> Post a Job
              </Link>
            ) : (
              <Link
                to="/jobs"
                className="btn-secondary text-base px-8 py-3"
              >
                <Search className="w-5 h-5" /> Browse Jobs
              </Link>
            )}
          </div>

          {/* Floating trust badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
            {['No credit card required', 'Free AI tools', 'Instant results'].map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>
                <CheckCircle2 style={{ width: '1rem', height: '1rem', color: '#10b981' }} />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* AI Features */}
      <section style={{ padding: '5rem 1.5rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full px-4 py-1.5 mb-4 border border-blue-200">
              <Zap className="w-3.5 h-3.5" /> AI Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Your AI Career Assistant
            </h2>
            <p className="text-slate-500" style={{ maxWidth: '36rem', margin: '0 auto' }}>
              Four powerful AI tools to take you from application to offer.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {FEATURES.map(({ icon: Icon, title, desc, color }, i) => {
              const c = colorMap[color];
              return (
                <div
                  key={title}
                  className={`${c.bg} rounded-2xl border ${c.border} hover:shadow-lg transition-all duration-300 animate-fade-in-up`}
                  style={{ padding: '1.5rem', animationDelay: `${i * 0.1}s` }}
                >
                  <div className={`${c.icon} w-11 h-11 rounded-xl flex items-center justify-center mb-4 shadow-sm`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '5rem 1.5rem', background: '#ffffff' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-slate-500">
              {user?.role === 'recruiter' ? 'Hire talent in 4 simple steps' : 'Get placed in 4 simple steps'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {(user?.role === 'recruiter' ? HOW_IT_WORKS_RECRUITER : HOW_IT_WORKS_STUDENT).map(({ step, title, desc }, i, arr) => (
              <div key={step} className="relative animate-fade-in-up" style={{ textAlign: 'center', animationDelay: `${i * 0.1}s` }}>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-200" style={{ margin: '0 auto 1rem' }}>
                  {step}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                {i < arr.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute top-5 -right-3 w-6 h-6 text-blue-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-cyan-500">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to land your dream job?
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Join thousands of students who use TalentAI to get hired faster.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-base flex items-center gap-2"
              >
                Start Free Today <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/register?role=recruiter"
                className="border-2 border-white/50 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors text-base"
              >
                I'm a Recruiter
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default LandingPage;
