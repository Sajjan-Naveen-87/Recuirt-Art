import { motion } from 'framer-motion';
import { MapPin, ArrowUpRight, Building2, Clock, Briefcase } from 'lucide-react';

const JobCard = ({ job, onClick, showApplyButton = false, onApply }) => {
  // Handle both real API data and demo data
  const jobData = {
    id: job.id || 0,
    title: job.title || 'Unknown Position',
    company_name: job.company_name || job.company || 'Unknown Company',
    location: job.location || 'Remote',
    job_type: job.job_type || 'Full-time',
    salary_range: job.salary_range || job.salary || 'Negotiable',
    match: job.match || Math.floor(Math.random() * 20) + 80, // Demo match score
    apply_deadline: job.apply_deadline || null,
    is_active: job.is_active !== undefined ? job.is_active : true,
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

  const formatDeadline = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(job);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -12, shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)" }}
      className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:border-indigo-100 transition-all duration-500 group relative overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Match Badge */}
      {jobData.match > 0 && (
        <div className="absolute top-4 right-4">
          <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">
            {jobData.match}% Match
          </span>
        </div>
      )}

      {/* Company Logo */}
      <div className="flex justify-between items-start mb-6">
        <div className="w-16 h-16 bg-slate-50 rounded-[1.8rem] flex items-center justify-center text-2xl font-black text-indigo-600 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
          {jobData.company_name[0]}
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all border border-slate-100">
          <ArrowUpRight size={18} />
        </div>
      </div>

      {/* Job Title & Company */}
      <h3 className="text-xl font-bold text-slate-900 mb-1 leading-tight group-hover:text-indigo-600 transition-colors">
        {jobData.title}
      </h3>
      <p className="text-slate-400 font-semibold text-sm mb-4 flex items-center gap-2">
        <Building2 size={14} />
        {jobData.company_name}
      </p>

      {/* Job Meta */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
          <MapPin size={12} /> {jobData.location}
        </span>
        <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
          <Briefcase size={12} /> {formatJobType(jobData.job_type)}
        </span>
        {jobData.apply_deadline && (
          <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
            <Clock size={12} /> Due {formatDeadline(jobData.apply_deadline)}
          </span>
        )}
      </div>

      {/* Salary & Apply Button */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
        <span className="text-lg font-black text-slate-900 tracking-tight">
          {jobData.salary_range}
        </span>
        
        {showApplyButton && jobData.is_active && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onApply) onApply(job);
            }}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Apply Now
          </button>
        )}
        
        {!jobData.is_active && (
          <span className="px-4 py-2 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl">
            Closed
          </span>
        )}
      </div>

      {/* Active Indicator */}
      {jobData.is_active && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </motion.div>
  );
};

export default JobCard;

