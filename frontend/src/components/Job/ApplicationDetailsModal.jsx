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
      'reviewing': { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Under Review', icon: <Clock size={16} /> },
      'shortlisted': { color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', label: 'Shortlisted', icon: <CheckCircle size={16} /> },
      'hired': { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Hired', icon: <CheckCircle size={16} /> },
      'rejected': { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', label: 'Rejected', icon: <X size={16} /> },
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
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#121212] rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200">
                <FileText size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 font-serif">Application Details</h2>
                <p className="text-slate-500 font-medium mt-0.5">Submitted on {application ? new Date(application.applied_at).toLocaleDateString() : '...'}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all shadow-sm border border-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Fetching details...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 text-rose-500 font-bold">{error}</div>
            ) : application && (
              <div className="space-y-10">
                {/* Status & Job Summary */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{application.job_title}</h3>
                      <p className="text-slate-500 text-sm font-medium">{application.company_name}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-bold uppercase tracking-widest ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                    {statusConfig.icon}
                    {statusConfig.label}
                  </div>
                </div>

                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Personal Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-700">
                        <User size={18} className="text-slate-400" />
                        <span className="font-semibold">{application.full_name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-700">
                        <Mail size={18} className="text-slate-400" />
                        <span className="font-semibold">{application.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-700">
                        <Phone size={18} className="text-slate-400" />
                        <span className="font-semibold">{application.mobile}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Social Profiles</h4>
                    <div className="space-y-3">
                      {application.linkedin_url && (
                        <a href={application.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-indigo-600 hover:underline font-semibold">
                          <Linkedin size={18} />
                          <span>LinkedIn Profile</span>
                          <ExternalLink size={14} />
                        </a>
                      )}
                      {application.portfolio_url && (
                        <a href={application.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-indigo-600 hover:underline font-semibold">
                          <LinkIcon size={18} />
                          <span>Portfolio Website</span>
                          <ExternalLink size={14} />
                        </a>
                      )}
                      {!application.linkedin_url && !application.portfolio_url && <p className="text-slate-400 italic text-sm">No profiles provided</p>}
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                     <p className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Expected Salary</p>
                     <p className="text-slate-900 font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        {application.expected_salary ? `₹ ${application.expected_salary}` : 'Not Specified'}
                     </p>
                   </div>
                   <div className="space-y-2">
                     <p className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Notice Period</p>
                     <p className="text-slate-900 font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        {application.notice_period || 'Immediate'}
                     </p>
                   </div>
                </div>

                {/* Resume Section */}
                {application.resume && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Resume / CV</h4>
                    <div className="flex items-center justify-between p-6 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 border-dashed">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                          <FileText size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 truncate max-w-[200px]">{application.resume_file_name || 'Resume Document'}</p>
                          <p className="text-indigo-600/70 text-xs font-bold uppercase tracking-widest">Uploaded Document</p>
                        </div>
                      </div>
                      <a 
                        href={application.resume.startsWith('http') ? application.resume : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}${application.resume}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-2xl font-bold shadow-sm border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all group"
                      >
                         <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                         Download
                      </a>
                    </div>
                  </div>
                )}

                {/* Custom Responses */}
                {application.responses && application.responses.length > 0 && (
                  <div className="space-y-6">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Screening Questions</h4>
                    <div className="grid gap-6">
                      {application.responses.map((resp, i) => (
                        <div key={i} className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                           <p className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">{resp.question_text}</p>
                           <p className="text-slate-900 font-bold whitespace-pre-wrap">{resp.response_value || 'No response'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cover Letter */}
                {application.cover_letter && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Cover Letter</h4>
                    <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                      {application.cover_letter}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end">
             <button
                onClick={handleClose}
                className="px-10 py-4 bg-[#121212] text-white rounded-2xl font-bold hover:bg-slate-800 transition-all uppercase tracking-[0.2em] text-[10px]"
              >
                Done
              </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ApplicationDetailsModal;
