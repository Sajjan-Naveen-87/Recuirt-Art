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

        {/* Search Bar & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 md:gap-10 mb-12">
          <div className="bg-[#cbd5b1] p-1.5 md:p-3 rounded-[2rem] md:rounded-3xl flex items-center shadow-2xl border border-slate-100 max-w-3xl flex-1">
             <div className="p-2.5 md:p-4 bg-[#f4f4f0] rounded-xl md:rounded-2xl text-dark shadow-lg shrink-0"><Search size={18} /></div>
             <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for roles, skills, or locations..." 
                className="flex-1 px-3 md:px-8 outline-none text-sm md:text-xl font-serif font-black placeholder:text-dark/40 bg-transparent text-dark w-full" 
             />
          </div>
          
          {/* Category Radio Buttons */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 px-2">
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
                    onChange={(e) => {
                      setJobCategory(e.target.value);
                      if (e.target.value === 'all') setSearchQuery('');
                    }}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {jobs.map((job) => (
              <motion.div 
                key={job.id}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => { setSelectedJob(job); setShowDetails(true); }}
                className="relative aspect-[3/4] bg-[#1a1a1a] p-4 text-white rounded-[2.5rem] shadow-2xl flex flex-col group cursor-pointer overflow-hidden border-2 border-transparent hover:border-[#cbd5b1]/30 transition-all duration-500"
              >
                {/* Category Label at Top Left */}
                <div className="absolute top-4 left-4 z-10">
                   <span className="px-2 py-0.5 bg-white/10 backdrop-blur-md text-white/60 text-[7px] font-black uppercase tracking-widest rounded-full border border-white/10">
                      {job.category === 'clinician' ? 'Clinician' : 
                       job.category === 'non_clinician' ? 'Non-Clinician' : 'Other Jobs'}
                   </span>
                </div>

                {/* Center Initial Avatar */}
                <div className="flex-1 flex items-center justify-center">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 bg-gradient-to-br from-[#cbd5b1] to-[#a3b18a] rounded-full flex items-center justify-center text-[#121212] font-serif font-black text-3xl shadow-inner border-[6px] border-white/5"
                  >
                    {job.title?.[0] || 'J'}
                  </motion.div>
                </div>

                {/* Info at the Bottom (matching image style) */}
                <div className="pt-2">
                  <h3 className="text-sm font-serif font-black text-white leading-tight mb-1 truncate">
                    {job.title}
                  </h3>
                  
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 text-white/40">
                      <MapPin size={10} className="shrink-0" />
                      <span className="text-[8px] font-black uppercase tracking-widest truncate">{job.location}</span>
                    </div>
                    
                    <div className="text-[#cbd5b1] font-serif font-black text-[10px] tracking-tight">
                      {(() => {
                        const s = (job.salary_range || 'Negotiable').toString();
                        const cleanS = s.replace(/,/g, '');
                        return cleanS.replace(/([$₹])?\s?(\d+)/g, (match, symbol, num) => {
                          const n = parseInt(num);
                          const curSymbol = symbol === '$' ? '₹' : (symbol || '₹');
                          return n >= 1000 ? `${curSymbol}${Math.floor(n / 1000)}K` : `${curSymbol}${n}`;
                        }).replace(/\s?-\s?/g, ' - ');
                      })()}
                    </div>
                  </div>
                </div>

                {/* Subtle Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#cbd5b1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="w-full max-w-4xl mx-auto mt-20 pt-16 border-t border-slate-200 flex flex-col items-center gap-8 text-center">
            <div 
              id="submit-resume"
              onClick={() => { 
                const otherJobRecord = jobs.find(j => j.title === 'Other Jobs' || j.title === 'other');
                setSelectedJob(otherJobRecord || { id: 18, title: 'Other Jobs' }); 
                setShowApply(true); 
              }}
              className="group cursor-pointer flex flex-col items-center gap-3"
            >
              <p className="text-[#121212] text-md uppercase tracking-widest font-black">Can't find your Choice?.</p>
              <div className="bg-[#cbd5b1] border border-[#121212]/10 text-md px-10 py-4 rounded-full font-black uppercase tracking-[0.2em] hover:bg-[#121212] hover:text-white transition-all shadow-xl flex items-center gap-2.5">
                No Worries, Submit your resume for future fits.
              </div>
            </div>
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
