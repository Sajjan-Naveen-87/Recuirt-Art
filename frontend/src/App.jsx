import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import JobCard from './components/Job/JobCard';
import JobDetailsModal from './components/Job/JobDetailsModal';
import JobApplyModal from './components/Job/JobApplyModal';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EmailVerification from './pages/EmailVerification';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, Search, Filter, ArrowRight, User, Camera, FileText, CheckCircle, Sparkles, Loader2, Compass } from 'lucide-react';
import { jobsService } from './services/jobs';
import notificationsService from './services/notifications';
import profileService from './services/profile';
import ApplicationsList from './components/ApplicationsList';
import clinicianImg from './assets/clinician.png';
import nonClinicianImg from './assets/non_clinician.png';
import NotificationsDropdown from './components/Notifications/NotificationsDropdown';
import Achievements from './components/Dashboard/Achievements';
import MassHiringModal from './components/Contact/MassHiringModal';


function Dashboard({ activeTab, setActiveTab }) {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (activeTab === "Dashboard" || activeTab === "Explore") {
      fetchJobs();
    }
    if (activeTab === "Applications") {
      fetchApplications();
    }
  }, [activeTab]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsService.getJobs();
      setJobs(response.results || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };



  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await profileService.getMyApplications();
      setApplications(response.results || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };



  return (
    <>
      <header className="px-16 py-8 flex justify-between items-end sticky top-0 bg-[#f4f4f0]/80 backdrop-blur-md z-30 mb-8">
        <div>
           <motion.div 
             initial={{ opacity: 0, x: -20 }} 
             animate={{ opacity: 1, x: 0 }}
             className="flex items-center gap-3 mb-2"
           >
             <div className="h-px w-10 bg-indigo-600" />
             <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600 font-sans">Recruit Art</span>
           </motion.div>
           <h1 className="text-6xl font-black tracking-tight text-[#121212] font-serif capitalize">
             {activeTab === 'Dashboard' ? 'Overview.' : activeTab === 'Explore' ? 'Find Work.' : activeTab + '.'}
           </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <NotificationsDropdown onNavigate={(path) => {
             if (path.includes('applications')) setActiveTab('Applications');
             if (path.includes('profile')) setActiveTab('Profile');
          }} />

          {/* Profile Avatar */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('Profile')}
            className="w-12 h-12 rounded-full bg-[#121212] flex items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-indigo-500/20 transition-shadow border border-slate-200 overflow-hidden"
          >
             {user?.profile_image ? (
                <img 
                  src={user.profile_image.startsWith('http') ? user.profile_image : `${import.meta.env.VITE_BACKEND_URL || 'https://recruit-art-backend.onrender.com'}${user.profile_image}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
             ) : (
                <span className="text-lg font-serif font-bold text-white">
                  {user?.full_name?.[0] || user?.first_name?.[0] || <User size={20} />}
                </span>
             )}
          </motion.div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === "Dashboard" && (
          <motion.div key="dash" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="px-16 pb-16">
            <div className="grid grid-cols-12 gap-8 mb-16">
              {/* Hero Card - Dark Tech Style */}
              <motion.div whileHover={{ scale: 1.01 }} className="col-span-12 lg:col-span-8 bg-[#121212] p-16 rounded-[3rem] shadow-2xl relative overflow-hidden group text-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                
                <Compass className="relative z-10 text-[#cbd5b1] mb-8" size={32} />
                <h2 className="relative z-10 text-5xl font-serif font-medium mb-8 leading-tight text-white">
                  Find your <br/> dream job here.
                </h2>
                <div className="relative z-10 flex items-center gap-10">
                   <div>
                      <p className="text-3xl font-bold font-serif">{jobs.length}</p>
                      <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">Open Positions</p>
                   </div>
                   <div className="w-px h-12 bg-white/10"></div>
                   <div>
                      <p className="text-3xl font-bold font-serif">98%</p>
                      <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">Match Rate</p>
                   </div>
                </div>
                

              </motion.div>

              {/* Status Card - Sage Green */}
              <motion.div whileHover={{ scale: 1.01 }} className="col-span-12 lg:col-span-4 bg-[#cbd5b1] rounded-[3rem] p-10 flex flex-col justify-between shadow-xl border border-[#b8c2a0]">
                 <div className="bg-white/50 w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm mb-4">
                    <CheckCircle className="text-[#121212]" size={24} />
                 </div>
                 <div>
                    <h3 className="text-3xl font-serif font-bold text-[#121212] mb-2">Profile Status</h3>
                    <p className="text-[#121212]/70 font-sans font-medium">Your profile is visible to top recruiters.</p>
                 </div>
                 <div className="mt-8 pt-8 border-t border-[#121212]/10 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest">Active</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
                 </div>
              </motion.div>
            </div>

            {/* Welcome & Category Cards Section */}
            <div className="bg-gradient-to-b from-[#eaf3f9] to-[#f2f6fa] -mx-16 px-16 py-12 mb-16 border-y border-[#dce6ef]">
              <div className="flex items-center justify-between mb-16">
                 <div className="font-black text-[#1a5b9c] text-3xl tracking-tight flex items-center">
                    <span className="mr-[2px]">L</span>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#1a5b9c]">
                       <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    <span>GO</span>
                 </div>
                 <h2 className="text-4xl font-bold text-[#1a5b9c]">Welcome, {user?.first_name || user?.full_name?.split(' ')[0] || '{User Name}'}</h2>
                 <div className="border-[3px] border-[#1a5b9c] p-1 rounded-full bg-white shadow-sm">
                    <button className="w-[4.5rem] h-[4.5rem] bg-[#1a5b9c] text-white rounded-full font-medium flex items-center justify-center">
                       Profile
                    </button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-4">
                {/* Non Clinician Card */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-[2rem] p-8 shadow-xl shadow-[#1a5b9c]/10 border border-slate-100 relative flex flex-col justify-center min-h-[260px]"
                >
                  <div className="absolute -bottom-0 -left-6 w-64 h-[125%] z-10 pointer-events-none drop-shadow-2xl">
                    <img src={nonClinicianImg} alt="Non Clinician" className="w-full h-full object-contain object-bottom" />
                  </div>
                  <div className="ml-[45%] pl-4 pr-2 py-2 flex flex-col h-full z-20">
                    <h3 className="text-2xl font-bold text-[#1a5b9c] mb-3 leading-tight font-sans">
                      Vacancies for Non<br/>Clinician Category
                    </h3>
                    <p className="text-[#333] mb-8 text-sm leading-relaxed">
                      Explore administrative,<br/>support, and professional<br/>roles.
                    </p>
                    <button className="bg-[#1a5b9c] text-white px-8 py-2.5 rounded-lg font-bold w-fit hover:bg-[#124b84] transition-colors shadow-lg shadow-[#1a5b9c]/30">
                      View Jobs
                    </button>
                  </div>
                </motion.div>

                {/* Clinician Card */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-[2rem] p-8 shadow-xl shadow-[#1a5b9c]/10 border border-slate-100 relative flex flex-col justify-center min-h-[260px]"
                >
                  <div className="pr-[45%] pl-2 py-2 flex flex-col h-full z-20 w-full">
                    <h3 className="text-2xl font-bold text-[#1a5b9c] mb-3 leading-tight font-sans">
                      Vacancies for<br/>Clinician Category
                    </h3>
                    <p className="text-[#333] mb-8 text-sm leading-relaxed">
                      Discover opportunities for<br/>doctors, nurses, and<br/>medical specialists.
                    </p>
                    <button className="bg-[#1a5b9c] text-white px-8 py-2.5 rounded-lg font-bold w-fit hover:bg-[#124b84] transition-colors shadow-lg shadow-[#1a5b9c]/30">
                      View Jobs
                    </button>
                  </div>
                  <div className="absolute -bottom-0 right-0 w-72 h-[125%] z-10 pointer-events-none drop-shadow-2xl">
                    <img src={clinicianImg} alt="Clinician" className="w-full h-full object-contain object-bottom" />
                  </div>
                </motion.div>
              </div>
            </div>

          {/* Achievements Section */}
          <Achievements applicationsCount={applications.length} />

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#121212] font-serif">Latest Opportunities</h2>
            <div className="flex gap-2">
               <button className="px-4 py-2 bg-[#121212] text-white rounded-full text-xs font-bold uppercase tracking-wider">All</button>
               <button className="px-4 py-2 bg-white text-slate-500 hover:bg-slate-50 rounded-full text-xs font-bold uppercase tracking-wider">Recommended</button>
            </div>
          </div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white border border-slate-200 p-16 rounded-[3rem] text-center">
                <p className="text-slate-400 font-serif text-xl italic">No positions available fitting your criteria.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {jobs.map((job, i) => (
                  <JobCard
                    key={job.id || i}
                    job={job}
                    onClick={handleJobClick}
                    showApplyButton={true}
                    onApply={handleApplyClick}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Explore & Applications tabs handled similarly ... keeping existing logic but updated styling */}
        {activeTab === "Explore" && (
           <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-16 pb-16">
             <div className="bg-white p-2 rounded-full mb-12 flex items-center shadow-lg shadow-indigo-900/5 max-w-3xl border border-slate-100">
               <div className="p-4 bg-[#121212] rounded-full text-white"><Search size={20} /></div>
               <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for roles, companies, or locations..." 
                  className="flex-1 px-6 outline-none text-lg font-serif placeholder:text-slate-400 bg-transparent" 
               />
             </div>
             <div className="flex flex-col gap-4">
               {jobs
                 .filter(job => 
                    job.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    job.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    job.location?.toLowerCase().includes(searchQuery.toLowerCase())
                 )
                 .map((job, i) => (
                 <JobCard key={job.id || i} job={job} onClick={handleJobClick} showApplyButton={true} onApply={handleApplyClick} />
               ))}
               {jobs.filter(job => 
                    job.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    job.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
               ).length === 0 && (
                  <div className="text-center py-20 opacity-50">
                     <Search size={48} className="mx-auto mb-4" />
                     <p className="text-xl font-serif">No results found for "{searchQuery}"</p>
                  </div>
               )}
             </div>
           </motion.div>
        )}

        {activeTab === "Applications" && (
          <motion.div key="apps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-16 pb-16">
            <ApplicationsList applications={applications} isLoading={loading} />
          </motion.div>
        )}

        {activeTab === "Profile" && <Profile />}
      </AnimatePresence>

      {/* Modals */}
      {showJobDetails && selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          isOpen={showJobDetails}
          onClose={() => setShowJobDetails(false)}
          onApply={() => {
            setShowJobDetails(false);
            setShowApplyModal(true);
          }}
        />
      )}

      {showApplyModal && selectedJob && (
        <JobApplyModal
          job={selectedJob}
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
        />
      )}
    </>
  );
}

function MainLayout() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [showMassHiringModal, setShowMassHiringModal] = useState(false);
  const { logout } = useAuth();
  const handleLogout = async () => await logout();

  return (
    <div className="flex h-screen bg-[#121212] p-4 gap-4 font-sans text-slate-900 overflow-hidden relative selection:bg-indigo-500 selection:text-white">
      {/* Background Accent / Noise */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
      
      {/* Sidebar - Dark on Dark */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        onHireTalent={() => setShowMassHiringModal(true)}
      />
      
      {/* Main Content - Light Card on Dark Background */}
      <main className="flex-1 bg-[#f4f4f0] rounded-[2.5rem] overflow-y-auto flex flex-col relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>

      {/* Mass Hiring Inquiry Modal */}
      <MassHiringModal 
        isOpen={showMassHiringModal} 
        onClose={() => setShowMassHiringModal(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
