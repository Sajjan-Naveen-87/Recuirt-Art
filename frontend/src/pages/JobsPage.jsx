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
      const allJobs = data.results || data || [];
      
      // Filter out expired vacancies
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const activeJobs = allJobs.filter(job => {
        // Must be active and deadline must not have passed
        const isActive = job.is_active !== false;
        if (!isActive) return false;
        
        if (!job.apply_deadline) return true;
        const deadline = new Date(job.apply_deadline);
        deadline.setHours(23, 59, 59, 999);
        return deadline >= today;
      });

      setJobs(activeJobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const truncate = (str, len) => str?.length > len ? str.substring(0, len) + "..." : str;

  return (
    <div className="min-h-screen bg-[#0c0e14] font-sans">
      <Navbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        jobCategory={jobCategory}
        setJobCategory={setJobCategory}
      />

      <main className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white mb-12 transition-colors font-bold uppercase tracking-widest text-[10px]">
          <ChevronLeft size={16} /> Back to home
        </Link>

        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-serif font-black text-white mb-6 tracking-tight">
            Available <span className="text-[#FFC107]">Jobs </span> With Us.
          </h1>
          <p className="text-white/50 text-lg md:text-xl font-medium max-w-2xl italic">
            Discover a wide range of clinician and non-clinician roles within elite healthcare institutions.
          </p>
        </div>

        {/* Search Bar & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 md:gap-10 mb-12">
          <div className="bg-[#FFC107] p-1.5 md:p-3 rounded-[2rem] md:rounded-3xl flex items-center shadow-2xl border border-white/5 max-w-3xl flex-1">
             <div className="p-2.5 md:p-4 bg-[#0c0e14] rounded-xl md:rounded-2xl text-white shadow-lg shrink-0"><Search size={18} /></div>
             <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for roles, skills, or locations..." 
                className="flex-1 px-3 md:px-8 outline-none text-sm md:text-xl font-serif font-black placeholder:text-[#0c0e14]/40 bg-transparent text-[#0c0e14] w-full" 
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
                    className={`appearance-none w-5 h-5 border-2 ${jobCategory === cat.value ? 'border-[#FFC107]' : 'border-white/10'} rounded-full transition-all cursor-pointer`}
                  />
                  {jobCategory === cat.value && (
                    <div className="absolute w-2.5 h-2.5 bg-[#FFC107] rounded-full" />
                  )}
                </div>
                <span className={`text-[13px] font-black uppercase tracking-wider transition-colors ${jobCategory === cat.value ? 'text-white' : 'text-white/20 group-hover:text-white/50'}`}>
                  {cat.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center">
             <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-12 w-12 border-4 border-[#FFC107] border-t-transparent rounded-full mx-auto" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-[#0c0e14] p-16 md:p-24 rounded-[3rem] text-center border border-white/5 shadow-xl">
             <Search size={48} className="mx-auto mb-6 text-white/5" />
             <p className="text-white/20 font-serif text-2xl italic">No positions matching your search were found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-6 pb-20">
            {jobs.map((job) => (
              <motion.div 
                key={job.id}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => { setSelectedJob(job); setShowDetails(true); }}
                className="relative z-10 aspect-[1.5/1] bg-white/90 backdrop-blur-xl p-4 text-[#0c0e14] rounded-[1.5rem] shadow-2xl flex flex-col items-center text-center group cursor-pointer overflow-hidden border border-[#0c0e14]/5 hover:border-[#FFC107]/50 transition-all duration-100 hover:z-50"
              >
                {/* Category Label at Top */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 w-full px-4">
                   <span className="px-2.5 py-0.5 bg-[#0c0e14]/5 text-[#0c0e14]/60 text-[6px] font-black uppercase tracking-[0.3em] rounded-full border border-[#0c0e14]/10 block w-fit mx-auto group-hover:transition-colors duration-100">
                      {job.category === 'clinician' ? 'Clinical' : 
                       job.category === 'non_clinician' ? 'Non-Clinical' : 'Specialized'}
                   </span>
                </div>
                {/* Main Info Centered */}
                <div className="flex-1 flex flex-col items-center justify-between relative z-10 w-full mt-7 pb-1 group-hover:translate-y-[-2px] transition-transform duration-100">
                  <div className="flex flex-col items-center gap-1">
                    <h3 className="text-[12px] md:text-[13px] font-serif font-black text-[#0c0e14] leading-[1.1] group-hover:transition-colors duration-100">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-1 text-[#0c0e14]/40">
                      <MapPin size={8} className="shrink-0 text-[#FFC107]/60" />
                      <span className="text-[7px] font-black uppercase tracking-[0.1em]">{job.location}</span>
                    </div>
                  </div>
                  
                  <div className="text-[#0c0e14] bg-[#FFC107] font-serif font-black text-[8px] px-3 py-0.5 rounded-full tracking-tight shadow-md border border-[#FFC107]/20 group-hover:opacity-0 transition-all duration-100">
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

                {/* Apply Now Hover Action */}
                <div className="absolute inset-x-0 bottom-3 flex justify-center z-30 opacity-0 group-hover:opacity-100 group-hover:translate-y-[-4px] transition-all duration-100 pointer-events-none group-hover:pointer-events-auto">
                   <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedJob(job); setShowApply(true); }}
                    className="bg-[#0c0e14] text-white px-6 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-2xl border border-white/10 hover:bg-[#FFC107] hover:text-[#0c0e14] transition-all active:scale-95"
                   >
                     Apply Now
                   </button>
                </div>

                {/* Subtle Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFC107]/5 to-[#FFC107]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="w-full max-w-4xl mx-auto mt-20 pt-16 border-t border-white/5 flex flex-col items-center gap-8 text-center">
            <div 
              id="submit-resume"
              onClick={() => { 
                const otherJobRecord = jobs.find(j => j.title === 'Other Jobs' || j.title === 'other');
                setSelectedJob(otherJobRecord || { id: 18, title: 'Other Jobs' }); 
                setShowApply(true); 
              }}
              className="group cursor-pointer flex flex-col items-center gap-3"
            >
              <p className="text-white/90 text-md uppercase tracking-widest font-black">Can't find your specialization?</p>
              <div className="bg-[#FFC107] border border-white/10 text-md px-10 py-5 rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all text-[#0c0e14]">
                Submit Resume for Future Opportunities
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
