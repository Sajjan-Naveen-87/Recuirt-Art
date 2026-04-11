import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Building2, Clock, Briefcase, IndianRupee, CheckCircle, Loader2, ExternalLink, ArrowRight } from 'lucide-react';
import JobApplyModal from './JobApplyModal';

const JobDetailsModal = ({ job, isOpen, onClose, onApply }) => {
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Handle both real API data and demo data
  const [jobDetail, setJobDetail] = useState(null);
  
  useEffect(() => {
    if (job?.id) {
        // Fetch full details
        import('../../services/jobs').then(module => {
            module.jobsService.getJob(job.id).then(data => {
                setJobDetail(data);
            }).catch(err => console.error("Failed to fetch job details", err));
        });
    }
  }, [job]);

  const sourceData = jobDetail || job;

  const jobData = {
    id: sourceData?.id || 0,
    title: sourceData?.title || 'Unknown Position',
    company_name: sourceData?.company_name || sourceData?.company || 'Unknown Company',
    location: sourceData?.location || 'Remote',
    job_type: sourceData?.job_type || 'full_time',
    description: sourceData?.description || 'No description available.',
    skills_required: sourceData?.skills_required || sourceData?.skills_list || [],
    salary_range: sourceData?.salary_range || sourceData?.salary || 'Negotiable',
    experience_required: sourceData?.experience_required || '',
    apply_deadline: sourceData?.apply_deadline || null,
    is_active: sourceData?.is_active !== undefined ? sourceData.is_active : true,
    created_at: sourceData?.created_at || null,
  };

  const formatJobType = (type) => {
    const types = {
      'full_time': 'Full-time',
      'part_time': 'Part-time',
      'internship': 'Internship',
      'contract': 'Contract',
    };
    return types[type] || type || 'Full-time';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getSkillsList = () => {
    if (Array.isArray(jobData.skills_required)) {
      return jobData.skills_required;
    }
    if (typeof jobData.skills_required === 'string') {
      return jobData.skills_required.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  const handleApplyClick = () => {
    setShowApplyModal(true);
  };

  const handleApplySuccess = () => {
    setShowApplyModal(false);
    onClose();
  };

  if (!job) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[92vh] bg-[#fdfdfd] md:rounded-[2.5rem] shadow-2xl overflow-hidden z-50 flex flex-col border border-[#0c0e14]/5"
            >
              {/* Header */}
              <div className="px-6 py-5 md:px-12 md:py-10 border-b border-[#0c0e14]/5 flex items-center justify-between flex-shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-20">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1.5 md:mb-3">
                    <span className="px-2 py-0.5 bg-[#FFC107]/10 text-[#FFC107] text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-[#FFC107]/20">
                      {jobData.job_type === 'full_time' ? 'Full Time' : formatJobType(jobData.job_type)}
                    </span>
                    {jobData.is_active && (
                       <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse md:hidden" />
                    )}
                  </div>
                  <h2 className="text-lg md:text-2xl lg:text-3xl font-serif font-black text-[#0c0e14] leading-tight tracking-tight">
                    {jobData.title}
                  </h2>
                  <p className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-widest mt-1 truncate">
                    {jobData.company_name}
                  </p>
                </div>

                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                  {/* Desktop Only Apply Button in Header */}
                  {jobData.is_active && (
                    <button
                      onClick={handleApplyClick}
                      className="hidden md:flex px-8 py-3.5 bg-[#0c0e14] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-[#0c0e14]/90 transition-all items-center justify-center gap-3 group"
                    >
                      Apply Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-[#0c0e14] hover:shadow-lg transition-all border border-slate-100 shadow-sm"
                  >
                    <X size={20} md:size={24} />
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto px-6 py-8 md:px-16 md:py-14 bg-slate-50/30">
                {/* Meta Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10 md:mb-16">
                  <div className="flex flex-col gap-1.5 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 group hover:border-[#FFC107]/30 transition-colors">
                    <div className="flex items-center gap-2 text-[#FFC107]">
                       <MapPin size={14} md:size={16} />
                       <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-400">Location</span>
                    </div>
                    <span className="text-[11px] md:text-[13px] font-black text-[#0c0e14] truncate">{jobData.location}</span>
                  </div>

                  <div className="flex flex-col gap-1.5 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 group hover:border-[#FFC107]/30 transition-colors">
                    <div className="flex items-center gap-2 text-[#FFC107]">
                       <Briefcase size={14} md:size={16} />
                       <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-400">Category</span>
                    </div>
                    <span className="text-[11px] md:text-[13px] font-black text-[#0c0e14] truncate">{formatJobType(jobData.job_type)}</span>
                  </div>

                  <div className="flex flex-col gap-1.5 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 group hover:border-[#FFC107]/30 transition-colors">
                    <div className="flex items-center gap-2 text-[#FFC107]">
                       <IndianRupee size={14} md:size={16} />
                       <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-400">Salary</span>
                    </div>
                    <span className="text-[11px] md:text-[13px] font-black text-[#0c0e14]">
                      {(() => {
                        const s = (jobData.salary_range || 'Negotiable').toString();
                        const cleanS = s.replace(/,/g, '');
                        return cleanS.replace(/([$₹])?\s?(\d+)/g, (match, symbol, num) => {
                          const n = parseInt(num);
                          const curSymbol = symbol === '$' ? '₹' : (symbol || '₹');
                          return n >= 1000 ? `${curSymbol}${Math.floor(n / 1000)}K` : `${curSymbol}${n}`;
                        }).replace(/\s?-\s?/g, ' - ');
                      })()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 group hover:border-[#FFC107]/30 transition-colors">
                    <div className="flex items-center gap-2 text-[#FFC107]">
                       <Clock size={14} md:size={16} />
                       <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-400">Deadline</span>
                    </div>
                    <span className="text-[11px] md:text-[13px] font-black text-[#0c0e14] truncate">{jobData.apply_deadline ? formatDate(jobData.apply_deadline) : 'No deadline'}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-12 md:mb-20">
                  <div className="flex items-center gap-4 mb-6 md:mb-10">
                    <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Job Description</h3>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-sm md:text-lg text-[#0c0e14]/80 leading-relaxed whitespace-pre-wrap font-medium">
                      {jobData.description}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                {getSkillsList().length > 0 && (
                  <div className="mb-12 md:mb-20">
                    <div className="flex items-center gap-4 mb-6 md:mb-10">
                      <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Required Skills</h3>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>
                    <div className="flex flex-wrap gap-2.5 md:gap-3.5">
                      {getSkillsList().map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 md:px-7 md:py-3.5 bg-white text-[#0c0e14] rounded-xl text-[10px] md:text-[12px] font-black uppercase tracking-widest border border-slate-200 shadow-sm hover:border-[#FFC107]/40 transition-all hover:scale-105"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {jobData.experience_required && (
                  <div className="pb-10 md:pb-0">
                    <div className="flex items-center gap-4 mb-5 md:mb-6">
                      <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Preferred Experience</h3>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>
                    <p className="text-sm md:text-lg text-[#0c0e14]/70 italic font-medium px-4 border-l-4 border-[#FFC107]">{jobData.experience_required}</p>
                  </div>
                )}
              </div>

              {/* Custom Sticky Bottom Action Bar for Mobile */}
              {jobData.is_active && (
                <div className="md:hidden sticky bottom-0 left-0 right-0 p-5 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                  <button
                    onClick={handleApplyClick}
                    className="w-full py-4.5 bg-[#0c0e14] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                  >
                    Apply for this position <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {/* Footer Desktop */}
              <div className="hidden md:flex p-10 border-t border-[#0c0e14]/5 justify-center bg-white/60">
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#0c0e14]/30 tracking-[0.5em]">© Recruit Art Recruitment Services 2019</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Apply Modal */}
      <JobApplyModal
        job={job}
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSuccess={handleApplySuccess}
      />
    </>
  );
};

export default JobDetailsModal;

