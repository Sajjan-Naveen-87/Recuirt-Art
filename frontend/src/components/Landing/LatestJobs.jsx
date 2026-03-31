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
    if (!salary || salary === "") return 'Negotiable';
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
    <section id="jobs" className="bg-[#121212] relative overflow-hidden scroll-mt-32">
      <div className="relative min-h-[800px] w-full flex flex-col lg:flex-row shadow-2xl">
        {/* Background Images Layer */}
        <div className="absolute inset-0 z-0 flex flex-col lg:flex-row">
          {/* Left/Top Half: Clinical Background */}
          <div className="flex-1 relative p-4 lg:p-0">
            <div className="w-full h-full relative overflow-hidden rounded-[2rem] lg:rounded-none">
              <img 
                src="/Clinician-Jobs.png" 
                alt="Clinical Opportunities" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Dark gradient overlay to make text readable */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80 lg:to-black/40" />
              
              {/* Very large subtle background text */}
              <div className="absolute inset-y-0 left-0 flex items-center pl-8 lg:pl-16 opacity-[0.03] pointer-events-none overflow-hidden">
                <span className="text-[10rem] lg:text-[15rem] font-serif font-black text-white whitespace-nowrap leading-none select-none">
                  CLINICAL
                </span>
              </div>
            </div>
          </div>

          {/* Right/Bottom Half: Non-Clinical Background */}
          <div className="flex-1 relative p-4 lg:p-0">
            <div className="w-full h-full relative overflow-hidden rounded-[2rem] lg:rounded-none">
              <img 
                src="/Non-Clinician-Jobs.png" 
                alt="Non-Clinical Opportunities" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Dark gradient overlay to make text readable */}
              <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/60 to-black/80 lg:to-black/40" />
              
              {/* Very large subtle background text */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-8 lg:pr-16 opacity-[0.03] pointer-events-none overflow-hidden">
                <span className="text-[10rem] lg:text-[15rem] font-serif font-black text-white whitespace-nowrap leading-none select-none">
                  NON CLINICAL
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 w-full h-full flex flex-col p-8 md:p-12 lg:p-20">
          
          <div className="text-center mb-16">
            <h4 className="text-[10px] md:text-sm font-black uppercase tracking-[0.6em] text-[#cbd5b1] mb-4">Career Opportunities</h4>
            <h2 className="text-5xl md:text-7xl font-serif font-black text-white tracking-tight drop-shadow-lg">
              Latest Jobs.
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-white flex-1 min-h-[400px]">
              <div className="w-16 h-16 border-4 border-[#cbd5b1]/20 border-t-[#cbd5b1] rounded-full animate-spin mb-6 shadow-lg"></div>
              <p className="font-serif italic text-xl drop-shadow-md">Discovering positions...</p>
            </div>
          ) : (
            <div className="flex-1 w-full max-w-[1550px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
              
              {/* Clinical Column */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/20">
                  <h3 className="text-[#cbd5b1] font-serif font-black text-4xl drop-shadow-md">Clinician Jobs</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3 gap-3 auto-rows-min max-h-[500px] md:max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
                  {jobs.filter(j => j.category === 'clinician').slice(0, 9).map((job) => (
                    <div 
                      key={job.id}
                      onClick={() => { setSelectedJob(job); setIsDetailsModalOpen(true); }}
                      className="relative aspect-[1.5/1] bg-white/5 backdrop-blur-md p-3 text-white rounded-[1.5rem] shadow-2xl flex flex-col group cursor-pointer overflow-hidden border border-white/10 hover:border-[#cbd5b1]/30 transition-all duration-500"
                    >
                      {/* Center Initial Avatar */}
                      <div className="flex-1 flex items-center justify-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#cbd5b1] to-[#a3b18a] rounded-full flex items-center justify-center text-[#121212] font-serif font-black text-xl border-2 border-white/5">
                          {job.title?.[0] || 'J'}
                        </div>
                      </div>

                      {/* Info at the Bottom */}
                      <div className="pt-1">
                        <h3 className="text-[10px] md:text-xs font-serif font-black text-white leading-tight mb-0.5 truncate">
                          {job.title}
                        </h3>
                        
                        <div className="flex flex-col">
                          <div className="text-[#cbd5b1] font-serif font-black text-[8px] tracking-tight">
                            {formatSalary(job.salary_range)}
                          </div>
                        </div>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#cbd5b1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Dotted Divider for large screens */}
              <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

              {/* Non-Clinical Column */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/20">
                  <h3 className="text-[#cbd5b1] font-serif font-black text-4xl drop-shadow-md">Non-Clinician Jobs</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3 gap-3 auto-rows-min max-h-[500px] md:max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
                  {jobs.filter(j => j.category !== 'clinician').slice(0, 9).map((job) => (
                    <div 
                      key={job.id}
                      onClick={() => { setSelectedJob(job); setIsDetailsModalOpen(true); }}
                      className="relative aspect-[1.5/1] bg-white/5 backdrop-blur-md p-3 text-white rounded-[1.5rem] shadow-2xl flex flex-col group cursor-pointer overflow-hidden border border-white/10 hover:border-[#cbd5b1]/30 transition-all duration-500"
                    >
                      {/* Center Initial Avatar */}
                      <div className="flex-1 flex items-center justify-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#cbd5b1] to-[#a3b18a] rounded-full flex items-center justify-center text-[#121212] font-serif font-black text-xl border-2 border-white/5">
                          {job.title?.[0] || 'J'}
                        </div>
                      </div>

                      {/* Info at the Bottom */}
                      <div className="pt-1">
                        <h3 className="text-[10px] md:text-xs font-serif font-black text-white leading-tight mb-0.5 truncate">
                          {job.title}
                        </h3>
                        
                        <div className="flex flex-col">
                          <div className="text-[#cbd5b1] font-serif font-black text-[8px] tracking-tight">
                            {formatSalary(job.salary_range)}
                          </div>
                        </div>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#cbd5b1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!loading && (
            <div className="w-full max-w-4xl mx-auto mt-20 pt-16 border-t border-white/10 flex flex-col items-center gap-12 text-center">
              
              <Link 
                to="/jobs" 
                className="bg-[#cbd5b1] text-[#121212] px-14 py-5 rounded-full font-black uppercase tracking-[0.2em] text-md hover:bg-white transition-all hover:scale-105 shadow-2xl shadow-black/50 flex items-center gap-3 shrink-0"
              >
                View More 
              </Link>
            </div>
          )}
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
