import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsService } from '../../services/jobs';
import { MapPin, Clock, Briefcase, ChevronRight, ChevronLeft, Search } from 'lucide-react';

function LatestJobs({ searchQuery }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    // Reset to page 1 when search query changes
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Fetch jobs based on search query and pagination
        const response = await jobsService.getJobs({ 
          page: currentPage,
          page_size: pageSize,
          search: searchQuery || '' 
        });
        
        // Handle paginated response
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
        console.error("Error fetching jobs for landing page:", error);
        setJobs([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [searchQuery, currentPage]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const truncateTitle = (title) => {
    const maxLength = 40; // Align with JobCard.jsx
    if (title?.length > maxLength) {
      return title.substring(0, maxLength) + '..';
    }
    return title || '';
  };

  return (
    <section id="jobs" className="py-20 md:py-40 bg-[#121212] relative overflow-hidden">
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-[95rem] mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16 md:mb-24 space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#cbd5b1]">Career Opportunities</h4>
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-serif font-black text-white tracking-tight leading-none">
            Latest <span className="text-[#cbd5b1]">Jobs.</span>
          </h2>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-4 lg:gap-3">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-white">
                <div className="w-16 h-16 border-4 border-[#cbd5b1]/20 border-t-[#cbd5b1] rounded-full animate-spin mb-6"></div>
                <p className="font-serif italic text-xl text-slate-400">Discovering positions...</p>
              </div>
            ) : jobs.length > 0 ? (
              <>
                {jobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="bg-[#cbd5b1] rounded-b-[6rem] md:rounded-b-[10rem] rounded-t-3xl p-8 flex flex-col min-h-[450px] md:h-[500px] hover:-translate-y-2 transition-transform duration-300 shadow-xl group border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-6">
                      {job.is_new ? (
                        <div className="bg-[#121212] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                          New
                        </div>
                      ) : <div />}
                      <div className="w-8 h-8 rounded-full bg-[#121212]/5 flex items-center justify-center text-slate-900 group-hover:bg-[#121212] group-hover:text-white transition-colors">
                        <Briefcase size={14} />
                      </div>
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-6 leading-tight h-24 line-clamp-3">
                      {truncateTitle(job.title)}
                    </h3>
                    
                    <div className="flex items-center gap-3 text-slate-800 font-bold text-xs uppercase tracking-wider mb-6">
                      <span className="bg-[#121212]/5 px-3 py-1 rounded-lg truncate">{job.category?.replace('_', ' ') || 'General'}</span>
                    </div>
                    
                    <div className="h-px w-full bg-[#121212]/10 mb-6" />
                    
                    <div className="space-y-4 mb-auto text-slate-700">
                      <div className="flex items-center gap-3">
                        <MapPin size={14} className="text-[#121212]/40" />
                        <span className="text-sm font-medium truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock size={14} className="text-[#121212]/40" />
                        <span className="text-sm font-medium">{job.job_type}</span>
                      </div>
                    </div>

                    <div className="text-center mt-8 pb-10">
                      <Link to="/login" className="font-black text-slate-900 font-serif text-xl border-b-2 border-slate-900 pb-1 hover:text-slate-600 hover:border-slate-600 transition-all">
                        Learn More
                      </Link>
                    </div>
                  </div>
                ))}
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="col-span-full flex justify-center items-center gap-8 mt-16 md:mt-24">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest transition-all ${
                        currentPage === 1 
                          ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                          : 'bg-[#cbd5b1] text-[#121212] hover:bg-white shadow-lg'
                      }`}
                    >
                      <ChevronLeft size={18} /> Prev
                    </button>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-[#cbd5b1] font-serif italic text-2xl">{currentPage}</span>
                      <span className="text-white/20 font-serif text-2xl">/</span>
                      <span className="text-white/40 font-serif text-2xl">{totalPages}</span>
                    </div>

                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest transition-all ${
                        currentPage === totalPages 
                          ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                          : 'bg-[#cbd5b1] text-[#121212] hover:bg-white shadow-lg'
                      }`}
                    >
                      Next <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="col-span-full py-24 text-center bg-white/5 rounded-[4rem] border border-white/10 shadow-2xl">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search size={32} className="text-[#cbd5b1] opacity-40" />
                </div>
                <h3 className="text-3xl font-serif font-black text-white mb-4">No opportunities found</h3>
                <p className="text-slate-400 max-w-md mx-auto font-medium">We couldn't find any matches for your current search criteria. Try broadening your keywords.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LatestJobs;
