import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, MapPin, Linkedin, Link as LinkIcon, Building2, Globe } from 'lucide-react';
import { enquiriesService } from '../../services/enquiries';

const ContactUs = ({ isOpen, onClose, isModal = false }) => {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchContactInfo();
    }
  }, [isOpen]);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const data = await enquiriesService.getContactInfo();
      setContactInfo(data);
    } catch (error) {
      console.error('Failed to fetch contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const content = (
    <div className="bg-white rounded-[3rem] overflow-hidden flex flex-col h-full max-w-md mx-auto">
      {/* Header */}
      <div className="p-8 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-serif">Contact Us</h2>
          <p className="text-slate-500 font-medium mt-1 text-sm">Get in touch with our team</p>
        </div>
        {isModal && (
          <button
            onClick={handleClose}
            className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
             <div className="w-8 h-8 border-2 border-[#FFC107]/20 border-t-[#FFC107] rounded-full animate-spin"></div>
          </div>
        ) : contactInfo ? (
          <>
            <div className="text-center mb-4">
               <div className="w-20 h-20 bg-[#FFC107]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 size={32} className="text-[#FFC107]" />
               </div>
               <h3 className="text-xl font-black font-serif text-[#0c0e14]">{contactInfo.company_name}.</h3>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Corporate Headquarters</p>
            </div>

            <div className="space-y-4">
               <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#FFC107] shrink-0 border border-slate-100">
                     <Mail size={18} />
                  </div>
                  <div>
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Email Address</p>
                     <a href={`mailto:${contactInfo.email}`} className="text-[#0c0e14] font-bold hover:text-[#FFC107] transition-colors block break-all">
                        {contactInfo.email}
                     </a>
                  </div>
               </div>

               <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#FFC107] shrink-0 border border-slate-100">
                     <Phone size={18} />
                  </div>
                  <div>
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Direct Line</p>
                     <a href={`tel:${contactInfo.phone}`} className="text-[#0c0e14] font-bold hover:text-[#FFC107] transition-colors">
                        {contactInfo.phone}
                     </a>
                  </div>
               </div>

               <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#FFC107] shrink-0 border border-slate-100">
                     <MapPin size={18} />
                  </div>
                  <div>
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Office Location</p>
                     <p className="text-[#0c0e14] font-medium leading-relaxed font-serif italic">
                        {contactInfo.address}
                     </p>
                  </div>
               </div>
            </div>

            {contactInfo.socials && (
               <div className="flex justify-center gap-4 mt-4 pt-8 border-t border-slate-100">
                  {contactInfo.socials.linkedin && (
                     <a href={contactInfo.socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#0077b5] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-blue-200">
                        <Linkedin size={20} />
                     </a>
                  )}
               </div>
            )}
          </>
        ) : (
             <p className="text-center text-slate-500 font-serif italic">Unable to load contact info.</p>
        )}
      </div>

      {/* Footer */}
      <div className="p-8 border-t border-slate-100 flex justify-center flex-shrink-0">
         <button
            onClick={handleClose}
            className="w-full py-5 bg-[#0c0e14] text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-xl hover:bg-[#FFC107] hover:text-[#0c0e14] transition-all"
          >
            Close Window
          </button>
      </div>
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
              className="fixed inset-0 bg-[#0c0e14]/60 backdrop-blur-md z-50"
              onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-transparent z-50 pointer-events-none"
            >
               <div className="pointer-events-auto h-full">
                  {content}
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return content;
};

export default ContactUs;
