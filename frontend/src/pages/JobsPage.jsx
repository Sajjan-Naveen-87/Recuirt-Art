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
  const [jobCategory, setJobCategory] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showApply, setShowApply] = useState(false);

  useEffect(() => {
    fetchJobs();
    window.scrollTo(0, 0);
  }, [searchQuery, jobCategory]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = { 
        search: searchQuery || '' 
      };

      if (jobCategory && jobCategory !== 'all') {
        params.category = jobCategory;
      }

      const data = await jobsService.getJobs(params);
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
      <Navbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        jobCategory={jobCategory}
        setJobCategory={setJobCategory}
      />

      <main className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#121212] mb-12 transition-colors font-bold uppercase tracking-widest text-[10px]">
          <ChevronLeft size={16} /> Back to home
        </Link>

        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-serif font-black text-[#121212] mb-6 tracking-tight">
            Available <span className="text-[#cbd5b1]">Jobs </span> With Us.
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl">
            Discover a wide range of clinician and non-clinician jobs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center gap-8 mb-12">
          <div className="bg-[#cbd5b1] p-2 md:p-3 rounded-2xl md:rounded-3xl flex items-center shadow-2xl border border-slate-100 max-w-2xl flex-1">
             <div className="p-3 md:p-4 bg-[#f4f4f0] rounded-xl md:rounded-2xl text-dark shadow-lg"><Search size={18} /></div>
             <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for roles, skills, or locations..." 
                className="flex-1 px-4 md:px-8 outline-none text-base md:text-xl font-serif font-black placeholder:text-dark bg-transparent text-dark" 
             />
          </div>

          {/* Category Radio Buttons */}
          <div className="flex items-center gap-6 px-2">
            {[
              { label: 'All Jobs', value: 'all' },
              { label: 'Clinical', value: 'clinician' },
              { label: 'Non Clinical', value: 'non_clinician' }
            ].map((cat) => (
              <label 
                key={cat.value} 
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative flex items-center justify-center">
                  <input 
                    type="radio" 
                    name="jobCategory" 
                    value={cat.value}
                    checked={jobCategory === cat.value}
                    onChange={(e) => setJobCategory(e.target.value)}
                    className="appearance-none w-5 h-5 border-2 border-[#121212]/30 rounded-full checked:border-indigo-600 transition-all cursor-pointer"
                  />
                  {jobCategory === cat.value && (
                    <div className="absolute w-2.5 h-2.5 bg-indigo-600 rounded-full" />
                  )}
                </div>
                <span className={`text-[13px] font-black uppercase tracking-wider transition-colors ${jobCategory === cat.value ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-900'}`}>
                  {cat.label}
                </span>
              </label>
            ))}
          </div>
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
                onClick={() => { setSelectedJob(job); setShowDetails(true); }}
                className="bg-[#cbd5b1] p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-[#f4f4f0] rounded-2xl flex items-center justify-center text-[#121212] font-serif font-black text-xl">
                    {job.company_name?.[0] || 'R'}
                  </div>
                  <span className="px-3 py-1 bg-[#cbd5b1]/20 text-[#121212] text-[9px] font-black uppercase tracking-widest rounded-full border border-[#cbd5b1]/30">
                    {job.category === 'clinician' ? 'Clinician' : 'Non-Clinician'}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-black text-[#121212] mb-3 leading-tight group-hover:text-white transition-colors">
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
                        {(() => {
                          const s = (job.salary_range || 'Negotiable').toString();
                          const cleanS = s.replace(/,/g, '');
                          return cleanS.replace(/([$₹])?\s?(\d+)/g, (match, symbol, num) => {
                            const n = parseInt(num);
                            const curSymbol = symbol === '$' ? '₹' : (symbol || '₹');
                            return n >= 1000 ? `${curSymbol}${Math.floor(n / 1000)}K` : `${curSymbol}${n}`;
                          }).replace(/\s?-\s?/g, ' - ');
                        })()}
                      </p>
                  </div>
                  
                  <button 
                    onClick={() => { setSelectedJob(job); setShowDetails(true); }}
                    className="w-full py-4 bg-[#121212] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-[#121212] transition-all"
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
