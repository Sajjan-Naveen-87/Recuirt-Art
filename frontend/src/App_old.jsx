import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import JobCard from './components/Job/JobCard';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, Search, Filter, ArrowRight, User, Camera, FileText, CheckCircle, Sparkles } from 'lucide-react';

function Dashboard({ activeTab, setActiveTab }) {
  const jobs = [
    { title: "Senior UI Architect", company: "Jobitus HQ", location: "Remote", salary: "$160k", match: 98 },
    { title: "Full Stack Lead", company: "Designly", location: "New York", salary: "$145k", match: 92 },
    { title: "Product Strategist", company: "GlobalTech", location: "Hybrid", salary: "$130k", match: 85 },
  ];

  const applications = [
    { role: "Frontend Developer", company: "Google", status: "Interview", date: "28 Jan", progress: 75 },
    { role: "Product Designer", company: "Meta", status: "In Review", date: "25 Jan", progress: 40 },
    { role: "UI Engineer", company: "Stripe", status: "Applied", date: "20 Jan", progress: 10 },
  ];

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
          <div className="bg-white border border-slate-100 p-4 rounded-3xl text-slate-400 hover:text-indigo-600 cursor-pointer transition-all">
            <Bell size={20} />
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
                   <p className="text-4xl font-black">98.2%</p>
                </div>
                <div className="flex-1 bg-indigo-50 rounded-[3.5rem] p-10 flex items-center justify-between border border-indigo-100/50">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm"><CheckCircle className="text-indigo-600" size={24} /></div>
                   <div className="text-right"><p className="text-2xl font-bold">Verified</p></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {jobs.map((job, i) => <JobCard key={i} job={job} />)}
            </div>
          </motion.div>
        )}

        {activeTab === "Explore" && (
          <motion.div key="explore" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="px-16 pb-16">
            <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-[3.5rem] mb-12 flex items-center gap-4 focus-within:bg-white transition-all shadow-inner">
              <Search className="ml-6 text-slate-400" size={28} />
              <input type="text" placeholder="Search elite opportunities..." className="bg-transparent flex-1 py-6 outline-none text-2xl font-black placeholder:text-slate-300" />
              <button className="bg-white border border-slate-200 p-6 rounded-[2.5rem] text-slate-900 shadow-sm"><Filter size={24} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...jobs, ...jobs].map((job, i) => <JobCard key={i} job={job} />)}
            </div>
          </motion.div>
        )}

        {activeTab === "Applications" && (
          <motion.div key="apps" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="px-16 pb-16">
            <div className="space-y-6">
              {applications.map((app, i) => (
                <div key={i} className="bg-white border border-slate-100 p-10 rounded-[3.5rem] flex items-center justify-between group hover:border-indigo-600 transition-all shadow-sm">
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center font-black text-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">{app.company[0]}</div>
                    <div>
                      <h3 className="text-2xl font-black">{app.role}</h3>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{app.company} - {app.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="w-48 hidden md:block">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${app.progress}%` }} className="h-full bg-indigo-600" />
                      </div>
                    </div>
                    <span className="px-6 py-2 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-tighter">{app.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "Profile" && (
          <motion.div key="profile" initial={{ opacity: 0, rotateX: 20 }} animate={{ opacity: 1, rotateX: 0 }} exit={{ opacity: 0 }} className="px-16 pb-16">
            <div className="flex gap-16">
              <div className="w-1/3 space-y-8">
                <div className="bg-white border border-slate-100 p-4 rounded-[4rem] shadow-2xl relative">
                  <div className="aspect-square bg-slate-50 rounded-[3.5rem] flex items-center justify-center text-slate-200">
                    <User size={120} />
                  </div>
                  <button className="absolute bottom-6 right-6 bg-slate-950 text-white p-6 rounded-3xl border-4 border-white"><Camera size={24} /></button>
                </div>
                <div className="bg-slate-900 rounded-[3rem] p-10 text-white">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Member Since</p>
                  <p className="text-xl font-bold italic">January 2026</p>
                </div>
              </div>
              <div className="flex-1 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="p-10 border border-slate-100 rounded-[3rem] bg-white">
                    <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Full Name</p>
                    <p className="text-2xl font-black">Prabhas Avvaru</p>
                  </div>
                  <div className="p-10 border border-slate-100 rounded-[3rem] bg-white">
                    <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Status</p>
                    <p className="text-2xl font-black text-emerald-500">Available</p>
                  </div>
                </div>
                <div className="p-10 bg-indigo-600 text-white rounded-[4rem] flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md"><FileText size={32} /></div>
                    <div>
                      <p className="text-xl font-black italic tracking-tight">Elite_Resume_2026.pdf</p>
                      <p className="text-xs font-bold opacity-60">Synced with Local Database</p>
                    </div>
                  </div>
                  <CheckCircle size={32} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
