import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Linkedin, Link as LinkIcon, Calendar, CheckCircle, Clock, Building2, User, Mail, Phone, ExternalLink, Download } from 'lucide-react';
import { jobsService } from '../../services/jobs';

const ApplicationDetailsModal = ({ isOpen, onClose, applicationId }) => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && applicationId) {
      fetchApplicationDetails();
    }
  }, [isOpen, applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobsService.getApplication(applicationId);
      setApplication(data);
    } catch (err) {
      console.error('Failed to fetch application details:', err);
      setError('Failed to load application details.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      'pending': { color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', label: 'Pending Review', icon: <Clock size={16} /> },
      'reviewing': { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', label: 'Reviewing', icon: <Clock size={16} /> },
      'shortlisted': { color: 'text-[#0c0e14]', bg: 'bg-[#FFC107]/10', border: 'border-[#FFC107]/20', label: 'Shortlisted', icon: <CheckCircle size={16} /> },
      'hired': { color: 'text-[#0c0e14]', bg: 'bg-[#FFC107]', border: 'border-[#FFC107]', label: 'Hired', icon: <CheckCircle size={16} /> },
      'rejected': { color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100', label: 'Rejected', icon: <X size={16} /> },
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const statusConfig = application ? getStatusConfig(application.status) : getStatusConfig('pending');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#0c0e14]/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 lg:p-8"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="bg-white rounded-[3rem] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] border border-[#0c0e14]/5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-gradient-to-b from-slate-50 to-white">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#0c0e14] rounded-2xl flex items-center justify-center shadow-lg shadow-black/10 border border-white/10 group-hover:rotate-12 transition-transform">
                <FileText size={28} className="text-[#FFC107]" />
              </div>
              <div>
                <h2 className="text-3xl font-serif font-black text-[#0c0e14]">Application Details.</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">
                  Submitted • {application ? new Date(application.applied_at).toLocaleDateString() : '...'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-[#0c0e14] hover:border-[#FFC107] transition-all shadow-sm border border-slate-200/60"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-6">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-[#FFC107] border-t-transparent rounded-full"
                />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Retrieving Information</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                 <p className="text-rose-500 font-black uppercase tracking-widest text-sm mb-4">Error Occurred</p>
                 <p className="text-slate-500 font-serif">{error}</p>
              </div>
            ) : application && (
              <div className="space-y-12">
                {/* Status & Job Summary */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-8 bg-[#f8f9fa] rounded-[2.5rem] border border-slate-100">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-[#0c0e14]">
                      <Building2 size={26} />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-black text-[#0c0e14] mb-1">{application.job_title}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{application.company_name}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-6 py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest shadow-sm ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                    {statusConfig.icon}
                    {statusConfig.label}
                  </div>
                </div>

                {/* Personal & Profiles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Personal Info</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-slate-700 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                        <User size={18} className="text-slate-400" />
                        <span className="text-sm font-bold text-[#0c0e14]">{application.full_name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-700 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                        <Mail size={18} className="text-slate-400" />
                        <span className="text-sm font-bold text-[#0c0e14]">{application.email}</span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-700 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                        <Phone size={18} className="text-slate-400" />
                        <span className="text-sm font-bold text-[#0c0e14]">{application.mobile}</span>
                      </div>
                      {application.alternative_mobile && (
                        <div className="flex items-center gap-4 text-slate-700 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                          <Phone size={18} className="text-slate-400" />
                          <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase text-slate-400 leading-none mb-1">Alt. Mobile</span>
                            <span className="text-sm font-bold text-[#0c0e14]">{application.alternative_mobile}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Job Preferences</h4>
                    <div className="space-y-4">
                      <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase text-slate-400 leading-none">Preferred Designation</span>
                        <span className="text-sm font-bold text-[#0c0e14]">{application.preferred_job_designation || 'Not specified'}</span>
                      </div>
                      <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase text-slate-400 leading-none">Preferred Location</span>
                        <span className="text-sm font-bold text-[#0c0e14]">{application.preferred_job_location || 'Not specified'}</span>
                      </div>
                      <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase text-slate-400 leading-none">Experience</span>
                        <span className="text-sm font-bold text-[#0c0e14]">{application.total_experience || 'Not specified'}</span>
                      </div>
                      <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase text-slate-400 leading-none">Available to join</span>
                        <span className="text-sm font-bold text-[#0c0e14]">{application.join_after || 'Immediate'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salary & Notice Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Expected Earnings</p>
                     <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
                        <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Annual Salary</span>
                        <span className="text-lg font-serif font-black text-[#0c0e14]">{application.expected_salary ? `₹ ${application.expected_salary}` : 'Negotiable'}</span>
                     </div>
                   </div>
                   <div className="space-y-3">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Availability</p>
                     <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
                        <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Notice Period</span>
                        <span className="text-lg font-serif font-black text-[#0c0e14]">{application.notice_period || 'Immediate'}</span>
                     </div>
                   </div>
                </div>

                {/* Resume Section */}
                {application.resume && (
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Resume / CV</h4>
                    <div className="flex items-center justify-between p-8 bg-[#0c0e14] rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFC107]/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#FFC107]/20 transition-colors"></div>
                      
                      <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 bg-[#FFC107]/10 text-[#FFC107] rounded-2xl flex items-center justify-center shadow-lg border border-[#FFC107]/20">
                          <FileText size={28} />
                        </div>
                        <div>
                          <p className="font-serif font-black text-white text-lg truncate max-w-[240px]">{application.resume_file_name || 'Resume Document'}</p>
                          <p className="text-[#FFC107] text-[9px] font-black uppercase tracking-[0.3em] mt-1">Digital Portfolio</p>
                        </div>
                      </div>
                      
                      <a 
                        href={application.resume.startsWith('http') ? application.resume : `${import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'}${application.resume}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-[#FFC107] text-[#0c0e14] px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all group/btn relative z-10"
                      >
                         <Download size={18} className="group-hover/btn:translate-y-0.5 transition-transform" />
                         Preview File
                      </a>
                    </div>
                  </div>
                )}

                {/* Custom Responses */}
                {application.responses && application.responses.length > 0 && (
                  <div className="space-y-8">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Questionnaire</h4>
                    <div className="space-y-4">
                      {application.responses.map((resp, i) => (
                        <div key={i} className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 hover:border-slate-200 transition-colors">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{resp.question_text}</p>
                           <p className="text-[#0c0e14] font-serif font-medium leading-relaxed whitespace-pre-wrap">{resp.response_value || 'No response provided.'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cover Letter */}
                {application.cover_letter && (
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Cover Note</h4>
                    <div className="p-10 bg-[#f8f9fa] border border-slate-100 rounded-[3rem] text-[#0c0e14] leading-relaxed font-serif text-lg italic whitespace-pre-wrap relative shadow-inner">
                      <div className="absolute top-6 left-6 text-4xl text-[#0c0e14]/5 font-serif">"</div>
                      {application.cover_letter}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-10 border-t border-slate-100 bg-white flex justify-end items-center gap-4">
             <button
                onClick={handleClose}
                className="px-12 py-5 bg-[#0c0e14] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-[#FFC107] hover:text-[#0c0e14] transition-all shadow-xl"
              >
                Close Window
              </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ApplicationDetailsModal;
