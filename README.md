# TalentAI 🚀
### AI-Powered Recruitment Platform | MERN Stack + Google Gemini

> A full-stack college major project showcasing modern web development and real-world Generative AI integration.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| File Upload | Cloudinary |
| AI | Google Gemini 1.5 Flash |

---

## Features

### Student
- ✅ Create & edit profile (skills, education, experience, projects)
- ✅ Upload resume (PDF) via Cloudinary
- ✅ Browse & search jobs with filters
- ✅ Apply with AI-generated cover letters
- ✅ Track application status with visual pipeline
- ✅ Save jobs
- ✅ AI Resume Analyzer (score, strengths, weaknesses)
- ✅ AI Skill Match (compare resume with job)
- ✅ AI Cover Letter Generator
- ✅ AI Interview Question Generator

### Recruiter
- ✅ Create company profile
- ✅ Post, edit, delete jobs
- ✅ View all applicants with filter by status
- ✅ Update application status (Shortlist → Interview → Select/Reject)
- ✅ Dashboard with stats

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account
- Google Gemini API key

### Backend Setup
```bash
cd backend
# Copy .env.example to .env and fill in your credentials
cp .env.example .env
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`  
The backend runs at `http://localhost:5000`

---

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/talentai
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

---

## Project Structure

```
TalentAI/
├── backend/
│   ├── config/          # DB & Cloudinary config
│   ├── controllers/     # Business logic (MVC)
│   ├── middleware/      # Auth, error, upload
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── utils/           # Token generator
│   └── server.js
└── frontend/
    └── src/
        ├── api/         # Axios instance
        ├── components/  # Reusable UI components
        ├── context/     # Auth context (Context API)
        └── pages/       # All page components
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/jobs` | Get all jobs (search & filter) |
| POST | `/api/jobs` | Create job (recruiter) |
| POST | `/api/applications/:jobId` | Apply for job |
| PUT | `/api/applications/:id/status` | Update status (recruiter) |
| POST | `/api/ai/analyze-resume` | AI resume analysis |
| POST | `/api/ai/skill-match` | AI skill matching |
| POST | `/api/ai/cover-letter` | AI cover letter |
| POST | `/api/ai/interview-questions` | AI interview prep |

---

*Built with ❤️ as a college major project — MERN Stack + Generative AI*