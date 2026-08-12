import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import BrowseJobs from './pages/student/BrowseJobs';
import JobDetails from './pages/student/JobDetails';
import AppliedJobs from './pages/student/AppliedJobs';
import Profile from './pages/student/Profile';
import EditProfile from './pages/student/EditProfile';
import ResumeAnalysis from './pages/student/ResumeAnalysis';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import PostJob from './pages/recruiter/PostJob';
import ManageJobs from './pages/recruiter/ManageJobs';
import ViewApplicants from './pages/recruiter/ViewApplicants';
import RecruiterProfile from './pages/recruiter/RecruiterProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#fff',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Public — anyone can browse jobs */}
          <Route path="/jobs" element={<BrowseJobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>}
          />
          <Route
            path="/student/applied"
            element={<ProtectedRoute role="student"><AppliedJobs /></ProtectedRoute>}
          />
          <Route
            path="/student/profile"
            element={<ProtectedRoute role="student"><Profile /></ProtectedRoute>}
          />
          <Route
            path="/student/profile/edit"
            element={<ProtectedRoute role="student"><EditProfile /></ProtectedRoute>}
          />
          <Route
            path="/student/ai"
            element={<ProtectedRoute role="student"><ResumeAnalysis /></ProtectedRoute>}
          />

          {/* Recruiter Routes */}
          <Route
            path="/recruiter/dashboard"
            element={<ProtectedRoute role="recruiter"><RecruiterDashboard /></ProtectedRoute>}
          />
          <Route
            path="/recruiter/post-job"
            element={<ProtectedRoute role="recruiter"><PostJob /></ProtectedRoute>}
          />
          <Route
            path="/recruiter/jobs"
            element={<ProtectedRoute role="recruiter"><ManageJobs /></ProtectedRoute>}
          />
          <Route
            path="/recruiter/jobs/:jobId/applicants"
            element={<ProtectedRoute role="recruiter"><ViewApplicants /></ProtectedRoute>}
          />
          <Route
            path="/recruiter/profile"
            element={<ProtectedRoute role="recruiter"><RecruiterProfile /></ProtectedRoute>}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
