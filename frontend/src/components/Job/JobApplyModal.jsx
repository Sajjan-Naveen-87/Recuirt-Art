import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, CheckCircle, AlertCircle, Loader2, ArrowRight, MapPin, Briefcase, IndianRupee } from 'lucide-react';
import { jobsService } from '../../services/jobs';

const JobApplyModal = ({ job, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mobile: '',
    alternative_mobile: '',
    preferred_job_designation: '',
    preferred_job_location: '',
    expected_salary: '',
    join_after: '',
    total_experience: '',
    cover_letter: '',
    resume: null,
    agree_to_policy: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/gif'
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [name]: 'Please upload a valid document (PDF, DOC) or image' }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [name]: 'Max file size: 2 MB' }));
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
    if (!formData.full_name.trim()) newErrors.full_name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email ID is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile No is required';
    if (!formData.preferred_job_designation.trim()) newErrors.preferred_job_designation = 'Designation is required';
    if (!formData.preferred_job_location.trim()) newErrors.preferred_job_location = 'Location is required';
    if (!formData.expected_salary.trim()) newErrors.expected_salary = 'Expected salary is required';
    if (!formData.join_after.trim()) newErrors.join_after = 'Joining time is required';
    if (!formData.total_experience.trim()) newErrors.total_experience = 'Experience is required';
    
    // Remove validation for Other Jobs specific fields if they are no longer in the UI

    if (!formData.resume) newErrors.resume = 'Resume is required';
    if (!formData.agree_to_policy) newErrors.agree_to_policy = 'You must agree to the privacy policy';
    
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
      applicationData.append('alternative_mobile', formData.alternative_mobile);
      applicationData.append('preferred_job_designation', formData.preferred_job_designation);
      applicationData.append('preferred_job_location', formData.preferred_job_location);
      applicationData.append('expected_salary', formData.expected_salary);
      applicationData.append('join_after', formData.join_after);
      applicationData.append('total_experience', formData.total_experience);
      
      let finalCoverLetter = formData.cover_letter;
      applicationData.append('cover_letter', finalCoverLetter);
      
      if (formData.resume instanceof File) {
        applicationData.append('resume', formData.resume);
      }

      await jobsService.applyForJob(applicationData);
      setSuccess(true);
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err) {
      console.error('Job application error:', err);
      let errorMessage = 'Failed to submit application. Please try again.';
      
      // Handle Django/Axios error responses
      if (err.detail) {
        errorMessage = err.detail;
      } else if (err.error) {
        errorMessage = err.error;
      } else if (err.response?.data) {
        const data = err.response.data;
        errorMessage = data.detail || data.error || data.message || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[92vh] bg-white md:rounded-[2.5rem] shadow-2xl overflow-hidden z-[101] flex flex-col border border-[#0c0e14]/5"
          >

            {/* Header */}
            <div className="px-6 py-5 md:px-12 md:py-8 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-white sticky top-0 z-20">
               <div className="flex-1 min-w-0 pr-4">
                 <h2 className="text-lg md:text-2xl font-serif font-black text-[#0c0e14] leading-tight tracking-tight">
                   Apply for Position
                 </h2>
                 <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                   {job.title} • {job.location}
                 </p>
               </div>
               <button
                 onClick={handleClose}
                 className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-[#0c0e14] transition-all border border-slate-100 shadow-sm"
               >
                 <X size={20} md:size={24} />
               </button>
            </div>

            {/* Quick Summary Bar */}
            <div className="hidden md:flex px-12 py-3 bg-[#0c0e14] border-b border-white/10 items-center gap-8 overflow-x-auto whitespace-nowrap scroll-hide">
              <div className="flex items-center gap-2">
                <Briefcase size={14} className="text-[#FFC107]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/70">{job.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#FFC107]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/70">{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <IndianRupee size={14} className="text-[#FFC107]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/70">{job.salary_range || 'Negotiable'}</span>
              </div>
            </div>


            <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-12 bg-slate-50/30">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle size={40} className="text-emerald-500" />
                  </div>
                  <h3 className="text-3xl font-serif font-black text-[#0c0e14] mb-4 tracking-tight">Application Submitted!</h3>
                  <p className="text-lg text-slate-500 font-medium">Your request has been successfully queued for our recruitment team.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3">
                      <AlertCircle size={20} />
                      {error}
                    </div>
                  )}

                  {/* 3-Column Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Full Name *</label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className={`w-full border border-slate-200 bg-white rounded-xl py-3 px-4 text-[#0c0e14] placeholder:text-slate-300 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#FFC107] outline-none transition-all font-medium ${errors.full_name ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="e.g. John Doe"
                      />
                    </div>

                    {/* Mobile No */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Mobile No *</label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className={`w-full border border-slate-200 bg-white rounded-xl py-3 px-4 text-[#0c0e14] placeholder:text-slate-300 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#FFC107] outline-none transition-all font-medium ${errors.mobile ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="Primary number"
                      />
                    </div>

                    {/* Alternative Mobile No */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Alternative No.</label>
                      <input
                        type="tel"
                        name="alternative_mobile"
                        value={formData.alternative_mobile}
                        onChange={handleChange}
                        className="w-full border border-slate-200 bg-white rounded-xl py-3 px-4 text-[#0c0e14] placeholder:text-slate-300 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#FFC107] outline-none transition-all font-medium"
                        placeholder="Secondary number"
                      />
                    </div>

                    {/* Email ID */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Email ID *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full border border-slate-200 bg-white rounded-xl py-3 px-4 text-[#0c0e14] placeholder:text-slate-300 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#FFC107] outline-none transition-all font-medium ${errors.email ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="Email for correspondence"
                      />
                    </div>

                    {/* Job Designation */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Current Designation *</label>
                      <input
                        type="text"
                        name="preferred_job_designation"
                        value={formData.preferred_job_designation}
                        onChange={handleChange}
                        className={`w-full border border-slate-200 bg-white rounded-xl py-3 px-4 text-[#0c0e14] placeholder:text-slate-300 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#FFC107] outline-none transition-all font-medium ${errors.preferred_job_designation ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="e.g. Senior Staff Nurse"
                      />
                    </div>

                    {/* Job Location */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Current Location *</label>
                      <input
                        type="text"
                        name="preferred_job_location"
                        value={formData.preferred_job_location}
                        onChange={handleChange}
                        className={`w-full border border-slate-200 bg-white rounded-xl py-3 px-4 text-[#0c0e14] placeholder:text-slate-300 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#FFC107] outline-none transition-all font-medium ${errors.preferred_job_location ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="City, State"
                      />
                    </div>

                    {/* Expected Salary */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Current Salary (₹) *</label>
                      <select
                        name="expected_salary"
                        value={formData.expected_salary}
                        onChange={handleChange}
                        className={`w-full border border-slate-200 bg-white rounded-xl py-3.5 px-4 text-[#0c0e14] appearance-none focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#FFC107] outline-none transition-all font-medium ${errors.expected_salary ? 'border-red-500 bg-red-50' : ''}`}
                      >
                        <option value="" disabled>Select Range</option>
                        <option value="10,000 - 30,000">10,000 - 30,000</option>
                        <option value="30,000 - 50,000">30,000 - 50,000</option>
                        <option value="50,000 - 75,000">50,000 - 75,000</option>
                        <option value="75,000 - 1 Lakh">75,000 - 1 Lakh</option>
                        <option value="1 - 2 Lakh">1 - 2 Lakh</option>
                        <option value="2 - 3 Lakh">2 - 3 Lakh</option>
                        <option value="3 - 5 Lakh">3 - 5 Lakh</option>
                        <option value="5 - 7.5 Lakh">5 - 7.5 Lakh</option>
                        <option value="7.5 - 10 Lakh">7.5 - 10 Lakh</option>
                        <option value="10+ Lakh">10+ Lakh</option>
                      </select>
                    </div>

                    {/* Join After */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Notice Period *</label>
                      <input
                        type="text"
                        name="join_after"
                        value={formData.join_after}
                        onChange={handleChange}
                        className={`w-full border border-slate-200 bg-white rounded-xl py-3 px-4 text-[#0c0e14] placeholder:text-slate-300 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#FFC107] outline-none transition-all font-medium ${errors.join_after ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="e.g. 30 Days"
                      />
                    </div>

                    {/* Total Experience */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Total Experience *</label>
                      <select
                        name="total_experience"
                        value={formData.total_experience}
                        onChange={handleChange}
                        className={`w-full border border-slate-200 bg-white rounded-xl py-3.5 px-4 text-[#0c0e14] appearance-none focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#FFC107] outline-none transition-all font-medium ${errors.total_experience ? 'border-red-500 bg-red-50' : ''}`}
                      >
                        <option value="" disabled>Select Level</option>
                        <option value="Fresher">Fresher</option>
                        <option value="Internship only">Internship only</option>
                        <option value="1 - 3 Years">1 - 3 Years</option>
                        <option value="3 - 6 Years">3 - 6 Years</option>
                        <option value="6 - 10 Years">6 - 10 Years</option>
                        <option value="10 - 15 Years">10 - 15 Years</option>
                        <option value="15+ Years">15+ Years</option>
                      </select>
                    </div>
                  </div>

                  {/* Message (Cover Letter) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Quick Message</label>
                    <textarea
                      name="cover_letter"
                      value={formData.cover_letter}
                      onChange={handleChange}
                      rows="3"
                      className="w-full border border-slate-200 bg-white rounded-xl py-3 px-4 text-[#0c0e14] placeholder:text-slate-300 focus:ring-2 focus:ring-[#FFC107]/20 focus:border-[#FFC107] outline-none transition-all resize-none font-medium"
                      placeholder="Tell us something about your expertise (Max 200 Words)"
                    />
                  </div>

                  {/* Upload and Consent Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Updated CV *</label>
                       <div className="relative group">
                          <input
                            type="file"
                            id="resume-upload"
                            name="resume"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                            className="hidden"
                          />
                          <label 
                            htmlFor="resume-upload"
                            className={`flex items-center gap-4 px-5 py-4 bg-white border-2 border-dashed rounded-2xl cursor-pointer group-hover:bg-slate-50 transition-all ${errors.resume ? 'border-red-400' : 'border-slate-200 group-hover:border-[#FFC107]/50'}`}
                          >
                             <div className="w-10 h-10 bg-[#FFC107]/10 text-[#FFC107] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Upload size={20} />
                             </div>
                             <div className="flex-1 min-w-0">
                               <p className="text-xs font-black text-[#0c0e14] truncate">
                                 {formData.resume ? formData.resume.name : 'Choose your file'}
                               </p>
                               <p className="text-[10px] text-slate-400 font-bold">Max 2MB • PDF, DOC, JPG</p>
                             </div>
                          </label>
                       </div>
                    </div>

                    <div className="flex flex-col justify-end space-y-6">
                      <div className="flex items-start gap-3 pl-1">
                         <div className="relative flex items-center mt-1">
                           <input
                             type="checkbox"
                             name="agree_to_policy"
                             id="agree_to_policy"
                             checked={formData.agree_to_policy}
                             onChange={handleChange}
                             className="w-4 h-4 rounded border-slate-300 text-[#0c0e14] focus:ring-[#FFC107]"
                           />
                         </div>
                         <label htmlFor="agree_to_policy" className="text-[11px] leading-relaxed text-slate-500 font-medium">
                           I confirm that the information provided is accurate and I agree to the <a href="/privacy-policy" className="text-[#0c0e14] font-black underline decoration-[#FFC107] underline-offset-4">Privacy Policy</a>.
                         </label>
                      </div>

                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-[#0c0e14] text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl hover:bg-[#0c0e14]/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Submit Application <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default JobApplyModal;

