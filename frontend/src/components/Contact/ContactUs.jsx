import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, MapPin, Building2, CheckCircle, AlertCircle, Loader2, Send } from 'lucide-react';
import { enquiriesService } from '../../services/enquiries';

const ContactUs = ({ isOpen, onClose, isModal = false }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    hr_name: '',
    hr_email: '',
    hr_phone: '',
    subject: '',
    message: '',
    hiring_for: '',
    no_of_positions: 1,
    preferred_contact_method: 'email',
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.company_name.trim()) newErrors.company_name = 'Company name is required';
    if (!formData.hr_name.trim()) newErrors.hr_name = 'HR name is required';
    if (!formData.hr_email.trim()) newErrors.hr_email = 'Email is required';
    if (!formData.hr_phone.trim()) newErrors.hr_phone = 'Phone number is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.hr_email && !emailRegex.test(formData.hr_email)) {
      newErrors.hr_email = 'Please enter a valid email address';
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
      await enquiriesService.submitEnquiry(formData);
      setSuccess(true);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to submit enquiry. Please try again.';
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

  const content = (
    <div className="bg-white rounded-[3rem] overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-8 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Contact Us</h2>
          <p className="text-slate-500 font-medium mt-1">Corporate Recruitment Enquiry</p>
        </div>
        {isModal && (
          <button
            onClick={handleClose}
            className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X size={20} />
          </button>
        )}
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
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Enquiry Submitted!</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Thank you for your enquiry. Our team will review your request and get back to you within 24 hours.
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

            {/* Company Info */}
            <div className="bg-indigo-50 rounded-[2rem] p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Building2 size={24} className="text-indigo-600" />
                <h3 className="font-bold text-slate-900">Company Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className={`w-full bg-white border-0 rounded-xl py-3 px-4 font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${
                      errors.company_name ? 'ring-2 ring-red-300' : ''
                    }`}
                    placeholder="Acme Corporation"
                  />
                  {errors.company_name && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.company_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                    HR Contact Name *
                  </label>
                  <input
                    type="text"
                    name="hr_name"
                    value={formData.hr_name}
                    onChange={handleChange}
                    className={`w-full bg-white border-0 rounded-xl py-3 px-4 font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${
                      errors.hr_name ? 'ring-2 ring-red-300' : ''
                    }`}
                    placeholder="John Smith"
                  />
                  {errors.hr_name && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.hr_name}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                    HR Email *
                  </label>
                  <input
                    type="email"
                    name="hr_email"
                    value={formData.hr_email}
                    onChange={handleChange}
                    className={`w-full bg-white border-0 rounded-xl py-3 px-4 font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${
                      errors.hr_email ? 'ring-2 ring-red-300' : ''
                    }`}
                    placeholder="hr@company.com"
                  />
                  {errors.hr_email && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.hr_email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                    HR Phone *
                  </label>
                  <input
                    type="tel"
                    name="hr_phone"
                    value={formData.hr_phone}
                    onChange={handleChange}
                    className={`w-full bg-white border-0 rounded-xl py-3 px-4 font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${
                      errors.hr_phone ? 'ring-2 ring-red-300' : ''
                    }`}
                    placeholder="+1 234 567 8900"
                  />
                  {errors.hr_phone && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.hr_phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Hiring Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Positions to Hire For
                </label>
                <input
                  type="text"
                  name="hiring_for"
                  value={formData.hiring_for}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-5 text-lg font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  placeholder="e.g., Senior Developers"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Number of Positions
                </label>
                <input
                  type="number"
                  name="no_of_positions"
                  value={formData.no_of_positions}
                  onChange={handleChange}
                  min="1"
                  className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-5 text-lg font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  placeholder="1"
                />
              </div>
            </div>

            {/* Subject & Message */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-5 text-lg font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                placeholder="Brief subject of your enquiry"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className={`w-full bg-slate-50 border-0 rounded-2xl py-4 px-5 text-lg font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none ${
                  errors.message ? 'ring-2 ring-red-300' : ''
                }`}
                placeholder="Describe your hiring requirements..."
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.message}</p>
              )}
            </div>

            {/* Contact Preference */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Preferred Contact Method
              </label>
              <div className="flex gap-4">
                {['email', 'phone', 'whatsapp'].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                      formData.preferred_contact_method === method
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="preferred_contact_method"
                      value={method}
                      checked={formData.preferred_contact_method === method}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <span className="font-medium capitalize">{method}</span>
                  </label>
                ))}
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Footer */}
      {!success && (
        <div className="p-8 border-t border-slate-100 flex justify-end gap-4 flex-shrink-0">
          {isModal && (
            <button
              onClick={handleClose}
              className="px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={20} />
                Send Enquiry
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );

  if (isModal) {
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
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl md:max-h-[90vh] bg-white rounded-[3rem] shadow-2xl z-50 overflow-hidden"
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return content;
};

export default ContactUs;

