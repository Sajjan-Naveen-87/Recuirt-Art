import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Users, Calendar, Mail, Phone, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { enquiriesService } from '../../services/enquiries';

const MassHiringModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    hr_name: '',
    hr_email: '',
    hr_phone: '',
    hiring_for: '',
    no_of_positions: '1',
    preferred_contact_method: 'email',
    estimated_start_date: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.company_name.trim()) newErrors.company_name = 'Company Name is required';
    if (!formData.hr_name.trim()) newErrors.hr_name = 'HR Name is required';
    if (!formData.hr_email.trim()) newErrors.hr_email = 'Email is required';
    if (!formData.hr_phone.trim()) newErrors.hr_phone = 'Phone is required';
    if (!formData.hiring_for.trim()) newErrors.hiring_for = 'Hiring For is required';
    if (!formData.message.trim()) newErrors.message = 'Description is required';
    
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
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err) {
      console.error('Mass hiring enquiry error:', err.response?.data);
      const data = err.response?.data;
      let errorMessage = 'Failed to submit inquiry. Please try again.';
      
      if (data && typeof data === 'object') {
        const fieldErrors = Object.entries(data)
          .map(([key, value]) => {
            const msg = Array.isArray(value) ? value.join(', ') : value;
            return `${key}: ${msg}`;
          });
        if (fieldErrors.length > 0) errorMessage = fieldErrors.join(' | ');
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSuccess(false);
      setError('');
      setErrors({});
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-indigo-950/40 backdrop-blur-md z-[100]"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden z-[101] flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                  <Building2 size={28} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 font-serif">Mass Hiring Inquiry</h2>
                  <p className="text-slate-500 font-medium mt-0.5">Scale your team with Recruit Art</p>
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
              {success ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <CheckCircle size={48} className="text-emerald-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-3 font-serif">Thank You!</h3>
                  <p className="text-slate-500 max-w-md mx-auto text-lg leading-relaxed">
                    Our partnership team has received your mass hiring inquiry. We'll reach out to you within 4-6 business hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium flex items-center gap-2">
                      <AlertCircle size={18} />
                      {error}
                    </div>
                  )}

                  {/* Company Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Company Name *</label>
                      <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        className={`w-full bg-slate-50 border-0 rounded-2xl py-4 px-5 text-lg font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${
                          errors.company_name ? 'ring-2 ring-red-300 bg-red-50' : ''
                        }`}
                        placeholder="Acme Corp"
                      />
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Contact Person (HR Name) *</label>
                       <input
                         type="text"
                         name="hr_name"
                         value={formData.hr_name}
                         onChange={handleChange}
                         className={`w-full bg-slate-50 border-0 rounded-2xl py-4 px-5 text-lg font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${
                           errors.hr_name ? 'ring-2 ring-red-300 bg-red-50' : ''
                         }`}
                         placeholder="Jane Smith"
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">HR Email *</label>
                      <input
                        type="email"
                        name="hr_email"
                        value={formData.hr_email}
                        onChange={handleChange}
                        className={`w-full bg-slate-50 border-0 rounded-2xl py-4 px-5 text-lg font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${
                          errors.hr_email ? 'ring-2 ring-red-300 bg-red-50' : ''
                        }`}
                        placeholder="jane@acme.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">HR Phone *</label>
                      <input
                        type="tel"
                        name="hr_phone"
                        value={formData.hr_phone}
                        onChange={handleChange}
                        className={`w-full bg-slate-50 border-0 rounded-2xl py-4 px-5 text-lg font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${
                          errors.hr_phone ? 'ring-2 ring-red-300 bg-red-50' : ''
                        }`}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  {/* Hiring Needs */}
                  <div className="bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                           <Users size={14} className="text-indigo-600" /> Hiring For *
                        </label>
                        <input
                          type="text"
                          name="hiring_for"
                          value={formData.hiring_for}
                          onChange={handleChange}
                          className={`w-full bg-white border border-slate-100 rounded-2xl py-4 px-5 text-lg font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${
                            errors.hiring_for ? 'ring-2 ring-red-300 bg-red-50' : ''
                          }`}
                          placeholder="Java Developers, Sales Execs"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Number of Positions</label>
                        <input
                          type="number"
                          name="no_of_positions"
                          value={formData.no_of_positions}
                          onChange={handleChange}
                          min="1"
                          className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-5 text-lg font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                          <Calendar size={14} className="text-indigo-600" /> Estimated Start Date
                        </label>
                        <input
                          type="date"
                          name="estimated_start_date"
                          value={formData.estimated_start_date}
                          onChange={handleChange}
                          className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-5 text-lg font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Preferred Contact Method</label>
                        <select
                          name="preferred_contact_method"
                          value={formData.preferred_contact_method}
                          onChange={handleChange}
                          className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-5 text-lg font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none"
                        >
                          <option value="email">Email</option>
                          <option value="phone">Phone Call</option>
                          <option value="whatsapp">WhatsApp</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Special Requirements / Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      className={`w-full bg-slate-50 border-0 rounded-2xl py-4 px-5 text-lg font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none ${
                        errors.message ? 'ring-2 ring-red-300 bg-red-50' : ''
                      }`}
                      placeholder="Tell us about your bulk hiring needs..."
                    />
                  </div>
                </form>
              )}
            </div>

            {/* Footer */}
            {!success && (
              <div className="p-8 border-t border-slate-100 flex justify-end gap-5 bg-slate-50/50">
                <button
                  onClick={handleClose}
                  className="px-8 py-4 rounded-2xl font-bold text-slate-600 hover:bg-white hover:shadow-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Hiring Inquiry
                    </>
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

export default MassHiringModal;
