import { Link } from 'react-router-dom';
import { Briefcase, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';


const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">TalentAI</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              AI-powered recruitment platform connecting talented students with top recruiters. 
              Smart matching, smarter hiring.
            </p>
            <div className="flex gap-3 mt-4">
              {[FaGithub, FaLinkedin, FaTwitter, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">For Students</h4>
            <ul className="space-y-2">
              {['Browse Jobs', 'Resume Analysis', 'Skill Matching', 'Interview Prep'].map(l => (
                <li key={l}><a href="#" className="text-sm hover:text-blue-400 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">For Recruiters</h4>
            <ul className="space-y-2">
              {['Post Jobs', 'Find Candidates', 'AI Insights', 'Manage Applications'].map(l => (
                <li key={l}><a href="#" className="text-sm hover:text-blue-400 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-4 text-xs">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
