import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/Landing/LandingPage';
import JobsPage from './pages/JobsPage';
import Portfolio from './pages/Portfolio';
import Testimonials from './pages/Testimonials';
import { useEffect } from 'react';

const AdminRedirect = () => {
  useEffect(() => {
    window.location.href = 'https://recruit-art-backend.onrender.com/admin/';
  }, []);
  return null;
};


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/ra-admin" element={<AdminRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
