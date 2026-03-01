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
import LandingPage from './components/Landing/LandingPage';
import ContactUs from './pages/ContactUs';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, Search, Filter, ArrowRight, User, Camera, FileText, CheckCircle, Sparkles, Loader2, Compass, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [stats, setStats] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (activeTab === "Dashboard" || activeTab === "Explore") {
      fetchJobs();
    }
    if (activeTab === "Dashboard") {
      fetchStats();
    }
    if (activeTab === "Applications") {
      fetchApplications();
    }
  }, [activeTab]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    // Reset to page 1 when search query changes
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (activeTab === 'Dashboard' || activeTab === 'Explore') {
      fetchJobs();
    }
  }, [activeTab, currentPage, searchQuery]);

  const fetchStats = async () => {
    try {
      const data = await profileService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsService.getJobs({
        page: currentPage,
        page_size: pageSize,
        search: searchQuery || ''
      });
      
      if (response?.results) {
        setJobs(response.results);
        setTotalCount(response.count || 0);
      } else if (Array.isArray(response)) {
        setJobs(response);
        setTotalCount(response.length);
      } else {
        setJobs([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
      setTotalCount(0);
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
      <header className="px-6 md:px-8 lg:px-16 py-6 md:py-8 flex justify-between items-end sticky top-0 bg-[#f4f4f0]/80 backdrop-blur-md z-30 border-b border-slate-200/40">
        <div>
           <motion.div 
             initial={{ opacity: 0, x: -20 }} 
             animate={{ opacity: 1, x: 0 }}
             className="mb-3 md:mb-4 lg:hidden xl:block"
           >
           </motion.div>
           <h1 className="text-3xl md:text-4xl lg:text-6xl font-serif font-black tracking-tight text-[#121212] capitalize">
             {activeTab === 'Dashboard' ? 'Overview.' : activeTab === 'Explore' ? 'Find Work.' : activeTab + '.'}
           </h1>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          <NotificationsDropdown onNavigate={(path) => {
             if (path.includes('applications')) setActiveTab('Applications');
             if (path.includes('profile')) setActiveTab('Profile');
          }} />

          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('Profile')}
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#121212] flex items-center justify-center cursor-pointer shadow-lg shadow-black/10 border border-white/10 overflow-hidden"
          >
             {user?.profile_image ? (
                <img 
                  src={user.profile_image.startsWith('http') ? user.profile_image : `${import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'}${user.profile_image}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
             ) : (
                <span className="text-base md:text-lg font-serif font-bold text-[#cbd5b1]">
                  {user?.full_name?.[0] || user?.first_name?.[0] || <User size={18} />}
                </span>
             )}
          </motion.div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === "Dashboard" && (
          <motion.div 
            key="dash" 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -30 }} 
            className="px-6 md:px-8 lg:px-16 pb-12 md:pb-16 pt-8 md:pt-12"
          >
            {/* Welcome & Arched Category Cards Section */}
            <div className="mb-12 md:mb-20">
              <div className="flex flex-col items-center justify-center mb-12 md:mb-20 text-center">
                 <h3 className="text-4xl md:text-5xl lg:text-7xl font-black text-[#1e599b]">
                   Welcome, {user?.first_name || user?.full_name?.split(' ')[0] || 'S'}
                 </h3>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 md:gap-12 px-2 md:px-4">
                {/* Non Clinician Card */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-[3rem] md:rounded-[4rem] shadow-2xl relative flex flex-col md:flex-row items-center overflow-hidden border border-slate-100 group min-h-[400px]"
                >
                  {/* Image Side - Left */}
                  <div className="w-full md:w-1/2 h-64 md:h-[450px] relative flex items-end justify-center md:justify-start pointer-events-none">
                    <img 
                      src={nonClinicianImg} 
                      alt="Non Clinician" 
                      className="h-full md:h-[110%] w-auto object-contain object-bottom transform md:translate-x-4 transition-transform duration-700 group-hover:scale-105" 
                    />
                  </div>

                  {/* Text Side - Right */}
                  <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col items-center justify-center text-center z-10">
                    <h3 className="text-2xl md:text-3xl font-bold text-[#1e599b] mb-4 leading-tight">
                      Vacancies for Non <br className="hidden md:block"/> Clinician Category
                    </h3>
                    <p className="text-slate-500 text-sm md:text-base font-medium mb-10 max-w-[250px]">
                      Explore administrative, support, and professional roles.
                    </p>
                    <button 
                      onClick={() => {
                        setSearchQuery('Non Clinician');
                        setActiveTab('Explore');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full md:w-auto bg-[#1e599b] text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-[#164a82] transition-all shadow-xl shadow-blue-900/20 active:scale-95"
                    >
                      View Jobs
                    </button>
                  </div>
                </motion.div>

                {/* Clinician Card */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-[3rem] md:rounded-[4rem] shadow-2xl relative flex flex-col md:flex-row-reverse items-center overflow-hidden border border-slate-100 group min-h-[400px]"
                >
                  {/* Image Side - Right */}
                  <div className="w-full md:w-1/2 h-64 md:h-[450px] relative flex items-end justify-center md:justify-end pointer-events-none">
                    <img 
                      src={clinicianImg} 
                      alt="Clinician" 
                      className="h-full md:h-[110%] w-auto object-contain object-bottom transform md:-translate-x-4 transition-transform duration-700 group-hover:scale-105" 
                    />
                  </div>

                  {/* Text Side - Left */}
                  <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col items-center justify-center text-center z-10">
                    <h3 className="text-2xl md:text-3xl font-bold text-[#1e599b] mb-4 leading-tight">
                      Vacancies for <br className="hidden md:block"/> Clinician Category
                    </h3>
                    <p className="text-slate-500 text-sm md:text-base font-medium mb-10 max-w-[250px]">
                      Discover opportunities for doctors, nurses, and medical specialists.
                    </p>
                    <button 
                      onClick={() => {
                        setSearchQuery('Clinician');
                        setActiveTab('Explore');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full md:w-auto bg-[#1e599b] text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-[#164a82] transition-all shadow-xl shadow-blue-900/20 active:scale-95"
                    >
                      View Jobs
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-8 mb-16 md:mb-20">
              {/* Hero Card - Dark Tech Style */}
              <motion.div 
                whileHover={{ y: -5 }} 
                className="col-span-12 lg:col-span-8 bg-[#121212] p-8 md:p-12 lg:p-16 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden group text-white border border-white/5"
              >
                <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-[#cbd5b1]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                
                <div className="relative z-10">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#cbd5b1]/20 rounded-xl flex items-center justify-center text-[#cbd5b1] mb-6 md:mb-8">
                    <Compass size={24} md:size={28} />
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-6xl font-serif font-black mb-8 md:mb-10 leading-[1.1] text-white">
                    Find your <br className="hidden md:block"/> next craft.
                  </h2>
                  <div className="flex items-center gap-8 md:gap-12">
                     <div className="space-y-1">
                        <p className="text-2xl md:text-3xl lg:text-4xl font-serif font-black text-[#cbd5b1]">{stats?.open_jobs_count ?? jobs.length}</p>
                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Open Positions</p>
                     </div>
                     <div className="w-px h-10 md:h-12 bg-white/10"></div>
                     <div className="space-y-1">
                        <p className="text-2xl md:text-3xl lg:text-4xl font-serif font-black text-[#cbd5b1]">{stats?.match_rate ?? 98}%</p>
                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Match Rate</p>
                     </div>
                  </div>
                </div>
              </motion.div>

              {/* Status Card - Sage Green */}
              <motion.div 
                whileHover={{ y: -5 }} 
                className="col-span-12 lg:col-span-4 bg-[#cbd5b1] rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 flex flex-col justify-between shadow-xl border border-[#b8c2a0] relative overflow-hidden"
              >
                 <div className="relative z-10">
                   <div className="bg-[#121212] w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-[#cbd5b1] mb-6 md:mb-8 shadow-lg">
                      <CheckCircle size={24} md:size={28} />
                   </div>
                   <h3 className="text-2xl md:text-3xl font-serif font-black text-[#121212] mb-2 md:mb-3">Profile Status</h3>
                   <p className="text-[#121212]/70 font-medium text-sm md:text-base leading-relaxed">
                     Your profile is now highlly visible to top medical recruiters.
                   </p>
                 </div>
                 
                 <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-[#121212]/10 flex items-center justify-between relative z-10">
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#121212]/60">Active Visibility</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] md:text-xs font-black text-[#121212]">Online</span>
                      <div className="w-2 h-2 bg-[#121212] rounded-full animate-pulse"></div>
                    </div>
                 </div>
              </motion.div>
            </div>



          {/* Achievements Section */}
          <Achievements 
            applicationsCount={stats?.applications_sent ?? applications.length} 
            stats={stats}
          />

          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-serif font-black text-[#121212]">Latest Opportunities</h2>
            <div className="flex gap-3">
               <button className="px-6 py-2.5 bg-[#121212] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/10">All</button>
               <button className="px-6 py-2.5 bg-white text-slate-500 hover:bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-200 shadow-sm">Recommended</button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-12 w-12 border-4 border-[#cbd5b1] border-t-transparent rounded-full"
              />
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white border border-slate-200/60 p-20 rounded-[3rem] text-center shadow-sm">
              <p className="text-slate-400 font-serif text-2xl italic">No positions available fitting your criteria.</p>
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

              {/* Pagination Controls */}
              {Math.ceil(totalCount / pageSize) > 1 && (
                <div className="flex justify-center items-center gap-6 mt-12 bg-white/40 p-6 rounded-[2rem] border border-slate-200/40">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`p-3 rounded-xl border ${currentPage === 1 ? 'text-slate-300 border-slate-100' : 'text-[#121212] border-slate-200 hover:bg-slate-50'}`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="font-serif font-black text-lg text-[#121212]">
                    {currentPage} / {Math.ceil(totalCount / pageSize)}
                  </span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalCount / pageSize), p + 1))}
                    disabled={currentPage === Math.ceil(totalCount / pageSize)}
                    className={`p-3 rounded-xl border ${currentPage === Math.ceil(totalCount / pageSize) ? 'text-slate-300 border-slate-100' : 'text-[#121212] border-slate-200 hover:bg-slate-50'}`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          )}
          </motion.div>
        )}

        {activeTab === "Explore" && (
           <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 md:px-8 lg:px-16 pb-12 md:pb-16 pt-6 md:pt-8">
             <div className="bg-white p-2 md:p-3 rounded-2xl md:rounded-3xl mb-10 md:mb-16 flex items-center shadow-sm border border-slate-200/60 max-w-4xl">
               <div className="p-3 md:p-4 bg-[#121212] rounded-xl md:rounded-2xl text-[#cbd5b1] shadow-lg"><Search size={18} md:size={22} /></div>
               <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for roles, companies, or locations..." 
                  className="flex-1 px-4 md:px-8 outline-none text-base md:text-xl font-serif font-black placeholder:text-slate-300 bg-transparent text-[#121212]" 
               />
             </div>
             
             <div className="flex flex-col gap-4">
               {jobs.map((job, i) => (
                 <JobCard key={job.id || i} job={job} onClick={handleJobClick} showApplyButton={true} onApply={handleApplyClick} />
               ))}
               
               {jobs.length === 0 && (
                  <div className="text-center py-16 md:py-24 opacity-30">
                     <Search size={48} md:size={64} className="mx-auto mb-4 md:mb-6 text-[#121212]" />
                     <p className="text-xl md:text-2xl font-serif font-black">No results found</p>
                  </div>
               )}

               {/* Pagination Controls */}
               {Math.ceil(totalCount / pageSize) > 1 && (
                 <div className="flex justify-center items-center gap-6 mt-12">
                   <button 
                     onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                     disabled={currentPage === 1}
                     className={`p-3 rounded-xl border ${currentPage === 1 ? 'text-slate-300 border-slate-100' : 'text-[#121212] border-slate-200 hover:bg-slate-50'}`}
                   >
                     <ChevronLeft size={20} />
                   </button>
                   <span className="font-serif font-black text-lg">
                     {currentPage} / {Math.ceil(totalCount / pageSize)}
                   </span>
                   <button 
                     onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalCount / pageSize), p + 1))}
                     disabled={currentPage === Math.ceil(totalCount / pageSize)}
                     className={`p-3 rounded-xl border ${currentPage === Math.ceil(totalCount / pageSize) ? 'text-slate-300 border-slate-100' : 'text-[#121212] border-slate-200 hover:bg-slate-50'}`}
                   >
                     <ChevronRight size={20} />
                   </button>
                 </div>
               )}
             </div>
           </motion.div>
        )}

        {activeTab === "Applications" && (
          <motion.div key="apps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 md:px-8 lg:px-16 pb-12 md:pb-16 pt-6 md:pt-8">
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  
  const handleLogout = async () => await logout();

  // Close sidebar on small screens when tab changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activeTab]);

  return (
    <div className="flex h-screen bg-[#121212] md:p-4 gap-0 md:gap-4 font-sans text-slate-900 overflow-hidden relative selection:bg-[#cbd5b1] selection:text-[#121212]">
      {/* Background Accent / Noise */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
      
      {/* Mobile Header - Visible only on small screens */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#f4f4f0] border-b border-slate-200/60 flex items-center justify-between px-6 z-40 shadow-sm">
        <div className="w-32 h-8 overflow-hidden flex items-center">
          <img src="/Logo.jpg" alt="Logo" className="w-full h-full object-contain object-left mix-blend-multiply" />
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-10 h-10 bg-[#121212] text-[#cbd5b1] rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar - Drawer for mobile, sticky for desktop */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <>
            {/* Backdrop for mobile */}
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              />
            )}
            
            <motion.div 
              initial={window.innerWidth < 1024 ? { x: -300 } : false}
              animate={{ x: 0 }}
              exit={window.innerWidth < 1024 ? { x: -300 } : false}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed lg:relative top-0 left-0 h-full z-50 lg:z-auto w-[280px] lg:w-auto shadow-2xl lg:shadow-none"
            >
              <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onLogout={handleLogout} 
                onHireTalent={() => setShowMassHiringModal(true)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Main Content - Light Card on Dark Background */}
      <main className="flex-1 bg-[#f4f4f0] md:rounded-[2.5rem] overflow-y-auto flex flex-col relative z-30 shadow-[0_0_80px_rgba(0,0,0,0.6)] border border-white/5 mt-16 lg:mt-0">
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
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><MainLayout /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
