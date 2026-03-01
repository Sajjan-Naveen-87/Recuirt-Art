import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronDown, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar({ searchQuery, setSearchQuery, onSearchFocus }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-[#cbd5b1] px-6 md:px-8 py-5 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6 lg:gap-16">
        <Link to="/" className="w-24 md:w-30 h-12 md:h-15 overflow-hidden flex-shrink-0 flex items-center hover:opacity-90 transition-opacity">
          <img src="/Logo.jpg" alt="Recruit Art Logo" className="w-full h-full object-contain object-left mix-blend-multiply" />
        </Link>

        {/* Search Bar - Hidden on Mobile/Tablet Navbar, shown in Menu */}
        {setSearchQuery && (
          <div className="hidden lg:flex items-center bg-white/60 backdrop-blur-md rounded-full px-6 py-3 border border-[#121212]/10 focus-within:border-indigo-500/50 transition-all w-[32rem] shadow-sm">
            <Search size={22} className="text-slate-600 mr-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (onSearchFocus) onSearchFocus();
              }}
              onFocus={onSearchFocus}
              placeholder="Search jobs..." 
              className="bg-transparent border-none outline-none text-base font-semibold text-slate-900 placeholder:text-slate-500 w-full"
            />
          </div>
        )}
      </div>

      {/* Desktop Links */}
      <div className="hidden xl:flex items-center text-slate-900 font-bold text-[15px] h-full relative">
        <div className="group relative flex items-center h-full px-4 cursor-pointer hover:text-slate-700 transition-colors py-4">
          <span className="flex items-center gap-1">About Us <ChevronDown size={16} strokeWidth={3} className="transition-transform group-hover:rotate-180" /></span>
          <div className="absolute top-full left-0 w-48 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 shadow-xl border border-slate-900/10 flex flex-col z-50">
            <a href="/#about-us" className="bg-[#e7e3d5] text-slate-900 hover:bg-[#dcd7c4] px-6 py-4 transition-colors">Our Story</a>
            <a href="/#team" className="bg-[#41424b] text-white hover:bg-[#34353d] px-6 py-4 transition-colors">Meet the team</a>
          </div>
        </div>

        <div className="group relative flex items-center h-full px-4 cursor-pointer hover:text-slate-700 transition-colors py-4">
          <span className="flex items-center gap-1">Employers <ChevronDown size={16} strokeWidth={3} className="transition-transform group-hover:rotate-180" /></span>
          <div className="absolute top-full left-0 w-56 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 shadow-xl bg-[#e7e3d5] border border-slate-900/10 flex flex-col z-50">
            <a href="/#services" className="text-slate-900 hover:bg-[#dcd7c4] px-6 py-4 transition-colors">Services</a>
            <a href="/#services" className="text-slate-900 hover:bg-[#dcd7c4] px-6 py-4 transition-colors">Sector-1 Recruitment</a>
            <Link to="/contact" className="text-slate-900 hover:bg-[#dcd7c4] px-6 py-4 transition-colors">Submit Vacancy</Link>
          </div>
        </div>

        <div className="group relative flex items-center h-full px-4 cursor-pointer hover:text-slate-700 transition-colors py-4">
          <span className="flex items-center gap-1">Job Seekers <ChevronDown size={16} strokeWidth={3} className="transition-transform group-hover:rotate-180" /></span>
          <div className="absolute top-full left-0 w-48 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 shadow-xl bg-[#e7e3d5] border border-slate-900/10 flex flex-col z-50">
            <a href="/#jobs" className="text-slate-900 hover:bg-[#dcd7c4] px-6 py-4 transition-colors">Search Jobs</a>
            <a href="/#jobs" className="text-slate-900 hover:bg-[#dcd7c4] px-6 py-4 transition-colors">Sector-1 Jobs</a>
            <Link to="/login" className="text-slate-900 hover:bg-[#dcd7c4] px-6 py-4 transition-colors">Create Job Alerts</Link>
            <Link to="/register" className="text-slate-900 hover:bg-[#dcd7c4] px-6 py-4 transition-colors">Submit Resume</Link>
          </div>
        </div>

        <a href="/#insights" className="px-4 py-4 cursor-pointer hover:text-slate-700 transition-colors">
          Blogs
        </a>
        <Link to="/contact" className="px-4 py-4 cursor-pointer hover:text-slate-700 transition-colors">
          Contact
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="xl:hidden w-10 h-10 flex items-center justify-center text-slate-900 hover:bg-black/5 rounded-full transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden sm:flex items-center bg-[#121212] rounded-full px-6 py-3 gap-4">
          <Link to="/login" className="text-white font-bold text-sm hover:text-slate-300 transition-colors">
            Login
          </Link>
          <div className="w-px h-4 bg-white/30"></div>
          <Link to="/register" className="text-white font-bold text-sm hover:text-slate-300 transition-colors">
            Register
          </Link>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] xl:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#f4f4f0] z-[70] xl:hidden shadow-2xl flex flex-col p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="h-10">
                  <img src="/Logo.jpg" alt="Logo" className="h-full object-contain mix-blend-multiply brightness-90" />
                </Link>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-slate-900 shadow-sm border border-slate-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Search */}
              {setSearchQuery && (
                <div className="flex items-center bg-white rounded-2xl px-5 py-4 border border-slate-200 mb-10 shadow-sm focus-within:ring-2 focus-within:ring-[#cbd5b1]/50 transition-all">
                  <Search size={18} className="text-slate-400 mr-3" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (onSearchFocus) onSearchFocus();
                    }}
                    placeholder="Search roles..." 
                    className="bg-transparent border-none outline-none text-base font-bold text-slate-900 placeholder:text-slate-300 w-full"
                  />
                </div>
              )}

              <div className="flex flex-col gap-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#cbd5b1] mb-2">Navigation</p>
                <div className="flex flex-col gap-5 text-2xl font-serif font-black text-[#121212]">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#cbd5b1] transition-colors">Home</Link>
                  <a href="/#about-us" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#cbd5b1] transition-colors">About</a>
                  <a href="/#services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#cbd5b1] transition-colors">Services</a>
                  <a href="/#jobs" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#cbd5b1] transition-colors">Jobs</a>
                  <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#cbd5b1] transition-colors">Contact</Link>
                </div>
              </div>

              <div className="mt-auto pt-12 flex flex-col gap-4">
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-[#121212] text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center shadow-xl shadow-black/10"
                >
                  Login Member
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-white text-[#121212] border border-slate-200 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center hover:bg-slate-50 transition-colors"
                >
                  Create Account
                </Link>
                
                <p className="text-center text-slate-400 text-[9px] font-black uppercase tracking-widest mt-6">
                  © 2026 RECRUIT ART
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
