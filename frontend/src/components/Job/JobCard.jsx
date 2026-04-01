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
      className="group flex items-center justify-between p-6 bg-white/80 border border-slate-200/50 hover:border-[#FFC107]/30 rounded-[2rem] cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl"
      onClick={handleCardClick}
    >
      {/* Primary Info: Title as a Link */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-4 mb-2">
          <h3 className="text-xl font-serif font-black text-[#0c0e14] group-hover:text-[#FFC107] transition-colors leading-tight line-clamp-2">
            {jobData.title}
          </h3>
          <div className="flex gap-2 shrink-0">
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
              jobData.category === 'clinician' ? 'bg-[#4473C5]/10 text-[#4473C5] border-[#4473C5]/20' : 
              jobData.category === 'non_clinician' ? 'bg-[#FFC107]/10 text-[#0c0e14] border-[#FFC107]/20' :
              'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              {jobData.category === 'clinician' ? 'Clinical' : 
               jobData.category === 'non_clinician' ? 'Non Clinician' : 'Other Role'}
            </span>
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
              jobData.is_active 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                : 'bg-rose-50 text-rose-500 border-rose-100'
            }`}>
              {jobData.is_active ? 'Active' : 'Archived'}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-black uppercase tracking-wider text-slate-400">
           <span className="flex items-center gap-1.5 text-slate-500"><Building2 size={13} className="text-[#FFC107]" /> {jobData.company_name}</span>
           <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
           <span className="flex items-center gap-1.5"><MapPin size={13} /> {jobData.location}</span>
           <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
           <span className="flex items-center gap-1.5 text-[#0c0e14] bg-[#f8f9fa] px-3 py-1 rounded-lg shadow-sm border border-slate-200/50">
             <IndianRupee size={12} className="text-[#FFC107]" />
             <span className="font-bold">
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
            <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
            <span className="flex items-center gap-1.5"><Briefcase size={13} className="text-[#FFC107]" /> {jobData.number_of_openings} {jobData.number_of_openings === 1 ? 'Opening' : 'Openings'}</span>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex items-center gap-6 pl-6 shrink-0 md:opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
         {jobData.match > 0 && (
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-black text-[#0c0e14]">{jobData.match}%</span>
               <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Match</span>
            </div>
         )}
         
         {showApplyButton && jobData.is_active && (
            <button
               onClick={(e) => {
                  e.stopPropagation();
                  if (onApply) onApply(job);
               }}
               className="text-[10px] font-black uppercase tracking-widest bg-[#0c0e14] text-white px-6 py-2.5 rounded-xl hover:bg-[#FFC107] hover:text-[#0c0e14] transition-colors shadow-lg"
            >
               Apply
            </button>
         )}
         
         <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 group-hover:text-[#0c0e14] group-hover:border-[#0c0e14] transition-all">
            <ArrowUpRight size={18} />
         </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
