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
            className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-5xl md:max-h-[95vh] bg-white md:rounded-[1rem] shadow-2xl overflow-hidden z-[101] flex flex-col border-[3px] border-blue-500"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
               <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                 Fill your job information for {job.title} 
                 <span className="flex items-center gap-1 text-slate-500 font-normal text-lg ml-2">
                   <MapPin size={18} className="text-blue-600" /> {job.location}
                 </span>
               </h2>
               <button
                 onClick={handleClose}
                 className="text-slate-400 hover:text-slate-900 transition-colors"
               >
                 <X size={24} />
               </button>
            </div>

            {/* Job Summary Banner */}
            <div className="px-8 py-4 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-700">{job.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-700">{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <IndianRupee size={16} className="text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-700">{job.salary_range || 'Negotiable'}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle size={40} className="text-green-500" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Application Submitted!</h3>
                  <p className="text-lg text-slate-500">Your information has been successfully shared with the recruitment team.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm flex items-center gap-3">
                      <AlertCircle size={20} />
                      {error}
                    </div>
                  )}

                  {/* 3-Column Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
                    {/* Conditional other job fields removed by user */}

                    {/* Name */}
                    <div className="space-y-1">
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className={`w-full border border-slate-300 rounded-md py-2.5 px-4 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.full_name ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="Name *"
                      />
                    </div>

                    {/* Mobile No */}
                    <div className="space-y-1">
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className={`w-full border border-slate-300 rounded-md py-2.5 px-4 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.mobile ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="Mobile No *"
                      />
                    </div>

                    {/* Alternative Mobile No */}
                    <div className="space-y-1">
                      <input
                        type="tel"
                        name="alternative_mobile"
                        value={formData.alternative_mobile}
                        onChange={handleChange}
                        className="w-full border border-slate-300 rounded-md py-2.5 px-4 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Alternative Mobile No."
                      />
                    </div>

                    {/* Email ID */}
                    <div className="space-y-1">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full border border-slate-300 rounded-md py-2.5 px-4 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.email ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="Email ID *"
                      />
                    </div>

                    {/* Job Designation */}
                    <div className="space-y-1">
                      <input
                        type="text"
                        name="preferred_job_designation"
                        value={formData.preferred_job_designation}
                        onChange={handleChange}
                        className={`w-full border border-slate-300 rounded-md py-2.5 px-4 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.preferred_job_designation ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="Preferred Job Designation *"
                      />
                    </div>

                    {/* Job Location */}
                    <div className="space-y-1">
                      <input
                        type="text"
                        name="preferred_job_location"
                        value={formData.preferred_job_location}
                        onChange={handleChange}
                        className={`w-full border border-slate-300 rounded-md py-2.5 px-4 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.preferred_job_location ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="Preferred Job Location *"
                      />
                    </div>

                    {/* Expected Salary */}
                    <div className="space-y-1">
                      <select
                        name="expected_salary"
                        value={formData.expected_salary}
                        onChange={handleChange}
                        className={`w-full border border-slate-300 rounded-md py-2.5 px-4 text-slate-700 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.expected_salary ? 'border-red-500 bg-red-50' : ''}`}
                      >
                        <option value="" disabled>Current Salary per Month (₹)*</option>
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
                      <input
                        type="text"
                        name="join_after"
                        value={formData.join_after}
                        onChange={handleChange}
                        className={`w-full border border-slate-300 rounded-md py-2.5 px-4 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.join_after ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="Available to join after (Days or Month)"
                      />
                    </div>

                    {/* Total Experience */}
                    <div className="space-y-1">
                      <select
                        name="total_experience"
                        value={formData.total_experience}
                        onChange={handleChange}
                        className={`w-full border border-slate-300 rounded-md py-2.5 px-4 text-slate-700 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.total_experience ? 'border-red-500 bg-red-50' : ''}`}
                      >
                        <option value="" disabled>Total Work Experience</option>
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
                  <div className="space-y-1 pt-4">
                    <textarea
                      name="cover_letter"
                      value={formData.cover_letter}
                      onChange={handleChange}
                      rows="4"
                      className="w-full border border-slate-300 rounded-md py-3 px-4 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                      placeholder="Your message (Max 200 Words)"
                    />
                  </div>

                  {/* Footer Flow */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between pt-6 gap-6">
                    {/* Resume Upload */}
                    <div className="flex flex-col gap-2">
                       <p className="text-[12px] text-slate-500">Max File Size: 2 MB, File type: jpg, jpeg, png, gif, pdf</p>
                       <div className="flex items-center gap-2">
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
                            className={`flex items-center gap-2 px-4 py-2 border rounded cursor-pointer hover:bg-slate-50 transition-colors ${errors.resume ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                          >
                             <span className="bg-slate-100 px-3 py-1 border border-slate-300 rounded text-sm text-slate-700">Choose File</span>
                             <span className="text-sm text-slate-500 truncate max-w-[150px]">
                               {formData.resume ? formData.resume.name : 'No file chosen'}
                             </span>
                          </label>
                       </div>
                    </div>

                    {/* Privacy Policy */}
                    <div className="flex items-center gap-3">
                       <input
                         type="checkbox"
                         name="agree_to_policy"
                         id="agree_to_policy"
                         checked={formData.agree_to_policy}
                         onChange={handleChange}
                         className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                       />
                       <label htmlFor="agree_to_policy" className="text-sm text-slate-600">
                         By submitting this form, I agree to Inspire's One <a href="/privacy-policy" className="underline decoration-slate-400 underline-offset-4">privacy policy</a>.
                       </label>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="bg-blue-600 text-white px-10 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Submitting...' : 'Submit'}
                    </button>
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

