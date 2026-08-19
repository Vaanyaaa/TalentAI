/**
 * Utility functions for viewing and downloading candidate resumes reliably as PDFs
 */

export const getResumeDownloadUrl = (userOrUrl, id) => {
  const resumeUrl = typeof userOrUrl === 'string' ? userOrUrl : userOrUrl?.resume;
  if (!resumeUrl) return '';
  return resumeUrl;
};

export const viewResumePdf = async (resumeUrl, userName = 'Candidate') => {
  if (!resumeUrl) return;

  try {
    const res = await fetch(resumeUrl);
    if (!res.ok) throw new Error('Could not fetch PDF');
    const blob = await res.blob();
    const pdfBlob = new Blob([blob], { type: 'application/pdf' });
    const blobUrl = window.URL.createObjectURL(pdfBlob);
    window.open(blobUrl, '_blank');
  } catch {
    // Fallback: direct open in new window
    window.open(resumeUrl, '_blank');
  }
};

export const downloadResumePdf = async (resumeUrl, userName = 'Candidate') => {
  if (!resumeUrl) return;

  const cleanName = (userName || 'Resume').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanName}_Resume.pdf`;

  try {
    const res = await fetch(resumeUrl);
    if (!res.ok) throw new Error('Could not fetch PDF');
    const blob = await res.blob();
    const pdfBlob = new Blob([blob], { type: 'application/pdf' });
    const blobUrl = window.URL.createObjectURL(pdfBlob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  } catch {
    // Fallback
    const a = document.createElement('a');
    a.href = resumeUrl;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};
