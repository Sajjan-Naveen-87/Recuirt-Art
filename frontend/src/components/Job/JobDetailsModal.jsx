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
              className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl md:max-h-[90vh] bg-[#f4f4f0] md:rounded-[3rem] shadow-2xl overflow-hidden z-50 flex flex-col border border-white/20"
            >
              {/* Header */}
              <div className="p-6 md:p-10 lg:p-12 border-b border-slate-200/60 flex items-start justify-between flex-shrink-0 bg-white/40">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-14 h-14 md:w-20 md:h-20 bg-[#121212] rounded-2xl md:rounded-[2rem] flex items-center justify-center text-2xl md:text-3xl font-serif font-black text-[#cbd5b1] shadow-xl border border-white/10 shrink-0">
                    {jobData.company_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-3xl lg:text-4xl font-serif font-black text-[#121212] leading-tight mb-1 md:mb-2">{jobData.title}</h2>
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#cbd5b1] flex items-center gap-2">
                       <Building2 size={12} md:size={14} />
                       <span className="truncate">{jobData.company_name}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-[#121212] hover:shadow-md transition-all border border-slate-100 shrink-0 ml-4"
                >
                  <X size={18} md:size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12">
                {/* Job Meta */}
                <div className="flex flex-wrap gap-2 md:gap-4 mb-8 md:mb-12">
                  <div className="flex items-center gap-2 bg-white px-4 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-sm border border-slate-100">
                    <MapPin size={16} md:size={18} className="text-[#cbd5b1]" />
                    <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-slate-600">{jobData.location}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-sm border border-slate-100">
                    <Briefcase size={16} md:size={18} className="text-[#cbd5b1]" />
                    <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-slate-600">{formatJobType(jobData.job_type)}</span>
                  </div>
                  {jobData.salary_range && (
                    <div className="flex items-center gap-2 bg-[#121212] px-4 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-lg border border-white/5">
                      <IndianRupee size={16} md:size={18} className="text-[#cbd5b1]" />
                      <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-[#cbd5b1]">
                        {(() => {
                          const s = jobData.salary_range.toString();
                          const cleanS = s.replace(/,/g, '');
                          return cleanS.replace(/([$₹])?\s?(\d+)/g, (match, symbol, num) => {
                            const n = parseInt(num);
                            const curSymbol = symbol === '$' ? '₹' : (symbol || '₹');
                            return n >= 1000 ? `${curSymbol}${Math.floor(n / 1000)}K` : `${curSymbol}${n}`;
                          }).replace(/\s?-\s?/g, ' - ');
                        })()}
                      </span>
                    </div>
                  )}
                  {jobData.apply_deadline && (
                    <div className="flex items-center gap-2 bg-white px-4 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-sm border border-amber-100">
                      <Clock size={16} md:size={18} className="text-amber-500" />
                      <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-amber-600">Until {formatDate(jobData.apply_deadline)}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-8 md:mb-12">
                  <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-400 mb-4 md:mb-6">Job Description</h3>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-lg md:text-xl font-serif text-[#121212]/80 leading-relaxed whitespace-pre-wrap">
                      {jobData.description}
                    </p>
                  </div>
                </div>

                {/* Skills Required */}
                {getSkillsList().length > 0 && (
                  <div className="mb-8 md:mb-12">
                    <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-400 mb-4 md:mb-6">Expertise Required</h3>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {getSkillsList().map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 md:px-5 py-2 md:py-2.5 bg-white text-[#121212] rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-slate-200 shadow-sm hover:border-[#cbd5b1] transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {jobData.experience_required && (
                  <div className="mb-8 md:mb-12">
                    <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-400 mb-3 md:mb-4">Experience</h3>
                    <p className="text-base md:text-lg font-serif text-[#121212]/70 italic">{jobData.experience_required}</p>
                  </div>
                )}

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-3 px-5 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px] border shadow-sm ${
                    jobData.is_active 
                      ? 'bg-[#cbd5b1]/10 text-[#121212] border-[#cbd5b1]/30' 
                      : 'bg-rose-50 text-rose-500 border-rose-100'
                   }`}>
                    {jobData.is_active ? <CheckCircle size={14} className="text-[#cbd5b1]" /> : <X size={14} />}
                    {jobData.is_active ? 'Position Open' : 'Closed'}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 md:p-10 lg:p-12 border-t border-slate-200/60 flex flex-col md:flex-row md:justify-end gap-4 md:gap-6 flex-shrink-0 bg-white/40">
                <button
                  onClick={onClose}
                  className="order-2 md:order-1 px-8 py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-[#121212] transition-colors"
                >
                  Go Back
                </button>
                {jobData.is_active && (
                  <button
                    onClick={handleApplyClick}
                    className="order-1 md:order-2 px-8 md:px-10 py-4 bg-[#121212] text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-black/20 hover:bg-[#cbd5b1] hover:text-[#121212] transition-all flex items-center justify-center gap-3 group"
                  >
                    Apply Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
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

