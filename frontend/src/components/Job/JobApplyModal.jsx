import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { jobsService } from '../../services/jobs';

const JobApplyModal = ({ job, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || user?.first_name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    linkedin_url: '',
    portfolio_url: '',
    expected_salary: '',
    notice_period: '',
    cover_letter: '',
    resume: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      // Validate file type
      const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/webp'
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [name]: 'Please upload a valid document (PDF, DOC) or image' }));
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [name]: 'File size must be less than 5MB' }));
        return;
      }
      setFormData(prev => ({ ...prev, [name]: file }));
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    
    // Require resume only if not in profile and not newly uploaded
    if (!formData.resume && !user?.resume) {
      newErrors.resume = 'Resume is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const applicationData = new FormData();
      applicationData.append('job', job.id);
      applicationData.append('full_name', formData.full_name);
      applicationData.append('email', formData.email);
      applicationData.append('mobile', formData.mobile);

      // Fix URLs if protocols are missing
      const fixUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `https://${url}`;
      };

      if (formData.linkedin_url) applicationData.append('linkedin_url', fixUrl(formData.linkedin_url));
      if (formData.portfolio_url) applicationData.append('portfolio_url', fixUrl(formData.portfolio_url));
      if (formData.expected_salary) applicationData.append('expected_salary', formData.expected_salary);
      if (formData.notice_period) applicationData.append('notice_period', formData.notice_period);
      if (formData.cover_letter) applicationData.append('cover_letter', formData.cover_letter);
      
      // Only append if a new file was selected
      if (formData.resume instanceof File) {
        applicationData.append('resume', formData.resume);
      }

      await jobsService.applyForJob(applicationData);
      setSuccess(true);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err) {
      console.error('Job application error:', err.response?.data);
      const data = err.response?.data;
      let errorMessage = 'Failed to submit application. Please try again.';
      
      if (data) {
        if (typeof data === 'string') {
          errorMessage = data;
        } else if (data.error || data.message) {
          errorMessage = data.error || data.message;
        } else if (typeof data === 'object') {
          // Handle DRF field errors
          const fieldErrors = Object.entries(data)
            .map(([key, value]) => {
              const msg = Array.isArray(value) ? value.join(', ') : value;
              return `${key}: ${msg}`;
            });
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join(' | ');
          }
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setErrors({});
    onClose();
  };

  if (!job) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] bg-[#f4f4f0] md:rounded-[3rem] shadow-2xl overflow-hidden z-50 flex flex-col border border-white/20"
          >
            {/* Header */}
            <div className="p-6 md:p-10 lg:p-12 border-b border-slate-200/60 flex items-center justify-between flex-shrink-0 bg-white/40">
              <div className="min-w-0">
                <h2 className="text-xl md:text-3xl font-serif font-black text-slate-900 leading-tight truncate">Apply for Position</h2>
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#cbd5b1] mt-1 md:mt-2 truncate">{job.title}</p>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-[#121212] transition-all border border-slate-100 shrink-0 ml-4"
              >
                <X size={18} md:size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 md:py-20"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-[#cbd5b1]/10 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
                    <CheckCircle size={40} md:size={48} className="text-[#cbd5b1]" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-black text-slate-900 mb-3 md:mb-4">Application Submitted!</h3>
                  <p className="text-base md:text-lg font-serif text-slate-500 max-w-md mx-auto italic">
                    Your request for <strong>{job.title}</strong> has been received. 
                    We'll notify you soon.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                  {error && (
                    <div className="p-4 md:p-5 bg-red-50 border border-red-100 rounded-xl md:rounded-2xl text-red-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                      <AlertCircle size={16} md:size={18} />
                      {error}
                    </div>
                  )}

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-2 md:space-y-3">
                      <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400 ml-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className={`w-full bg-white border border-slate-200 rounded-xl md:rounded-2xl py-3.5 md:py-4 px-5 md:px-6 text-base md:text-lg font-serif font-black placeholder:text-slate-300 focus:ring-2 focus:ring-[#cbd5b1] focus:border-[#cbd5b1] transition-all outline-none ${
                          errors.full_name ? 'ring-2 ring-red-300 bg-red-50 border-red-200' : ''
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.full_name && (
                        <p className="text-red-500 text-[9px] font-black uppercase tracking-widest mt-1 ml-2">{errors.full_name}</p>
                      )}
                    </div>

                    <div className="space-y-2 md:space-y-3">
                      <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400 ml-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className={`w-full bg-white border border-slate-200 rounded-xl md:rounded-2xl py-3.5 md:py-4 px-5 md:px-6 text-base md:text-lg font-serif font-black placeholder:text-slate-300 focus:ring-2 focus:ring-[#cbd5b1] focus:border-[#cbd5b1] transition-all outline-none ${
                          errors.mobile ? 'ring-2 ring-red-300 bg-red-50 border-red-200' : ''
                        }`}
                        placeholder="+1234567890"
                      />
                      {errors.mobile && (
                        <p className="text-red-500 text-[9px] font-black uppercase tracking-widest mt-1 ml-2">{errors.mobile}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400 ml-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full bg-white border border-slate-200 rounded-xl md:rounded-2xl py-3.5 md:py-4 px-5 md:px-6 text-base md:text-lg font-serif font-black placeholder:text-slate-300 focus:ring-2 focus:ring-[#cbd5b1] focus:border-[#cbd5b1] transition-all outline-none ${
                        errors.email ? 'ring-2 ring-red-300 bg-red-50 border-red-200' : ''
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-[9px] font-black uppercase tracking-widest mt-1 ml-2">{errors.email}</p>
                    )}
                  </div>

                  {/* Resume Upload */}
                  <div className="space-y-2 md:space-y-3">
                    <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400 ml-1">
                      Professional Dossier (Resume) *
                    </label>
                    <div className={`relative border-2 border-dashed rounded-2xl md:rounded-[2rem] p-6 md:p-8 transition-all group ${
                      errors.resume ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-[#cbd5b1] bg-white hover:bg-white transition-all'
                    }`}>
                      <input
                        type="file"
                        name="resume"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="text-center">
                        {formData.resume ? (
                          <div className="flex items-center justify-center gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#cbd5b1]/10 rounded-lg md:rounded-xl flex items-center justify-center text-[#cbd5b1]">
                              <FileText size={20} md:size={24} />
                            </div>
                            <div className="text-left">
                              <p className="font-serif font-black text-sm md:text-base text-[#121212] truncate max-w-[200px]">
                                {formData.resume.name}
                              </p>
                              <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#cbd5b1]">
                                New upload selected
                              </p>
                            </div>
                          </div>
                        ) : user?.resume ? (
                          <div className="flex items-center justify-center gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#cbd5b1]/20 rounded-lg md:rounded-xl flex items-center justify-center text-[#121212]">
                              <FileText size={20} md:size={24} />
                            </div>
                            <div className="text-left">
                              <p className="font-serif font-black text-sm md:text-base text-[#121212]">
                                Using resume on file
                              </p>
                              <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-400">
                                Click or drag to replace
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-[#f4f4f0] rounded-xl md:rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-3 md:mb-4 group-hover:text-[#cbd5b1] transition-colors">
                              <Upload size={24} md:size={28} />
                            </div>
                            <p className="text-[#121212] font-serif font-black text-sm mb-1">
                              Drag & Drop or Click to Upload
                            </p>
                            <p className="text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                              PDF, Word, or Images (max 5MB)
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    {errors.resume && (
                      <p className="text-red-500 text-[9px] font-black uppercase tracking-widest mt-1 ml-2">{errors.resume}</p>
                    )}
                  </div>

                  {/* Optional Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-2 md:space-y-3">
                      <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400 ml-1">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        name="linkedin_url"
                        value={formData.linkedin_url}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-xl md:rounded-2xl py-3.5 md:py-4 px-5 md:px-6 text-base md:text-lg font-serif font-black focus:ring-2 focus:ring-[#cbd5b1] focus:border-[#cbd5b1] transition-all outline-none"
                        placeholder="linkedin.com/in/..."
                      />
                    </div>

                    <div className="space-y-2 md:space-y-3">
                      <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400 ml-1">
                        Portfolio URL
                      </label>
                      <input
                        type="url"
                        name="portfolio_url"
                        value={formData.portfolio_url}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-xl md:rounded-2xl py-3.5 md:py-4 px-5 md:px-6 text-base md:text-lg font-serif font-black focus:ring-2 focus:ring-[#cbd5b1] focus:border-[#cbd5b1] transition-all outline-none"
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400 ml-1">
                      Brief Cover Letter
                    </label>
                    <textarea
                      name="cover_letter"
                      value={formData.cover_letter}
                      onChange={handleChange}
                      rows="3"
                      className="w-full bg-white border border-slate-200 rounded-xl md:rounded-[1.5rem] py-3.5 md:py-4 px-5 md:px-6 text-base md:text-lg font-serif font-black focus:ring-2 focus:ring-[#cbd5b1] focus:border-[#cbd5b1] transition-all outline-none resize-none"
                      placeholder="Why do you resonate with this role?"
                    />
                  </div>
                </form>
              )}
            </div>

            {/* Footer */}
            {!success && (
              <div className="p-6 md:p-10 lg:p-12 border-t border-slate-200/60 flex flex-col md:flex-row md:justify-end gap-3 md:gap-6 flex-shrink-0 bg-white/40">
                <button
                  onClick={handleClose}
                  className="order-2 md:order-1 px-8 py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] text-slate-400 hover:text-[#121212] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="order-1 md:order-2 px-8 md:px-10 py-4 bg-[#121212] text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-2xl shadow-black/20 hover:bg-[#cbd5b1] hover:text-[#121212] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} md:size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Submit Application <ArrowRight size={16} md:size={18} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default JobApplyModal;

