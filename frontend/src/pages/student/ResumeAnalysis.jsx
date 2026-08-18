import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Navbar from '../../components/common/Navbar';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import {
  Brain, Target, FileText, MessageSquare, Upload,
  ChevronDown, ChevronUp, Star, AlertCircle, CheckCircle2,
  Lightbulb, Zap, X
} from 'lucide-react';

const ScoreCircle = ({ score }) => {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx="55" cy="55" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-black" style={{ color }}>{score}</span>
        <span className="text-xs text-slate-500 font-medium">/100</span>
      </div>
    </div>
  );
};

const SectionCard = ({ title, icon: Icon, color, items, itemClass }) => {
  const [open, setOpen] = useState(true);
  if (!items?.length) return null;
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span className="font-semibold text-sm">{title}</span>
          <span className="text-xs opacity-70">({items.length})</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 opacity-60" /> : <ChevronDown className="w-4 h-4 opacity-60" />}
      </button>
      {open && (
        <ul className="mt-3 space-y-2">
          {items.map((item, i) => (
            <li key={i} className={`flex items-start gap-2 text-sm ${itemClass}`}>
              <span className="mt-0.5 flex-shrink-0">•</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ResumeAnalysis = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('analyze');
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [match, setMatch] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [questions, setQuestions] = useState(null);

  const TABS = [
    { id: 'analyze', label: 'Resume Analyzer', icon: Brain },
    { id: 'match', label: 'Skill Match', icon: Target },
    { id: 'cover', label: 'Cover Letter', icon: FileText },
    { id: 'interview', label: 'Interview Prep', icon: MessageSquare },
  ];

  const hasProfileData = !!(user?.bio || user?.skills?.length || user?.education?.length || user?.experience?.length || user?.projects?.length);

  const buildResume = () => {
    // If user pasted resume text and profile is empty, use only the pasted text
    if (resumeText && !hasProfileData) return resumeText.trim();

    const profileSection = `
Name: ${user?.name}
Bio: ${user?.bio || 'Not provided'}
Skills: ${user?.skills?.join(', ') || 'Not provided'}
Education: ${user?.education?.map(e => `${e.degree} in ${e.field} from ${e.institution} (${e.endYear})`).join('; ') || 'Not provided'}
Experience: ${user?.experience?.map(e => `${e.role} at ${e.company} (${e.startDate} - ${e.endDate || 'Present'}): ${e.description}`).join('; ') || 'Not provided'}
Projects: ${user?.projects?.map(p => `${p.title}: ${p.description} [${p.techStack?.join(', ')}]`).join('; ') || 'Not provided'}
Portfolio Links: ${user?.portfolioLinks?.join(', ') || 'Not provided'}
    `.trim();

    return resumeText ? `${profileSection}\n\nAdditional Resume Content:\n${resumeText}` : profileSection;
  };

  const handleAnalyze = async () => {
    const text = buildResume();
    if (!text.trim()) return toast.error('Please add resume content or fill your profile');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/analyze-resume', { resumeText: text });
      setAnalysis(data.analysis);
      if (data.analysis?.score) {
        await api.put('/users/resume-score', { score: data.analysis.score });
      }
      toast.success('Resume analyzed! 🎯');
    } catch (err) { 
      const msg = err.response?.data?.message || '';
      if (err.response?.status === 429 || msg.toLowerCase().includes('quota')) {
        toast.error('⏳ AI quota limit reached. Please wait a moment and try again.');
      } else {
        toast.error('Resume analysis failed. Please try again.');
      }
    } finally { setLoading(false); }
  };

  const handleSkillMatch = async () => {
    if (!jobDesc) return toast.error('Please paste the job description');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/skill-match', {
        resumeText: buildResume(),
        jobDescription: jobDesc,
        jobTitle,
      });
      setMatch(data.match);
      toast.success('Skill match complete! 🎯');
    } catch (err) { 
      const msg = err.response?.data?.message || '';
      if (err.response?.status === 429 || msg.toLowerCase().includes('quota')) {
        toast.error('⏳ AI quota limit reached. Please wait a moment and try again.');
      } else {
        toast.error('Skill match failed. Please try again.');
      }
    } finally { setLoading(false); }
  };

  const handleCoverLetter = async () => {
    if (!jobDesc) return toast.error('Please paste the job description');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/cover-letter', {
        resumeText: buildResume(),
        jobDescription: jobDesc,
        jobTitle,
        companyName: '',
        applicantName: user?.name,
      });
      setCoverLetter(data.coverLetter);
      toast.success('Cover letter generated! ✨');
    } catch (err) { 
      const msg = err.response?.data?.message || '';
      if (err.response?.status === 429 || msg.toLowerCase().includes('quota')) {
        toast.error('⏳ AI quota limit reached. Please wait a moment and try again.');
      } else {
        toast.error('Failed to generate cover letter. Please try again.');
      }
    } finally { setLoading(false); }
  };

  const handleInterviewQuestions = async () => {
    if (!jobDesc) return toast.error('Please paste the job description');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/interview-questions', {
        jobDescription: jobDesc,
        jobTitle,
        skills: user?.skills || [],
      });
      setQuestions(data.questions);
      toast.success('Questions generated! 🎤');
    } catch (err) { 
      const msg = err.response?.data?.message || '';
      if (err.response?.status === 429 || msg.toLowerCase().includes('quota')) {
        toast.error('⏳ AI quota limit reached. Please wait a moment and try again.');
      } else {
        toast.error('Failed to generate questions. Please try again.');
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">AI Career Tools</h1>
            <p className="text-slate-500 text-sm">Powered by Google Gemini</p>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-200 shadow-sm mt-6 mb-6 flex-wrap">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex-1 justify-center ${
                activeTab === id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" /><span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* === ANALYZE TAB === */}
        {activeTab === 'analyze' && (
          <div className="space-y-5">
            <div className="card p-5">
              <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" /> Resume Analyzer
              </h2>

              {!hasProfileData && (
                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', padding: '12px 14px', marginBottom: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <AlertCircle style={{ width: '16px', height: '16px', color: '#ea580c', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#c2410c', marginBottom: '2px' }}>Your profile is empty</p>
                    <p style={{ fontSize: '0.8125rem', color: '#9a3412' }}>Paste your resume text below — it will be used for analysis since your profile has no data yet.</p>
                  </div>
                </div>
              )}

              <label className="form-label">
                {hasProfileData ? 'Additional Resume Content (optional)' : 'Paste Your Resume Text *'}
              </label>
              <textarea
                rows={hasProfileData ? 4 : 8}
                placeholder={hasProfileData
                  ? 'Add extra details not in your profile (optional)...'
                  : 'Paste your full resume text here — education, experience, skills, projects...'}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="form-input resize-none text-sm mb-4"
              />
              <button
                onClick={handleAnalyze}
                disabled={loading || (!hasProfileData && !resumeText.trim())}
                className="btn-primary"
              >
                {loading ? <Spinner size="sm" /> : <><Brain className="w-4 h-4" /> Analyze Resume</>}
              </button>
            </div>

            {analysis && (
              <div className="card p-6 animate-fade-in">
                <h3 className="font-bold text-slate-900 mb-5 text-center">Your Resume Report</h3>
                <ScoreCircle score={analysis.score} />
                <div className="flex justify-center gap-4 mt-3 mb-6 text-sm">
                  <span className="font-bold text-slate-800 text-lg">{analysis.grade}</span>
                  <span className="text-slate-500 self-end text-sm">ATS Score: {analysis.atsScore}/100</span>
                </div>
                <p className="text-slate-600 text-sm text-center mb-6 italic">{analysis.summary}</p>
                <div className="space-y-3">
                  <SectionCard title="Strengths" icon={CheckCircle2} color="bg-emerald-50 text-emerald-800 border-emerald-200" items={analysis.strengths} itemClass="text-emerald-700" />
                  <SectionCard title="Weaknesses" icon={AlertCircle} color="bg-red-50 text-red-800 border-red-200" items={analysis.weaknesses} itemClass="text-red-700" />
                  <SectionCard title="Missing Skills" icon={X} color="bg-amber-50 text-amber-800 border-amber-200" items={analysis.missingSkills} itemClass="text-amber-700" />
                  <SectionCard title="Improvement Suggestions" icon={Lightbulb} color="bg-blue-50 text-blue-800 border-blue-200" items={analysis.suggestions} itemClass="text-blue-700" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* === SKILL MATCH TAB === */}
        {activeTab === 'match' && (
          <div className="space-y-5">
            <div className="card p-5">
              <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-600" /> Skill Match Analyzer
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="form-label">Job Title</label>
                  <input type="text" placeholder="e.g. Frontend Developer" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="form-input text-sm" />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label">Job Description *</label>
                <textarea rows={6} placeholder="Paste the full job description here..." value={jobDesc} onChange={e => setJobDesc(e.target.value)} className="form-input resize-none text-sm" />
              </div>
              <button onClick={handleSkillMatch} disabled={loading} className="btn-primary">
                {loading ? <Spinner size="sm" /> : <><Target className="w-4 h-4" /> Check My Match</>}
              </button>
            </div>

            {match && (
              <div className="card p-6 animate-fade-in">
                <div className="text-center mb-6">
                  <div className="text-5xl font-black gradient-text mb-1">{match.matchPercentage}%</div>
                  <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${
                    match.matchLevel === 'Excellent' ? 'bg-emerald-100 text-emerald-700' :
                    match.matchLevel === 'Good' ? 'bg-blue-100 text-blue-700' :
                    match.matchLevel === 'Average' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {match.matchLevel} Match
                  </div>
                  <p className="text-slate-600 text-sm mt-3 max-w-md mx-auto">{match.verdict}</p>
                </div>
                <div className="space-y-3">
                  <SectionCard title="Matching Skills ✅" icon={CheckCircle2} color="bg-emerald-50 text-emerald-800 border-emerald-200" items={match.matchingSkills} itemClass="text-emerald-700" />
                  <SectionCard title="Missing Skills ❌" icon={X} color="bg-red-50 text-red-800 border-red-200" items={match.missingSkills} itemClass="text-red-700" />
                  <SectionCard title="How to Improve 💡" icon={Lightbulb} color="bg-blue-50 text-blue-800 border-blue-200" items={match.suggestions} itemClass="text-blue-700" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* === COVER LETTER TAB === */}
        {activeTab === 'cover' && (
          <div className="space-y-5">
            <div className="card p-5">
              <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" /> Cover Letter Generator
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="form-label">Job Title</label>
                  <input type="text" placeholder="e.g. Software Engineer" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="form-input text-sm" />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label">Job Description *</label>
                <textarea rows={5} placeholder="Paste the job description..." value={jobDesc} onChange={e => setJobDesc(e.target.value)} className="form-input resize-none text-sm" />
              </div>
              <button onClick={handleCoverLetter} disabled={loading} className="btn-primary">
                {loading ? <Spinner size="sm" /> : <><FileText className="w-4 h-4" /> Generate Cover Letter</>}
              </button>
            </div>

            {coverLetter && (
              <div className="card p-5 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900">Your Cover Letter</h3>
                  <button onClick={() => { navigator.clipboard.writeText(coverLetter); toast.success('Copied!'); }}
                    className="text-xs text-blue-600 hover:underline">Copy to clipboard</button>
                </div>
                <textarea
                  rows={16}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="form-input resize-none text-sm font-mono text-slate-700 bg-slate-50"
                />
                <p className="text-xs text-slate-400 mt-2">✏️ You can edit the generated cover letter above before using it.</p>
              </div>
            )}
          </div>
        )}

        {/* === INTERVIEW PREP TAB === */}
        {activeTab === 'interview' && (
          <div className="space-y-5">
            <div className="card p-5">
              <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-600" /> Interview Question Generator
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="form-label">Job Title</label>
                  <input type="text" placeholder="e.g. React Developer" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="form-input text-sm" />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label">Job Description *</label>
                <textarea rows={5} placeholder="Paste the job description..." value={jobDesc} onChange={e => setJobDesc(e.target.value)} className="form-input resize-none text-sm" />
              </div>
              <button onClick={handleInterviewQuestions} disabled={loading} className="btn-primary">
                {loading ? <Spinner size="sm" /> : <><MessageSquare className="w-4 h-4" /> Generate Questions</>}
              </button>
            </div>

            {questions && (
              <div className="space-y-4 animate-fade-in">
                {[
                  { key: 'technical', label: '⚙️ Technical Questions', color: 'bg-blue-50 border-blue-200 text-blue-900' },
                  { key: 'hr', label: '👥 HR Questions', color: 'bg-purple-50 border-purple-200 text-purple-900' },
                  { key: 'behavioral', label: '🧠 Behavioral Questions', color: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
                ].map(({ key, label, color }) => (
                  questions[key]?.length > 0 && (
                    <div key={key} className={`rounded-xl border p-5 ${color}`}>
                      <h3 className="font-bold mb-3">{label}</h3>
                      <ol className="space-y-3">
                        {questions[key].map((q, i) => (
                          <li key={i} className="flex gap-3 text-sm">
                            <span className="font-bold flex-shrink-0 w-5">{i + 1}.</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )
                ))}
                {questions.tips?.length > 0 && (
                  <div className="card p-4">
                    <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-500" /> Interview Tips</h3>
                    <ul className="space-y-1">
                      {questions.tips.map((tip, i) => <li key={i} className="text-sm text-slate-600">• {tip}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalysis;
