import { motion } from 'framer-motion';
import { MapPin, ArrowUpRight, Building2, Briefcase } from 'lucide-react';

const JobCard = ({ job, onClick, showApplyButton = false, onApply }) => {
  const jobData = {
    id: job.id || 0,
    title: job.title || 'Unknown Position',
    company_name: job.company_name || job.company || 'Unknown Company',
    location: job.location || 'Remote',
    job_type: job.job_type || 'Full-time',
    salary_range: job.salary_range || job.salary || 'Negotiable',
    match: job.match || 88,
    is_active: job.is_active !== undefined ? job.is_active : true,
  };

  const handleCardClick = () => {
    if (onClick) onClick(job);
  };

  return (
    <motion.div 
      whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.8)' }}
      className="group flex items-center justify-between p-4 bg-white/40 border-b border-white/50 hover:bg-white rounded-lg cursor-pointer transition-all duration-200"
      onClick={handleCardClick}
    >
      {/* Primary Info: Title as a Link */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-[#121212] truncate group-hover:text-indigo-600 group-hover:underline decoration-2 underline-offset-4 transition-colors font-serif">
            {jobData.title}
          </h3>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            jobData.is_active 
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
              : 'bg-rose-50 text-rose-600 border border-rose-100'
          }`}>
            {jobData.is_active ? 'Open' : 'Ended'}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium font-sans">
           <span className="flex items-center gap-1"><Building2 size={10} /> {jobData.company_name}</span>
           <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
           <span className="flex items-center gap-1"><MapPin size={10} /> {jobData.location}</span>
           <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
           <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
           <span className="font-sans font-bold text-slate-700">
             {(() => {
                const s = jobData.salary_range.toString();
                if (s.includes('₹')) return s;
                if (s.includes('$') || s.includes('USD')) {
                   return s.replace(/\$/g, '₹').replace(/USD/g, '₹');
                }
                return /\d/.test(s) ? `₹ ${s}` : s;
             })()}
           </span>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex items-center gap-4 pl-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
         {jobData.match > 0 && (
            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
               {jobData.match}% Match
            </span>
         )}
         
         {showApplyButton && jobData.is_active && (
            <button
               onClick={(e) => {
                  e.stopPropagation();
                  if (onApply) onApply(job);
               }}
               className="text-xs font-bold bg-[#121212] text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-colors"
            >
               Apply
            </button>
         )}
         
         <ArrowUpRight size={16} className="text-slate-400 group-hover:text-indigo-600" />
      </div>
    </motion.div>
  );
};

export default JobCard;
