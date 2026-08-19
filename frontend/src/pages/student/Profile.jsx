import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import {
  User, Mail, Link2, FileText, Edit3,
  GraduationCap, Briefcase, FolderOpen, Code, Star, ExternalLink, Globe, Download
} from 'lucide-react';
import { viewResumePdf, downloadResumePdf } from '../../utils/resumeUtils';

const Profile = () => {
  const { user } = useAuth();

  const hasEducation = user?.education?.length > 0;
  const hasExperience = user?.experience?.length > 0;
  const hasProjects = user?.projects?.length > 0;
  const isProfileEmpty = !hasEducation && !hasExperience && !hasProjects;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '5rem' }}>
      <Navbar />

      <div style={{ maxWidth: '68rem', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        
        {/* Profile Card */}
        <div style={{
          background: 'white',
          borderRadius: '1.25rem',
          border: '1px solid #e2e8f0',
          padding: '2.25rem 2.5rem',
          boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.05)',
          marginBottom: '1.75rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap' }}>
            {/* Avatar */}
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                style={{
                  width: '6rem',
                  height: '6rem',
                  borderRadius: '1.15rem',
                  objectFit: 'cover',
                  border: '2px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  flexShrink: 0
                }}
              />
            ) : (
              <div style={{
                width: '6rem',
                height: '6rem',
                borderRadius: '1.15rem',
                background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 800,
                color: 'white',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
              }}>
                {user?.name?.charAt(0)}
              </div>
            )}

            {/* User Info */}
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                    {user?.name}
                  </h1>
                  <p style={{ color: '#64748b', fontSize: '0.925rem', margin: '0.25rem 0 0', textTransform: 'capitalize' }}>
                    {user?.role || 'Student'} · TalentAI
                  </p>
                </div>

                <Link
                  to="/student/profile/edit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#2563eb',
                    color: 'white',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '0.75rem',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Edit3 style={{ width: '1rem', height: '1rem' }} /> Edit Profile
                </Link>
              </div>

              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.65', margin: '0.85rem 0 1.25rem', maxWidth: '44rem' }}>
                {user?.bio || 'No bio added yet. Click Edit Profile to add one.'}
              </p>

              {/* Meta details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.875rem', color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Mail style={{ width: '1rem', height: '1rem', color: '#94a3b8' }} />
                  {user?.email}
                </span>
                {user?.resumeScore > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#d97706', fontWeight: 600 }}>
                    <Star style={{ width: '1rem', height: '1rem', fill: '#f59e0b', color: '#f59e0b' }} />
                    Resume Score: {user.resumeScore}/100
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Overview Cards: Skills, Resume, Portfolio */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.75rem'
        }}>
          {/* Skills Card */}
          <div style={{
            background: 'white',
            borderRadius: '1.25rem',
            border: '1px solid #e2e8f0',
            padding: '1.75rem',
            boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '130px'
          }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Code style={{ width: '1.15rem', height: '1.15rem', color: '#2563eb' }} /> Skills
              </h2>
              {user?.skills?.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {user.skills.map(s => (
                    <span
                      key={s}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '0.5rem',
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        border: '1px solid #bfdbfe'
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>No skills added yet</p>
              )}
            </div>
          </div>

          {/* Resume Card */}
          <div style={{
            background: 'white',
            borderRadius: '1.25rem',
            border: '1px solid #e2e8f0',
            padding: '1.75rem',
            boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '130px'
          }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText style={{ width: '1.15rem', height: '1.15rem', color: '#2563eb' }} /> Resume
              </h2>
              {user?.resume ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <button
                    onClick={() => viewResumePdf(user.resume, user.name)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      color: '#2563eb',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      fontSize: '0.925rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                  >
                    <ExternalLink style={{ width: '1rem', height: '1rem' }} /> View Resume PDF
                  </button>
                  <button
                    onClick={() => downloadResumePdf(user.resume, user.name)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      color: '#64748b',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#0f172a';
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = '#64748b';
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    <Download style={{ width: '0.9rem', height: '0.9rem' }} /> Download .pdf
                  </button>
                </div>
              ) : (
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>No resume uploaded</p>
              )}
            </div>
          </div>

          {/* Portfolio Card */}
          <div style={{
            background: 'white',
            borderRadius: '1.25rem',
            border: '1px solid #e2e8f0',
            padding: '1.75rem',
            boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '130px'
          }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link2 style={{ width: '1.15rem', height: '1.15rem', color: '#2563eb' }} /> Portfolio
              </h2>
              {user?.portfolioLinks?.filter(Boolean).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {user.portfolioLinks.filter(Boolean).map((link, i) => (
                    <a
                      key={i}
                      href={link.startsWith('http') ? link : `https://${link}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        color: '#2563eb',
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                    >
                      <Globe style={{ width: '0.95rem', height: '0.95rem', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{link}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>No links added</p>
              )}
            </div>
          </div>
        </div>

        {/* Education Section */}
        {hasEducation && (
          <div style={{
            background: 'white',
            borderRadius: '1.25rem',
            border: '1px solid #e2e8f0',
            padding: '2rem 2.25rem',
            boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.04)',
            marginBottom: '1.75rem'
          }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <GraduationCap style={{ width: '1.35rem', height: '1.35rem', color: '#2563eb' }} /> Education
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {user.education.map((edu, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', paddingBottom: i === user.education.length - 1 ? 0 : '1.5rem', borderBottom: i === user.education.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                  <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <GraduationCap style={{ width: '1.35rem', height: '1.35rem', color: '#2563eb' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem' }}>
                      {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                    </h3>
                    <p style={{ color: '#475569', fontSize: '0.925rem', margin: '0 0 0.25rem' }}>{edu.institution}</p>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                      {edu.startYear} – {edu.endYear || 'Present'}
                      {edu.grade && ` · Grade: ${edu.grade}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {hasExperience && (
          <div style={{
            background: 'white',
            borderRadius: '1.25rem',
            border: '1px solid #e2e8f0',
            padding: '2rem 2.25rem',
            boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.04)',
            marginBottom: '1.75rem'
          }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Briefcase style={{ width: '1.35rem', height: '1.35rem', color: '#2563eb' }} /> Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {user.experience.map((exp, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', paddingBottom: i === user.experience.length - 1 ? 0 : '1.5rem', borderBottom: i === user.experience.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                  <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Briefcase style={{ width: '1.35rem', height: '1.35rem', color: '#16a34a' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem' }}>{exp.role}</h3>
                    <p style={{ color: '#475569', fontSize: '0.925rem', margin: '0 0 0.25rem' }}>{exp.company} {exp.location ? `· ${exp.location}` : ''}</p>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 0.5rem' }}>
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </p>
                    {exp.description && (
                      <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-line' }}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {hasProjects && (
          <div style={{
            background: 'white',
            borderRadius: '1.25rem',
            border: '1px solid #e2e8f0',
            padding: '2rem 2.25rem',
            boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.04)',
            marginBottom: '1.75rem'
          }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <FolderOpen style={{ width: '1.35rem', height: '1.35rem', color: '#2563eb' }} /> Projects
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {user.projects.map((proj, i) => (
                <div
                  key={i}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '1rem',
                    padding: '1.25rem 1.5rem',
                    background: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.4rem' }}>{proj.title}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.55', margin: '0 0 0.85rem' }}>{proj.description}</p>
                    {proj.techStack?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                        {proj.techStack.map(t => (
                          <span key={t} style={{ padding: '0.2rem 0.55rem', borderRadius: '0.35rem', background: 'white', border: '1px solid #cbd5e1', fontSize: '0.75rem', color: '#334155' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.825rem' }}>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
                        <ExternalLink style={{ width: '0.85rem', height: '0.85rem' }} /> Live Demo
                      </a>
                    )}
                    {proj.github && (
                      <a href={proj.github} target="_blank" rel="noreferrer" style={{ color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
                        <ExternalLink style={{ width: '0.85rem', height: '0.85rem' }} /> GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State Prompt (if no education, experience, or projects) */}
        {isProfileEmpty && (
          <div style={{
            background: 'white',
            borderRadius: '1.25rem',
            border: '1px solid #e2e8f0',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <User style={{ width: '2rem', height: '2rem', color: '#94a3b8' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: '0 0 0.5rem' }}>
              Complete your profile to stand out!
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.925rem', margin: '0 auto 1.75rem', maxWidth: '30rem' }}>
              Add your education, experience, projects and skills to get noticed by recruiters.
            </p>
            <Link
              to="/student/profile/edit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#2563eb',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '0.75rem',
                fontWeight: 600,
                fontSize: '0.925rem',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Complete Profile
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
