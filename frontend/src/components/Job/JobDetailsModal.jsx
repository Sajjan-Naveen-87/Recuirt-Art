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
              className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl md:max-h-[90vh] bg-[#f8f9fa] md:rounded-[3rem] shadow-2xl overflow-hidden z-50 flex flex-col border border-[#0c0e14]/5"
            >
              {/* Header */}
              <div className="p-8 md:p-12 lg:p-16 border-b border-[#0c0e14]/5 flex items-start justify-between flex-shrink-0 bg-white/60">
                <div className="flex-1">
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#0c0e14] leading-tight mb-4 tracking-tight">
                    {jobData.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-[#0c0e14]">
                    <p className="text-[10px] md:text-sm font-black uppercase tracking-[0.3em] flex items-center gap-2">
                       <span className="truncate">{jobData.company_name}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4 shrink-0 ml-6">
                  {jobData.is_active && (
                    <button
                      onClick={handleApplyClick}
                      className="px-6 md:px-10 py-3 md:py-4 bg-[#0c0e14] text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-2xl shadow-[#0c0e14]/20 hover:bg-[#FFC107] hover:text-[#0c0e14] transition-all flex items-center justify-center gap-3 group"
                    >
                      Apply Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center text-slate-300 hover:text-[#0c0e14] hover:shadow-xl transition-all border border-slate-100"
                  >
                    <X size={20} md:size={24} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-10 md:p-14 lg:p-20">
                {/* Job Meta */}
                <div className="flex flex-wrap gap-2 md:gap-4 mb-8 md:mb-12">
                  <div className="flex items-center gap-2 bg-white px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-sm border border-slate-100">
                    <MapPin size={16} md:size={18} className="text-[#FFC107]" />
                    <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-slate-500">{jobData.location}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-sm border border-slate-100">
                    <Briefcase size={16} md:size={18} className="text-[#FFC107]" />
                    <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-slate-500">{formatJobType(jobData.job_type)}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FFC107] px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-lg border border-[#FFC107]/20">
                    <IndianRupee size={16} md:size={18} className="text-[#0c0e14]" />
                    <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-[#0c0e14]">
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
                  {jobData.apply_deadline && (
                    <div className="flex items-center gap-2 bg-white px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-sm border border-emerald-100">
                      <Clock size={16} md:size={18} className="text-emerald-500" />
                      <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-emerald-600">Until {formatDate(jobData.apply_deadline)}</span>
                    </div>
                  )}
                </div>

                <div className="mb-12 md:mb-16">
                  <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6 md:mb-8">Job Description</h3>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-xl md:text-2xl text-[#0c0e14]/80 leading-relaxed whitespace-pre-wrap">
                      {jobData.description}
                    </p>
                  </div>
                </div>

                {/* Skills Required */}
                {getSkillsList().length > 0 && (
                  <div className="mb-12 md:mb-16">
                    <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6 md:mb-8">Skills Required</h3>
                    <div className="flex flex-wrap gap-3 md:gap-4">
                      {getSkillsList().map((skill, index) => (
                        <span
                          key={index}
                          className="px-5 md:px-7 py-2.5 md:py-3.5 bg-white text-[#0c0e14] rounded-lg md:rounded-xl text-[10px] md:text-[12px] font-black uppercase tracking-widest border border-slate-200 shadow-sm hover:border-[#FFC107]/30 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {jobData.experience_required && (
                  <div className="mb-12 md:mb-16">
                    <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mb-5 md:mb-6">Experience</h3>
                    <p className="text-lg md:text-xl text-[#0c0e14]/70 italic font-medium">{jobData.experience_required}</p>
                  </div>
                )}

              </div>

              {/* Footer */}
              <div className="p-8 md:p-12 lg:p-16 border-t border-[#0c0e14]/5 flex justify-center bg-white/60">
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#0c0e14]/30">© Recruit Art 2026</p>
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

