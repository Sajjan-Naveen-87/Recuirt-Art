import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/Landing/LandingPage';
import JobsPage from './pages/JobsPage';
import ContactUs from './pages/ContactUs';
import Portfolio from './pages/Portfolio';
import Testimonials from './pages/Testimonials';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
