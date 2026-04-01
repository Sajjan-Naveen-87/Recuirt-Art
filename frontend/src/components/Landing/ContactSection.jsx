import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

function ContactSection() {
  const [formData, setFormData] = useState({
    enquiryType: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    message: '',
    userType: 'Client', // Default to client
    no_of_requirements: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRadioChange = (type) => {
    setFormData({ ...formData, userType: type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    // Format the message to include extra fields not directly mapped to the DB schema
    const combinedMessage = `
[ENQUIRY TYPE]: ${formData.enquiryType || 'General'}
[LOCATION]: ${formData.location || 'Not provided'}
[USER TYPE]: ${formData.userType}

[MESSAGE]:
${formData.message || 'No additional message.'}
    `.trim();

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/enquiries/enquiry/submit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_name: formData.company || 'Not Provided',
          hr_name: formData.name,
          hr_email: formData.email,
          hr_phone: formData.phone,
          no_of_positions: formData.no_of_requirements || 1,
          message: combinedMessage,
          subject: formData.enquiryType || 'General Enquiry'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit enquiry');
      }

      setStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully.' });
      setFormData({ 
        enquiryType: '', name: '', email: '', phone: '', company: '', location: '', message: '', userType: 'Client', no_of_requirements: '' 
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus({ type: 'error', message: 'Something went wrong. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#0c0e14] relative overflow-hidden scroll-mt-20">
      <div className="flex flex-col items-center px-6 relative z-10 w-full max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-20 text-center tracking-tight">
          Let us know <span className="text-[#FFC107]">Your Requirements</span>
        </h2>

        {status.message && (
          <div className={`w-full p-4 rounded-xl mb-8 flex items-center gap-3 font-black uppercase tracking-widest text-[10px] ${
            status.type === 'success' ? 'bg-[#FFC107]/10 text-[#FFC107] border border-[#FFC107]/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
             {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
             {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-8">
          
          {/* Row 1: Enquiry Type */}
          <div className="flex flex-col gap-2">
            <label className="text-white font-black uppercase tracking-widest text-[10px]">Enquiry Type *</label>
            <select 
              required
              name="enquiryType"
              value={formData.enquiryType}
              onChange={handleChange}
              className="w-full bg-white/5 text-white border border-white/10 rounded-full py-4 px-8 appearance-none outline-none focus:border-[#FFC107]/50 transition-colors font-serif font-black text-lg"
            >
              <option value="" disabled className="bg-[#0c0e14] text-white/50">Select an option</option>
              <option value="Hiring" className="bg-[#0c0e14]">Hiring / Recruitment</option>
              <option value="Partnership" className="bg-[#0c0e14]">Partnership</option>
              <option value="Other" className="bg-[#0c0e14]">Other Enquiry</option>
            </select>
          </div>

          {/* Row 2: Name and Number of Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-white font-black uppercase tracking-widest text-[10px]">Name *</label>
              <input 
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white/5 text-white border border-white/10 rounded-full py-4 px-8 outline-none focus:border-[#FFC107]/50 transition-colors font-serif font-black text-lg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white font-black uppercase tracking-widest text-[10px]">Positions *</label>
              <input 
                required
                type="number"
                name="no_of_requirements"
                value={formData.no_of_requirements}
                onChange={handleChange}
                min="1"
                className="w-full bg-white/5 text-white border border-white/10 rounded-full py-4 px-8 outline-none focus:border-[#FFC107]/50 transition-colors font-serif font-black text-lg"
                placeholder="e.g. 5"
              />
            </div>
          </div>

          {/* Row 3: Email and Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-white font-black uppercase tracking-widest text-[10px]">Email address *</label>
              <input 
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/5 text-white border border-white/10 rounded-full py-4 px-8 outline-none focus:border-[#FFC107]/50 transition-colors font-serif font-black text-lg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white font-black uppercase tracking-widest text-[10px]">Contact number *</label>
              <input 
                required
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-white/5 text-white border border-white/10 rounded-full py-4 px-8 outline-none focus:border-[#FFC107]/50 transition-colors font-serif font-black text-lg"
              />
            </div>
          </div>

          {/* Row 4: Company and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-white font-black uppercase tracking-widest text-[10px]">Company name *</label>
              <input 
                required
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full bg-white/5 text-white border border-white/10 rounded-full py-4 px-8 outline-none focus:border-[#FFC107]/50 transition-colors font-serif font-black text-lg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white font-black uppercase tracking-widest text-[10px]">Location *</label>
              <input 
                required
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State, Country"
                className="w-full bg-white/5 text-white border border-white/10 rounded-full py-4 px-8 outline-none focus:border-[#FFC107]/50 transition-colors font-serif font-black text-lg"
              />
            </div>
          </div>

          {/* Row 5: Message */}
          <div className="flex flex-col gap-2 pt-2">
            <label className="text-white font-black uppercase tracking-widest text-[10px]">Message</label>
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full bg-white/5 text-white border border-white/10 rounded-[2.5rem] py-6 px-8 outline-none focus:border-[#FFC107]/50 transition-colors resize-none font-serif font-black text-lg"
            />
          </div>

          {/* Row 7: Submit Button */}
          <div className="flex justify-center pt-8">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-[#FFC107] text-[#0c0e14] font-black uppercase tracking-[0.2em] text-sm px-16 py-5 rounded-full hover:scale-105 transition-all disabled:opacity-70 flex items-center justify-center min-w-[200px] shadow-2xl shadow-[#FFC107]/10"
            >
              {isSubmitting ? (
                 <div className="w-5 h-5 border-2 border-[#0c0e14]/30 border-t-[#0c0e14] rounded-full animate-spin" />
              ) : (
                "Send Message"
              )}
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}

export default ContactSection;
