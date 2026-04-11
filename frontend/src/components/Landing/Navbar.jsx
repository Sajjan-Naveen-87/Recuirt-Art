import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronDown, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VisitorCounter from './VisitorCounter';
import { jobsService } from '../../services/jobs';
import { generateJobKeywords } from '../../utils/searchUtils';

function Navbar({ searchQuery, setSearchQuery, onSearchFocus }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Fetch jobs to build dynamic suggestions
    const fetchSuggestions = async () => {
      try {
        const data = await jobsService.getJobs({ page_size: 100 }); // Get a good sample for keywords
        const allJobs = data.results || data || [];
        const keywords = generateJobKeywords(allJobs);
        setSuggestions(keywords);
      } catch (err) {
        console.error("Failed to build suggestions:", err);
        // Fallback or empty is fine
      }
    };
    fetchSuggestions();
  }, []);

  return (
    <nav className="bg-[#0c0e14] px-4 md:px-8 flex items-center justify-between sticky top-0 z-50 shadow-md transition-all duration-300 h-16 md:h-20 lg:h-24">
      <div className="flex items-center gap-2 md:gap-3 flex-grow">
        <div className="flex items-center gap-1 md:gap-2 shrink-0">




          <Link 
            to="/" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-36 sm:w-48 md:w-56 lg:w-72 h-12 sm:h-16 md:h-20 lg:h-24 overflow-hidden flex-shrink-0 flex items-center hover:opacity-90 transition-opacity cursor-pointer"
          >
            <img src="/Logo.png" alt="Recruit Art Logo" className="w-full h-full object-contain object-left" />
          </Link>

          {/* Visitor Counter next to Logo on md+ screens */}
          <div className="flex flex-shrink-0 ml-1">
             <VisitorCounter compact={true} />
          </div>
        </div>


        {/* Search Bar - Visible on all screens, responsive width */}
        {setSearchQuery && (
          <div className="relative flex-grow max-w-[12rem] sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl ml-1 sm:ml-2">
            <div className="flex items-center bg-white/5 backdrop-blur-md rounded-full px-4 py-2 md:py-3 border border-white/10 focus-within:border-[#FFC107]/50 transition-all shadow-sm">




              <Search size={18} className="text-slate-400 mr-2 md:mr-3 flex-shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                  if (onSearchFocus) onSearchFocus();
                }}
                onFocus={() => {
                  setShowSuggestions(true);
                  if (onSearchFocus) onSearchFocus();
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search jobs..." 
                className="bg-transparent border-none outline-none text-xs md:text-base font-semibold text-white placeholder:text-slate-500 w-full"
              />
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && searchQuery && searchQuery.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1c23] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100]">
                {suggestions
                  .filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-6 py-3.5 hover:bg-[#FFC107] hover:text-[#0c0e14] text-white text-[13px] font-bold transition-all border-b border-white/5 last:border-0 group flex items-center justify-between"
                    >
                      <span>{suggestion}</span>
                      <Search size={12} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Desktop Links */}
      <div className="hidden xl:flex items-center gap-2 text-[#0c0e14] font-black text-[13px] px-4">



        <div className="group relative">
          <div className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-[#FFC107] border border-[#FFC107] cursor-pointer hover:scale-105 transition-all duration-300">
            About Us <ChevronDown size={14} strokeWidth={3} className="transition-transform group-hover:rotate-180" />
          </div>
          <div className="absolute top-[calc(100%+8px)] left-0 w-48 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 shadow-2xl border border-white/10 flex flex-col z-50 rounded-xl overflow-hidden bg-[#1a1c23]">
            <a href="/#about-us" className="text-white hover:bg-[#FFC107] hover:text-[#0c0e14] px-6 py-3.5 transition-colors text-sm">Our Story</a>
            <a href="/#portfolio" className="text-white hover:bg-[#FFC107] hover:text-[#0c0e14] px-6 py-3.5 transition-colors text-sm">Portfolio</a>
            <a href="/#team" className="text-white hover:bg-[#FFC107] hover:text-[#0c0e14] px-6 py-3.5 transition-colors text-sm">Our Team</a>
            <a href="/#testimonials" className="text-white hover:bg-[#FFC107] hover:text-[#0c0e14] px-6 py-3.5 transition-colors text-sm">Testimonials</a>
          </div>
        </div>

        <div className="group relative">
          <div className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-[#FFC107] border border-[#FFC107] cursor-pointer hover:scale-105 transition-all duration-300">
            Employers <ChevronDown size={14} strokeWidth={3} className="transition-transform group-hover:rotate-180" />
          </div>
          <div className="absolute top-[calc(100%+8px)] left-0 w-56 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 shadow-2xl bg-[#1a1c23] border border-white/10 flex flex-col z-50 rounded-xl overflow-hidden">
            <a href="/#services" className="text-white hover:bg-[#FFC107] hover:text-[#0c0e14] px-6 py-3.5 transition-colors text-sm">Services</a>
            <a href="/#contact" className="text-white hover:bg-[#FFC107] hover:text-[#0c0e14] px-6 py-3.5 transition-colors text-sm">Submit Requirements</a>
          </div>
        </div>

        <div className="group relative">
          <div className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-[#FFC107] border border-[#FFC107] cursor-pointer hover:scale-105 transition-all duration-300">
            Job Seekers <ChevronDown size={14} strokeWidth={3} className="transition-transform group-hover:rotate-180" />
          </div>
          <div className="absolute top-[calc(100%+8px)] left-0 w-48 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 shadow-2xl bg-[#1a1c23] border border-white/10 flex flex-col z-50 rounded-xl overflow-hidden">
            <a href="/#jobs" className="text-white hover:bg-[#FFC107] hover:text-[#0c0e14] px-6 py-3.5 transition-colors text-sm">View All Jobs</a>
            <a 
              href="/#submit-resume" 
              onClick={() => window.dispatchEvent(new CustomEvent('open-submit-resume-modal'))}
              className="text-white hover:bg-[#FFC107] hover:text-[#0c0e14] px-6 py-3.5 transition-colors text-sm"
            >
              Submit Resume
            </a>
          </div>
        </div>

        <a href="/#insights" className="flex items-center px-5 py-3 rounded-xl bg-[#FFC107] text-[#0c0e14] border border-[#FFC107] hover:scale-105 transition-all duration-300 text-[13px] whitespace-nowrap">
          News & Insights
        </a>
        <a href="/#footer" className="flex items-center px-5 py-3 rounded-xl bg-[#FFC107] text-[#0c0e14] border border-[#FFC107] hover:scale-105 transition-all duration-300 text-[13px] shrink-0">
          Contact
        </a>
      </div>

      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="xl:hidden w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
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
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#0c0e14] z-[70] xl:hidden shadow-2xl flex flex-col p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="h-10">
                  <img src="/Logo.png" alt="Logo" className="h-full object-contain brightness-110" />
                </Link>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white shadow-sm border border-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Search */}
              {setSearchQuery && (
                <div className="flex items-center bg-white/5 rounded-2xl px-5 py-4 border border-white/10 mb-10 shadow-sm focus-within:ring-2 focus-within:ring-[#FFC107]/50 transition-all">
                  <Search size={18} className="text-slate-500 mr-3" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (onSearchFocus) onSearchFocus();
                    }}
                    placeholder="Search roles..." 
                    className="bg-transparent border-none outline-none text-base font-bold text-white placeholder:text-slate-500 w-full"
                  />
                </div>
              )}

              <div className="flex flex-col gap-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFC107] mb-2">Navigation</p>
                <div className="flex flex-col gap-3 text-xl font-serif font-black text-[#0c0e14]">
                  <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMobileMenuOpen(false); }} className="px-6 py-4 rounded-xl bg-[#FFC107] border border-[#FFC107] hover:scale-105 transition-all text-left">Home</button>
                  <a href="/#about-us" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 rounded-xl bg-[#FFC107] border border-[#FFC107] hover:scale-105 transition-all">About</a>
                  <a href="/#services" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 rounded-xl bg-[#FFC107] border border-[#FFC107] hover:scale-105 transition-all">Services</a>
                  <a href="/#jobs" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 rounded-xl bg-[#FFC107] border border-[#FFC107] hover:scale-105 transition-all">Jobs</a>
                  <a href="/#portfolio" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 rounded-xl bg-[#FFC107] border border-[#FFC107] hover:scale-105 transition-all">Portfolio</a>
                  <a href="/#testimonials" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 rounded-xl bg-[#FFC107] border border-[#FFC107] hover:scale-105 transition-all">Testimonials</a>
                  <a href="/#insights" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 rounded-xl bg-[#FFC107] border border-[#FFC107] hover:scale-105 transition-all">News & Insights</a>
                  <a href="/#submit-resume" 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      window.dispatchEvent(new CustomEvent('open-submit-resume-modal'));
                    }} 
                    className="px-6 py-4 rounded-xl bg-[#FFC107] border border-[#FFC107] hover:scale-105 transition-all text-center"
                  >
                    Submit Resume
                   </a>
                  <a href="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 rounded-xl bg-[#FFC107] text-[#0c0e14] border border-[#FFC107] hover:scale-105 transition-all text-center">Contact</a>
                </div>
              </div>

              <div className="mt-auto pt-12 flex flex-col gap-4">
                <p className="text-center text-slate-500 text-[9px] font-black uppercase tracking-widest mt-6">
                  © 2026 RECRUIT ART - Hiring Experts
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
