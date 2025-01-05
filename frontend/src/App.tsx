import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Features from "./pages/Features";
import LoginSignupPage from "./pages/LoginSingupPage";
import JobAlertsPage from "./pages/JobAlerts";
import ApplicationsPage from "./pages/Applications";
import JobDetailsPage from "./pages/JobDetailsPage";
import DiscussionsPage from "./pages/DiscussionsPage";
import ResumePage from "./pages/ResumePage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // ... other config properties
};

// Initialize Firebase

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page with SEO */}
        <Route path="/" element={<HomePage />} />
        <Route path="/domain/:domain" element={<HomePage />} />
        <Route path="/company/:company" element={<HomePage />} />
        <Route path="/experience/:experience" element={<HomePage />} />
        <Route path="/type/:type" element={<HomePage />} />

        {/* Others */}
        <Route path="/features" element={<Features />} />
        <Route path="/login" element={<LoginSignupPage />} />
        <Route path="/alerts" element={<JobAlertsPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/job-details" element={<JobDetailsPage />} />
        <Route path="/discussions" element={<DiscussionsPage />} />
        <Route path="/resume" element={<ResumePage />} />
      </Routes>
    </Router>
  );
}

export default App;
