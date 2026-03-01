import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApplicationDetailsModal from './Job/ApplicationDetailsModal';
import { Briefcase, Building2, Calendar } from 'lucide-react';

const getStatusColor = (status) => {
  const colors = {
    'pending': 'bg-slate-100 text-slate-500 border-slate-200',
    'reviewing': 'bg-amber-50 text-amber-600 border-amber-100',
    'shortlisted': 'bg-[#cbd5b1]/10 text-[#121212] border-[#cbd5b1]/20',
    'hired': 'bg-[#cbd5b1] text-[#121212] border-[#cbd5b1]',
    'rejected': 'bg-rose-50 text-rose-500 border-rose-100',
  };
  return colors[status.toLowerCase()] || 'bg-slate-50 text-slate-400 border-slate-200';
};

const ApplicationsList = ({ applications, isLoading }) => {
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleAppClick = (id) => {
    setSelectedAppId(id);
    setShowDetails(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-4 border-[#cbd5b1] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="bg-white border border-slate-200/60 p-20 rounded-[3rem] text-center shadow-sm">
         <div className="w-16 h-16 bg-[#f4f4f0] rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Briefcase size={32} />
         </div>
        <p className="text-xl font-serif text-slate-400 italic">No applications found. Start your journey today.</p>
      </div>
    );
  }

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Pending Review',
      'reviewing': 'Reviewing',
      'shortlisted': 'Shortlisted',
      'hired': 'Hired',
      'rejected': 'Rejected'
    };
    return labels[status.toLowerCase()] || status.replace('_', ' ');
  };

  return (
    <div className="space-y-4 md:space-y-6">
       <div className="flex items-center justify-between mb-6 md:mb-8 px-2 md:px-0">
          <h2 className="text-2xl md:text-3xl font-serif font-black text-[#121212]">Your Journey</h2>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white px-4 py-2 rounded-xl border border-slate-100">{applications.length} Total</span>
       </div>

      {applications.map((application, index) => (
        <motion.div
            key={application.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleAppClick(application.id)}
            className="bg-white border border-slate-200/60 p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-[#cbd5b1] transition-all duration-300 shadow-sm cursor-pointer hover:shadow-md"
        >
          <div className="flex items-center gap-5 md:gap-8">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#121212] rounded-xl md:rounded-2xl flex items-center justify-center font-serif font-black text-xl md:text-2xl text-[#cbd5b1] group-hover:scale-110 transition-transform shadow-lg border border-white/10 shrink-0">
              {application.company_name?.[0] || 'C'}
            </div>
            <div className="min-w-0">
              <h4 className="text-lg md:text-2xl font-serif font-black text-[#121212] group-hover:text-[#cbd5b1] transition-colors leading-tight mb-1 truncate">{application.job_title || 'Job Title'}</h4>
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span className="flex items-center gap-1.5"><Building2 size={12} /> {application.company_name || 'Company'}</span>
                <div className="hidden md:block w-1.5 h-1.5 bg-slate-100 rounded-full"></div>
                <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(application.applied_at || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-4 border-t border-slate-50 pt-4 md:border-none md:p-0">
            <span className="md:hidden text-[10px] font-black text-slate-300 uppercase tracking-widest">Status</span>
            <span className={`px-5 md:px-6 py-2 md:py-2.5 border rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(application.status || 'pending')}`}>
              {getStatusLabel(application.status || 'pending')}
            </span>
          </div>
        </motion.div>
      ))}

      <ApplicationDetailsModal 
        isOpen={showDetails} 
        onClose={() => setShowDetails(false)} 
        applicationId={selectedAppId} 
      />
    </div>
  );
};

export default ApplicationsList;
