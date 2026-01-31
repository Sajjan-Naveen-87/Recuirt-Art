import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
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
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [name]: 'Please upload a PDF or Word document' }));
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
    if (!formData.resume) newErrors.resume = 'Resume is required';
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
      if (formData.linkedin_url) applicationData.append('linkedin_url', formData.linkedin_url);
      if (formData.portfolio_url) applicationData.append('portfolio_url', formData.portfolio_url);
      if (formData.expected_salary) applicationData.append('expected_salary', formData.expected_salary);
      if (formData.notice_period) applicationData.append('notice_period', formData.notice_period);
      if (formData.cover_letter) applicationData.append('cover_letter', formData.cover_letter);
      applicationData.append('resume', formData.resume);

      await jobsService.applyForJob(applicationData);
      setSuccess(true);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to submit application. Please try again.';
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Apply for Position</h2>
                <p className="text-slate-500 font-medium mt-1">{job.title}</p>
              </div>
              <button
                onClick={handleClose}
                className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Your application for <strong>{job.title}</strong> has been submitted successfully. 
                    We'll notify you when there's an update.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium flex items-center gap-2">
                      <AlertCircle size={18} />
                      {error}
                    </div>
                  )}

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className={`w-full bg-slate-50 border-0 rounded-2xl py-4 px-5 text-lg font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${
                          errors.full_name ? 'ring-2 ring-red-300 bg-red-50' : ''
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.full_name && (
                        <p className="text-red-500 text-xs mt-2 ml-2">{errors.full_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className={`w-full bg-slate-50 border-0 rounded-2xl py-4 px-5 text-lg font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${
                          errors.mobile ? 'ring-2 ring-red-300 bg-red-50' : ''
                        }`}
                        placeholder="+1234567890"
                      />
                      {errors.mobile && (
                        <p className="text-red-500 text-xs mt-2 ml-2">{errors.mobile}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full bg-slate-50 border-0 rounded-2xl py-4 px-5 text-lg font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${
                        errors.email ? 'ring-2 ring-red-300 bg-red-50' : ''
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-2 ml-2">{errors.email}</p>
                    )}
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                      Resume / CV *
                    </label>
                    <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all ${
                      errors.resume ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-indigo-300 bg-slate-50'
                    }`}>
                      <input
                        type="file"
                        name="resume"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="text-center">
                        {formData.resume ? (
                          <div className="flex items-center justify-center gap-3">
                            <FileText size={24} className="text-indigo-600" />
                            <span className="font-medium text-slate-700">{formData.resume.name}</span>
                          </div>
                        ) : (
                          <>
                            <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                            <p className="text-slate-500 font-medium">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-slate-400 text-sm mt-1">
                              PDF, DOC, or DOCX (max 5MB)
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    {errors.resume && (
                      <p className="text-red-500 text-xs mt-2 ml-2">{errors.resume}</p>
                    )}
                  </div>

                  {/* Optional Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        name="linkedin_url"
                        value={formData.linkedin_url}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-5 text-lg font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                        Portfolio URL
                      </label>
                      <input
                        type="url"
                        name="portfolio_url"
                        value={formData.portfolio_url}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-5 text-lg font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                        Expected Salary
                      </label>
                      <input
                        type="text"
                        name="expected_salary"
                        value={formData.expected_salary}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-5 text-lg font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                        placeholder="e.g., $80,000 - $100,000"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                        Notice Period
                      </label>
                      <input
                        type="text"
                        name="notice_period"
                        value={formData.notice_period}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-5 text-lg font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                        placeholder="e.g., 2 weeks, 1 month"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                      Cover Letter
                    </label>
                    <textarea
                      name="cover_letter"
                      value={formData.cover_letter}
                      onChange={handleChange}
                      rows="4"
                      className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-5 text-lg font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none"
                      placeholder="Tell us why you're a great fit for this role..."
                    />
                  </div>
                </form>
              )}
            </div>

            {/* Footer */}
            {!success && (
              <div className="p-8 border-t border-slate-100 flex justify-end gap-4 flex-shrink-0">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
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

