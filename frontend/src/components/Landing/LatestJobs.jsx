import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsService } from '../../services/jobs';
import { MapPin, Clock, Briefcase, ChevronRight, ChevronLeft, Search } from 'lucide-react';
import JobApplyModal from '../Job/JobApplyModal';
import JobDetailsModal from '../Job/JobDetailsModal';

function LatestJobs({ searchQuery }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const pageSize = 20; // Increase page size to get enough for both columns

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

  useEffect(() => {
    const openOtherJobsModal = () => {
      const otherJobRecord = jobs.find(j => 
        j.title?.toLowerCase() === 'other jobs' || 
        j.title?.toLowerCase() === 'other'
      ) || { id: 18, title: 'Other Jobs' };
      setSelectedJob(otherJobRecord);
      setIsApplyModalOpen(true);
    };

    const handleHash = () => {
      if (window.location.hash === '#submit-resume') {
        openOtherJobsModal();
      }
    };

    // Handle initial load and hash changes
    if (!loading && jobs.length >= 0) {
      handleHash();
    }

    window.addEventListener('hashchange', handleHash);
    window.addEventListener('open-submit-resume-modal', openOtherJobsModal);
    
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('open-submit-resume-modal', openOtherJobsModal);
    };
  }, [loading, jobs]);

  const truncateTitle = (title) => {
    return title || '';
  };

  const formatSalary = (salary) => {
    if (!salary) return '';
    let s = salary.toString();
    
    // Replace numbers with K format (e.g. 12,00,000 -> 1200K)
    // First remove commas for consistent parsing
    const cleanS = s.replace(/,/g, '');
    
    // Find numbers and convert to K if >= 1000
    // This regex looks for digits possibly with $ or ₹
    return cleanS.replace(/([$₹])?\s?(\d+)/g, (match, symbol, num) => {
      const n = parseInt(num);
      const curSymbol = symbol === '$' ? '₹' : (symbol || '₹');
      if (n >= 1000) {
        return `${curSymbol}${Math.floor(n / 1000)}K`;
      }
      return `${curSymbol}${n}`;
    }).replace(/\s?-\s?/g, ' - '); // Standardize range spacing
  };

  return (
    <section id="jobs" className="py-20 md:py-40 bg-[#121212] relative overflow-hidden scroll-mt-32">
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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-white">
              <div className="w-16 h-16 border-4 border-[#cbd5b1]/20 border-t-[#cbd5b1] rounded-full animate-spin mb-6"></div>
              <p className="font-serif italic text-xl text-slate-400">Discovering positions...</p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-12 md:gap-0 relative">
              {/* Vertical Divider */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />

              {/* Clinical Jobs Column */}
              <div className="flex-1 md:pr-12 relative rounded-[2.5rem] overflow-hidden p-4 md:p-8">
                {/* Column Background */}
                <div className="absolute inset-0 z-0 scale-105">
                  <img 
                    src="/Clinician-Jobs.png" 
                    alt="Clinical Background" 
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#121212] via-[#121212]/40 to-[#121212]" />
                </div>

                <div className="relative z-10">
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-8 text-center text-white font-serif text-xl md:text-2xl shadow-xl">
                    Clinical jobs
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {jobs.filter(j => j.category === 'clinician').slice(0, 6).map((job) => (
                      <div 
                        key={job.id}
                        onClick={() => { setSelectedJob(job); setIsDetailsModalOpen(true); }}
                        className="relative h-64 rounded-3xl overflow-hidden cursor-pointer group border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-500"
                      >
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                        
                        <div className="absolute inset-0 p-6 flex flex-col justify-center items-center text-center">
                          <h3 className="text-xl md:text-2xl font-serif font-black text-white mb-2 leading-tight group-hover:scale-105 transition-transform duration-500 line-clamp-2">
                            {job.title}
                          </h3>
                          {job.salary_range && (
                            <p className="text-[#cbd5b1] font-black tracking-widest text-sm uppercase">
                              {formatSalary(job.salary_range)}
                            </p>
                          )}
                        </div>

                        {/* Hover Apply Button */}
                        <div className="absolute inset-x-0 bottom-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setSelectedJob(job); 
                              setIsApplyModalOpen(true); 
                            }}
                            className="bg-[#cbd5b1] text-[#121212] px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-2xl"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Non Clinical Jobs Column */}
              <div className="flex-1 md:pl-12 relative rounded-[2.5rem] overflow-hidden p-4 md:p-8">
                {/* Column Background */}
                <div className="absolute inset-0 z-0 scale-105">
                  <img 
                    src="/Non-Clinician-Jobs.png" 
                    alt="Non Clinical Background" 
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#121212] via-[#121212]/40 to-[#121212]" />
                </div>

                <div className="relative z-10">
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-8 text-center text-white font-serif text-xl md:text-2xl shadow-xl">
                    Non Clinical jobs
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {jobs.filter(j => j.category === 'non_clinician').slice(0, 6).map((job) => (
                      <div 
                        key={job.id}
                        onClick={() => { setSelectedJob(job); setIsDetailsModalOpen(true); }}
                        className="relative h-64 rounded-3xl overflow-hidden cursor-pointer group border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-500"
                      >
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                        
                        <div className="absolute inset-0 p-6 flex flex-col justify-center items-center text-center">
                          <h3 className="text-xl md:text-2xl font-serif font-black text-white mb-2 leading-tight group-hover:scale-105 transition-transform duration-500 line-clamp-2">
                            {job.title}
                          </h3>
                          {job.salary_range && (
                            <p className="text-[#cbd5b1] font-black tracking-widest text-sm uppercase">
                              {formatSalary(job.salary_range)}
                            </p>
                          )}
                        </div>

                        {/* Hover Apply Button */}
                        <div className="absolute inset-x-0 bottom-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setSelectedJob(job); 
                              setIsApplyModalOpen(true); 
                            }}
                            className="bg-[#cbd5b1] text-[#121212] px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-2xl"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Jobs Banner */}
          {!loading && (
            <div id="submit-resume" className="mt-12 scroll-mt-32">
              <div 
                onClick={() => { 
                  const otherJobRecord = jobs.find(j => j.title === 'Other Jobs');
                  setSelectedJob(otherJobRecord || { id: 18, title: 'Other Jobs' }); 
                  setIsApplyModalOpen(true); 
                }}
                className="relative h-auto md:h-32 rounded-3xl overflow-hidden cursor-pointer group border border-[#cbd5b1]/20 bg-white/5 hover:bg-white/10 transition-all p-8 md:p-0"
              >
                <div className="flex flex-col md:flex-row items-center justify-between md:px-12 h-full gap-6 md:gap-0">
                  <div className="space-y-1 text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-serif font-black text-white">Can't find your role?</h3>
                    <p className="text-[#cbd5b1] font-medium italic">Apply for other opportunities and let us find the right fit for you.</p>
                  </div>
                  <button 
                    className="bg-[#cbd5b1] text-[#121212] px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-2xl shrink-0"
                  >
                    Request Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* View All Jobs Button */}
        <div className="mt-20 md:mt-32 text-center">
          <Link 
            to="/jobs" 
            className="inline-flex items-center gap-4 bg-[#cbd5b1] text-[#121212] px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] transform hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/40"
          >
            View All Jobs <Search size={20} />
          </Link>
        </div>
      </div>
      
      {/* Anonymous Apply Modal */}
      {selectedJob && (
         <JobApplyModal 
           job={selectedJob} 
           isOpen={isApplyModalOpen} 
           onClose={() => { setIsApplyModalOpen(false); }} 
           onSuccess={() => { setIsApplyModalOpen(false); }}
         />
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onApply={() => {
            setIsDetailsModalOpen(false);
            setIsApplyModalOpen(true);
          }}
        />
      )}
    </section>
  );
}

export default LatestJobs;
