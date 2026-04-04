import { motion } from 'framer-motion';
import { MapPin, ArrowUpRight, Building2, Briefcase, IndianRupee } from 'lucide-react';

const JobCard = ({ job, onClick, showApplyButton = false, onApply }) => {
  const jobData = {
    id: job.id || 0,
    title: job.title || 'Unknown Position',
    company_name: job.company_name || job.company || 'Unknown Company',
    location: job.location || 'Remote',
    job_type: job.job_type || 'Full-time',
    salary_range: job.salary_range || job.salary || 'Negotiable',
    match: job.match || 88,
    category: job.category || 'Other',
    number_of_openings: job.number_of_openings || 1,
    is_active: job.is_active !== undefined ? job.is_active : true,
  };

  const handleCardClick = () => {
    if (onClick) onClick(job);
  };

  return (
    <motion.div 
      whileHover={{ y: -4, backgroundColor: '#ffffff' }}
      className="group flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 sm:p-6 bg-white border border-slate-200/50 hover:border-[#FFC107]/30 rounded-2xl sm:rounded-[2rem] cursor-pointer transition-all duration-300 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/20"
      onClick={handleCardClick}
    >
      {/* Primary Info */}
      <div className="flex-1 min-w-0 mb-4 sm:mb-0">
        <div className="flex items-center justify-between sm:justify-start gap-4 mb-2">
          <h3 className="text-lg sm:text-xl font-black text-[#0c0e14] group-hover:text-[#FFC107] transition-colors leading-tight line-clamp-2">
            {jobData.title}
          </h3>
          {/* Mobile Match Tag */}
          {jobData.match > 0 && (
            <div className="sm:hidden flex flex-col items-end">
              <span className="text-[10px] font-black text-[#FFC107] bg-[#0c0e14] px-2 py-0.5 rounded-lg">{jobData.match}%</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400">
           <span className="flex items-center gap-1.5 text-slate-500 font-bold">{jobData.company_name}</span>
           <div className="hidden sm:block w-1 h-1 bg-slate-200 rounded-full"></div>
           <span className="flex items-center gap-1.5"><MapPin size={12} className="text-slate-300" /> {jobData.location}</span>
           
           <div className="flex items-center gap-2 mt-1 sm:mt-0 w-full sm:w-auto">
             <span className="flex items-center gap-1.5 text-[#0c0e14] bg-[#FFC107] px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg shadow-sm border border-[#FFC107]/20">
               <IndianRupee size={12} className="text-[#0c0e14]" />
               <span className="font-black text-xs sm:text-base">
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
             </span>
             <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 sm:py-1.5 rounded-lg text-slate-500 border border-slate-100">
               <Briefcase size={12} className="text-[#FFC107]" /> 
               {jobData.number_of_openings} {jobData.number_of_openings === 1 ? 'Opening' : 'Groups'}
             </span>
           </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 sm:pl-6 shrink-0 pt-4 sm:pt-0 border-t sm:border-0 border-slate-100">
         <div className="flex items-center gap-2">
           {showApplyButton && jobData.is_active && (
              <button
                 onClick={(e) => {
                    e.stopPropagation();
                    if (onApply) onApply(job);
                 }}
                 className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-[#0c0e14] text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl hover:bg-[#FFC107] hover:text-[#0c0e14] transition-colors shadow-lg"
              >
                 Apply now
              </button>
           )}
           <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 group-hover:text-[#0c0e14] group-hover:border-[#0c0e14] transition-all bg-white shadow-sm">
              <ArrowUpRight size={16} sm:text={18} />
           </div>
         </div>

         {/* Desktop Match Stats */}
         <div className="hidden sm:flex flex-col items-end opacity-0 group-hover:opacity-100 transition-all">
            <span className="text-[10px] font-black text-[#0c0e14]">{jobData.match}%</span>
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Match</span>
         </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
