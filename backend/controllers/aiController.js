const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

// Helper: parse JSON from AI response
const parseAIJson = (text) => {
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
};

// Helper: convert raw Gemini errors into user-friendly messages
const handleAIError = (err, res) => {
  const msg = err?.message || '';
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

// @desc    Analyze resume with AI
// @route   POST /api/ai/analyze-resume
// @access  Private (student)
const analyzeResume = async (req, res) => {
  const { resumeText } = req.body;

  if (!resumeText) {
    res.status(400);
    throw new Error('Resume text is required');
  }

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const prompt = `You are an expert HR consultant and resume reviewer. Today's date is ${today}. Analyze the following resume and return a detailed JSON report.
IMPORTANT: Do NOT flag any dates from ${new Date().getFullYear()} or earlier as "future" dates — they are valid present or past dates.

Resume:
"""
${resumeText}
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
    const result = await model.generateContent(prompt);
    const text = result.response.text();
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
  const { resumeText, jobDescription, jobTitle } = req.body;

  if (!resumeText || !jobDescription) {
    res.status(400);
    throw new Error('Resume text and job description are required');
  }

  const prompt = `You are an expert career counselor. Compare the following resume with the job description and return a JSON compatibility report.

Job Title: ${jobTitle || 'Not specified'}

Job Description:
"""
${jobDescription}
"""

Candidate Resume:
"""
${resumeText}
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
    const result = await model.generateContent(prompt);
    const text = result.response.text();
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
  const { resumeText, jobDescription, jobTitle, companyName, applicantName } = req.body;

  if (!resumeText || !jobDescription) {
    res.status(400);
    throw new Error('Resume text and job description are required');
  }

  const prompt = `You are a professional career coach. Write a compelling, personalized cover letter for the following job application.

Applicant Name: ${applicantName || 'The Applicant'}
Job Title: ${jobTitle || 'the position'}
Company Name: ${companyName || 'the company'}

Job Description:
"""
${jobDescription}
"""

Applicant's Resume:
"""
${resumeText}
"""

Write a professional, enthusiastic, and personalized cover letter of 3-4 paragraphs. Start directly with "Dear Hiring Manager," and end with "Sincerely, ${applicantName || '[Your Name]'}". Make it specific to the job and highlight relevant skills from the resume. Do NOT include any markdown formatting.`;

  try {
    const result = await model.generateContent(prompt);
    const coverLetter = result.response.text();

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
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = parseAIJson(text);

    if (!parsed) {
      return res.json({ success: true, raw: text });
    }

    res.json({ success: true, questions: parsed });
  } catch (err) {
    handleAIError(err, res);
  }
};

module.exports = { analyzeResume, skillMatch, generateCoverLetter, generateInterviewQuestions };
