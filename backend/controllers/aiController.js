const { GoogleGenerativeAI } = require('@google/generative-ai');
const { PDFParse } = require('pdf-parse');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: generate content with model fallback
const generateWithFallback = async (prompt) => {
  const modelNames = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.7-flash'];
  let lastError = null;

  for (const modelName of modelNames) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      lastError = err;
      console.warn(`Model ${modelName} failed, trying next fallback:`, err.message);
    }
  }

  throw lastError;
};

// Helper: extract text from PDF URL
const extractTextFromResumeUrl = async (resumeUrl) => {
  if (!resumeUrl) return '';
  try {
    const res = await fetch(resumeUrl);
    if (!res.ok) return '';
    const arrayBuffer = await res.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    const parser = new PDFParse(uint8);
    await parser.load();
    const parsed = await parser.getText();
    return parsed?.text ? parsed.text.trim() : '';
  } catch (err) {
    console.warn('PDF text extraction error:', err.message);
    return '';
  }
};

// Helper: resolve full resume text from body or uploaded PDF file
const resolveResumeContent = async (req) => {
  const { resumeText, resumeUrl } = req.body;
  const targetUrl = resumeUrl || req.user?.resume;

  let extractedPdfText = '';
  if (targetUrl) {
    extractedPdfText = await extractTextFromResumeUrl(targetUrl);
  }

  if (extractedPdfText && resumeText && resumeText.trim() !== extractedPdfText.trim()) {
    return `${extractedPdfText}\n\nAdditional Candidate Details:\n${resumeText.trim()}`;
  }
  if (extractedPdfText) {
    return extractedPdfText;
  }
  if (resumeText && resumeText.trim()) {
    return resumeText.trim();
  }

  return '';
};

// Helper: parse JSON from AI response
const parseAIJson = (text) => {
  if (!text) return null;
  try {
    const cleaned = text
      .replace(/```(?:json)?/gi, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(cleaned);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
};

// Helper: convert raw Gemini errors into user-friendly messages
const handleAIError = (err, res) => {
  const msg = err?.message || '';
  console.error('AI Service Error:', msg);
  if (
    msg.includes('quota') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('rate') ||
    msg.includes('429')
  ) {
    res.status(429);
    throw new Error('AI quota limit reached. Please wait a moment and try again.');
  }
  res.status(500);
  throw new Error('AI service error. Please try again later.');
};

// @desc    Extract text from uploaded resume PDF
// @route   POST /api/ai/extract-resume-text
// @access  Private (student)
const extractResumeText = async (req, res) => {
  const targetUrl = req.body.resumeUrl || req.user?.resume;
  if (!targetUrl) {
    return res.status(400).json({ success: false, message: 'No resume found. Please upload a resume first.' });
  }

  const text = await extractTextFromResumeUrl(targetUrl);
  if (!text) {
    return res.status(400).json({ success: false, message: 'Could not extract text from the resume PDF.' });
  }

  res.json({ success: true, text });
};

// @desc    Analyze resume with AI (reads PDF automatically if uploaded)
// @route   POST /api/ai/analyze-resume
// @access  Private (student)
const analyzeResume = async (req, res) => {
  const content = await resolveResumeContent(req);

  if (!content) {
    res.status(400);
    throw new Error('Please upload a resume PDF or enter resume text to analyze.');
  }

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const prompt = `You are an expert HR consultant and resume reviewer. Today's date is ${today}. Analyze the following resume thoroughly and return a detailed JSON report.
IMPORTANT: Read all sections including Projects, Experience, Skills, Education, Achievements, and Links. Do NOT flag any dates from ${new Date().getFullYear()} or earlier as "future" dates.

Resume Content:
"""
${content}
"""

Return ONLY valid JSON in this exact format (no markdown):
{
  "score": <number 0-100>,
  "grade": "<A/B/C/D/F>",
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "weaknesses": ["<weakness1>", "<weakness2>", "<weakness3>"],
  "missingSkills": ["<skill1>", "<skill2>", "<skill3>"],
  "suggestions": ["<suggestion1>", "<suggestion2>", "<suggestion3>", "<suggestion4>"],
  "atsScore": <number 0-100>,
  "keywordDensity": "<low/medium/high>"
}`;

  try {
    const text = await generateWithFallback(prompt);
    const parsed = parseAIJson(text);

    if (!parsed) {
      return res.json({ success: true, raw: text });
    }

    res.json({ success: true, analysis: parsed });
  } catch (err) {
    handleAIError(err, res);
  }
};

// @desc    AI Skill Match — compare resume with job description
// @route   POST /api/ai/skill-match
// @access  Private (student)
const skillMatch = async (req, res) => {
  const { jobDescription, jobTitle } = req.body;
  const content = await resolveResumeContent(req);

  if (!content || !jobDescription) {
    res.status(400);
    throw new Error('Resume content and job description are required');
  }

  const prompt = `You are an expert career counselor. Compare the following resume with the job description and return a JSON compatibility report.

Job Title: ${jobTitle || 'Not specified'}

Job Description:
"""
${jobDescription}
"""

Candidate Resume:
"""
${content}
"""

Return ONLY valid JSON (no markdown):
{
  "matchPercentage": <number 0-100>,
  "matchLevel": "<Excellent/Good/Average/Poor>",
  "matchingSkills": ["<skill1>", "<skill2>"],
  "missingSkills": ["<skill1>", "<skill2>"],
  "suggestions": ["<actionable suggestion1>", "<suggestion2>", "<suggestion3>"],
  "verdict": "<short 2 sentence verdict about the candidate's fit>"
}`;

  try {
    const text = await generateWithFallback(prompt);
    const parsed = parseAIJson(text);

    if (!parsed) {
      return res.json({ success: true, raw: text });
    }

    res.json({ success: true, match: parsed });
  } catch (err) {
    handleAIError(err, res);
  }
};

// @desc    Generate cover letter
// @route   POST /api/ai/cover-letter
// @access  Private (student)
const generateCoverLetter = async (req, res) => {
  const { jobDescription, jobTitle, companyName, applicantName } = req.body;
  const content = await resolveResumeContent(req);

  if (!content || !jobDescription) {
    res.status(400);
    throw new Error('Resume content and job description are required');
  }

  const prompt = `You are a professional career coach. Write a compelling, personalized cover letter for the following job application.

Applicant Name: ${applicantName || req.user?.name || 'The Applicant'}
Job Title: ${jobTitle || 'the position'}
Company Name: ${companyName || 'the company'}

Job Description:
"""
${jobDescription}
"""

Applicant's Resume:
"""
${content}
"""

Write a professional, enthusiastic, and personalized cover letter of 3-4 paragraphs. Start directly with "Dear Hiring Manager," and end with "Sincerely, ${applicantName || req.user?.name || '[Your Name]'}". Make it specific to the job and highlight relevant skills and projects from the resume. Do NOT include any markdown formatting.`;

  try {
    const coverLetter = await generateWithFallback(prompt);
    res.json({ success: true, coverLetter });
  } catch (err) {
    handleAIError(err, res);
  }
};

// @desc    Generate interview questions
// @route   POST /api/ai/interview-questions
// @access  Private (student)
const generateInterviewQuestions = async (req, res) => {
  const { jobDescription, jobTitle, skills } = req.body;

  if (!jobDescription) {
    res.status(400);
    throw new Error('Job description is required');
  }

  const prompt = `You are an experienced technical interviewer. Based on the following job details, generate a comprehensive set of interview questions.

Job Title: ${jobTitle || 'Not specified'}
Required Skills: ${skills ? skills.join(', ') : 'Not specified'}

Job Description:
"""
${jobDescription}
"""

Return ONLY valid JSON (no markdown):
{
  "technical": [
    "<question1>",
    "<question2>",
    "<question3>",
    "<question4>",
    "<question5>"
  ],
  "hr": [
    "<question1>",
    "<question2>",
    "<question3>",
    "<question4>",
    "<question5>"
  ],
  "behavioral": [
    "<question1>",
    "<question2>",
    "<question3>",
    "<question4>",
    "<question5>"
  ],
  "tips": ["<interview tip1>", "<tip2>", "<tip3>"]
}`;

  try {
    const text = await generateWithFallback(prompt);
    const parsed = parseAIJson(text);

    if (!parsed) {
      return res.json({ success: true, raw: text });
    }

    res.json({ success: true, questions: parsed });
  } catch (err) {
    handleAIError(err, res);
  }
};

module.exports = {
  extractResumeText,
  analyzeResume,
  skillMatch,
  generateCoverLetter,
  generateInterviewQuestions,
};

