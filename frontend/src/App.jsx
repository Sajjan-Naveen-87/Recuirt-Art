import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import JobCard from './components/Job/JobCard';
import JobDetailsModal from './components/Job/JobDetailsModal';
import JobApplyModal from './components/Job/JobApplyModal';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, Search, Filter, ArrowRight, User, Camera, FileText, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import { jobsService } from './services/jobs';
import notificationsService from './services/notifications';

function Dashboard({ activeTab, setActiveTab }) {
  const [jobs, setJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    if (activeTab === "Dashboard" || activeTab === "Explore") {
      fetchJobs();
    }
    if (activeTab === "Dashboard") {
      fetchNotifications();
    }
  }, [activeTab]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsService.getJobs();
      setJobs(response.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await notificationsService.getNotifications();
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
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

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <>
      <header className="px-16 py-12 flex justify-between items-end sticky top-0 bg-white/10 backdrop-blur-md z-30">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="h-[2px] w-8 bg-indigo-600 rounded-full" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Recuirt Art</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter lowercase">{activeTab}.</h1>
        </div>
        <div className="flex items-center gap-5">
          <div className="relative bg-white border border-slate-100 p-4 rounded-3xl text-slate-400 hover:text-indigo-600 cursor-pointer transition-all">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <button className="bg-slate-950 text-white px-8 py-4 rounded-[1.8rem] font-bold shadow-2xl hover:bg-indigo-600 transition-all flex items-center gap-3 active:scale-95">
            <Plus size={20} /> <span className="text-sm">New Pipeline</span>
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === "Dashboard" && (
          <motion.div key="dash" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="px-16 pb-16">
            <div className="grid grid-cols-12 gap-8 mb-16">
              <motion.div whileHover={{ y: -5 }} className="col-span-12 lg:col-span-7 bg-white p-12 rounded-[4rem] shadow-xl border border-slate-50 relative overflow-hidden group">
                <Sparkles className="absolute top-10 right-10 text-indigo-100 group-hover:text-indigo-500 transition-colors" size={100} />
                <h2 className="text-4xl font-black mb-6 leading-[1.1]">The elite <br/> pipeline is <span className="text-indigo-600">active.</span></h2>
                <p className="text-slate-500 font-medium max-w-sm mb-10 leading-relaxed text-sm">Synchronized with Recuirt Art RM protocols.</p>
                <button className="flex items-center gap-3 text-sm font-black uppercase tracking-widest hover:gap-5 transition-all">Review Insights <ArrowRight size={18} /></button>
              </motion.div>
              <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
                <div className="flex-1 bg-slate-900 rounded-[3.5rem] p-10 text-white flex flex-col justify-between shadow-2xl">
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Queue Status</p>
                   <p className="text-4xl font-black">{jobs.length > 0 ? '98.2%' : '0%'}</p>
                </div>
                <div className="flex-1 bg-indigo-50 rounded-[3.5rem] p-10 flex items-center justify-between border border-indigo-100/50">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm"><CheckCircle className="text-indigo-600" size={24} /></div>
                   <div className="text-right"><p className="text-2xl font-bold">Verified</p></div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white border border-slate-100 p-12 rounded-[3rem] text-center">
                <p className="text-slate-500 font-medium">No jobs available at the moment. Check back later!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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

        {activeTab === "Explore" && (
          <motion.div key="explore" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="px-16 pb-16">
            <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-[3.5rem] mb-12 flex items-center gap-4 focus-within:bg-white transition-all shadow-inner">
              <Search className="ml-6 text-slate-400" size={28} />
              <input type="text" placeholder="Search elite opportunities..." className="bg-transparent flex-1 py-6 outline-none text-2xl font-black placeholder:text-slate-300" />
              <button className="bg-white border border-slate-200 p-6 rounded-[2.5rem] text-slate-900 shadow-sm"><Filter size={24} /></button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white border border-slate-100 p-12 rounded-[3rem] text-center">
                <p className="text-slate-500 font-medium">No jobs available at the moment. Check back later!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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

        {activeTab === "Applications" && (
          <motion.div key="apps" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="px-16 pb-16">
            <div className="space-y-6">
              <p className="text-slate-500 font-medium">Applications feature coming soon...</p>
            </div>
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
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex h-screen bg-[#F0F2F5] p-6 gap-6 font-sans text-slate-900 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-white/40 blur-[120px] rounded-full pointer-events-none" />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <main className="flex-1 bg-white/80 backdrop-blur-2xl rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-y-auto flex flex-col border border-white relative z-10">
        <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
