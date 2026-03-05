import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, IndianRupee, Clock, ArrowRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jobsService } from '../services/jobs';
import Navbar from '../components/Landing/Navbar';
import Footer from '../components/Landing/Footer';
import JobDetailsModal from '../components/Job/JobDetailsModal';
import JobApplyModal from '../components/Job/JobApplyModal';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showApply, setShowApply] = useState(false);

  useEffect(() => {
    fetchJobs();
    window.scrollTo(0, 0);
  }, [searchQuery]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobsService.getJobs({ search: searchQuery });
      setJobs(data.results || data || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const truncate = (str, len) => str?.length > len ? str.substring(0, len) + "..." : str;

  return (
    <div className="min-h-screen bg-[#f4f4f0] font-sans">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#121212] mb-12 transition-colors font-bold uppercase tracking-widest text-[10px]">
          <ChevronLeft size={16} /> Back to Home
        </Link>

        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-serif font-black text-[#121212] mb-6 tracking-tight">
            Explore <span className="text-[#cbd5b1]">Opportunities.</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl">
            Discover a wide range of clinical and non-clinical roles tailored to your expertise.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-2 md:p-3 rounded-2xl md:rounded-3xl mb-12 flex items-center shadow-2xl border border-slate-100 max-w-2xl">
           <div className="p-3 md:p-4 bg-[#121212] rounded-xl md:rounded-2xl text-[#cbd5b1] shadow-lg"><Search size={18} md:size={22} /></div>
           <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for roles, skills, or locations..." 
              className="flex-1 px-4 md:px-8 outline-none text-base md:text-xl font-serif font-black placeholder:text-slate-300 bg-transparent text-[#121212]" 
           />
        </div>

        {loading ? (
          <div className="py-24 text-center">
             <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-12 w-12 border-4 border-[#cbd5b1] border-t-transparent rounded-full mx-auto" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-16 md:p-24 rounded-[3rem] text-center border border-slate-200">
             <Search size={48} className="mx-auto mb-6 text-slate-200" />
             <p className="text-slate-400 font-serif text-2xl italic">No positions matching your search were found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <motion.div 
                key={job.id}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-[#f4f4f0] rounded-2xl flex items-center justify-center text-[#121212] font-serif font-black text-xl">
                    {job.company_name?.[0] || 'R'}
                  </div>
                  <span className="px-3 py-1 bg-[#cbd5b1]/20 text-[#121212] text-[9px] font-black uppercase tracking-widest rounded-full border border-[#cbd5b1]/30">
                    {job.category === 'clinician' ? 'Clinical' : 'Non-Clinical'}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-black text-[#121212] mb-3 leading-tight group-hover:text-[#cbd5b1] transition-colors">
                  {job.title}
                </h3>
                
                <p className="text-slate-500 text-sm mb-6 line-clamp-2 font-medium">
                  {truncate(job.description, 100)}
                </p>

                <div className="mt-auto pt-6 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-slate-400">
                        <MapPin size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{job.location}</span>
                     </div>
                     <p className="text-[#121212] font-black text-sm">
                        {job.salary_range || 'Negotiable'}
                     </p>
                  </div>
                  
                  <button 
                    onClick={() => { setSelectedJob(job); setShowDetails(true); }}
                    className="w-full py-4 bg-[#121212] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#cbd5b1] hover:text-[#121212] transition-all"
                  >
                    View Details <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {selectedJob && (
        <>
          <JobDetailsModal 
            isOpen={showDetails} 
            job={selectedJob} 
            onClose={() => setShowDetails(false)} 
            onApply={() => { setShowDetails(false); setShowApply(true); }}
          />
          <JobApplyModal 
            isOpen={showApply} 
            job={selectedJob} 
            onClose={() => setShowApply(false)} 
          />
        </>
      )}
    </div>
  );
};

export default JobsPage;
