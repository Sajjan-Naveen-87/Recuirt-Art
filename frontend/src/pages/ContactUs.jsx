import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/Landing/Navbar';
import Footer from '../components/Landing/Footer';

function ContactUs() {
  const [formData, setFormData] = useState({
    enquiryType: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    message: '',
    userType: 'Client' // Default to client
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
          message: combinedMessage,
          subject: formData.enquiryType || 'General Enquiry'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit enquiry');
      }

      setStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully.' });
      setFormData({ 
        enquiryType: '', name: '', email: '', phone: '', company: '', location: '', message: '', userType: 'Client' 
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus({ type: 'error', message: 'Something went wrong. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] font-sans flex flex-col relative overflow-hidden">
      {/* Background Grid Pattern matching the UI */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <Navbar />

      <main className="flex-1 flex flex-col items-center pt-24 pb-32 px-6 relative z-10 w-full max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-20 text-center tracking-wide">
          Drop us a message and say hello.
        </h1>

        {status.message && (
          <div className={`w-full p-4 rounded-xl mb-8 flex items-center gap-3 font-medium ${
            status.type === 'success' ? 'bg-[#cbd5b1]/10 text-[#cbd5b1] border border-[#cbd5b1]/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
             {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
             {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-8">
          
          {/* Row 1: Enquiry Type */}
          <div className="flex flex-col gap-2">
            <label className="text-white font-medium text-[15px]">Enquiry Type *</label>
            <select 
              required
              name="enquiryType"
              value={formData.enquiryType}
              onChange={handleChange}
              className="w-full bg-[#121212] text-white border border-white/20 rounded-full py-3.5 px-6 appearance-none outline-none focus:border-white/50 transition-colors"
            >
              <option value="" disabled className="text-white/50">Select an option</option>
              <option value="Hiring">Hiring / Recruitment</option>
              <option value="Partnership">Partnership</option>
              <option value="Support">General Support</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Row 2: Name */}
          <div className="flex flex-col gap-2">
            <label className="text-white font-medium text-[15px]">Name *</label>
            <input 
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#121212] text-white border border-white/20 rounded-full py-3.5 px-6 outline-none focus:border-white/50 transition-colors"
            />
          </div>

          {/* Row 3: Email and Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-white font-medium text-[15px]">Email address *</label>
              <input 
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#121212] text-white border border-white/20 rounded-full py-3.5 px-6 outline-none focus:border-white/50 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white font-medium text-[15px]">Contact number *</label>
              <input 
                required
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-[#121212] text-white border border-white/20 rounded-full py-3.5 px-6 outline-none focus:border-white/50 transition-colors"
              />
            </div>
          </div>

          {/* Row 4: Company and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-white font-medium text-[15px]">Company name *</label>
              <input 
                required
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full bg-[#121212] text-white border border-white/20 rounded-full py-3.5 px-6 outline-none focus:border-white/50 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white font-medium text-[15px]">Location *</label>
              <select 
                required
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-[#121212] text-white border border-white/20 rounded-full py-3.5 px-6 appearance-none outline-none focus:border-white/50 transition-colors"
              >
                <option value="" disabled>Select a location</option>
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia Pacific">Asia Pacific</option>
                <option value="Global / Other">Global / Other</option>
              </select>
            </div>
          </div>

          {/* Row 5: Message */}
          <div className="flex flex-col gap-2 pt-2">
            <label className="text-white font-medium text-[15px]">Message</label>
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full bg-[#121212] text-white border border-white/20 rounded-[2rem] py-4 px-6 outline-none focus:border-white/50 transition-colors resize-none"
            />
          </div>

          {/* Row 6: User Type Radio Buttons */}
          <div className="flex flex-col gap-4 pt-6">
            <label className="text-white font-medium text-[15px]">Are you a client or a candidate? *</label>
            <div className="flex items-center gap-8">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="radio" 
                    name="userType" 
                    className="sr-only" 
                    checked={formData.userType === 'Client'} 
                    onChange={() => handleRadioChange('Client')} 
                  />
                  <div className={`w-5 h-5 rounded-full border ${formData.userType === 'Client' ? 'border-white bg-white' : 'border-white/40 group-hover:border-white/80'}`}></div>
                </div>
                <span className="text-white">Client</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="radio" 
                    name="userType" 
                    className="sr-only" 
                    checked={formData.userType === 'Candidate'} 
                    onChange={() => handleRadioChange('Candidate')} 
                  />
                  <div className={`w-5 h-5 rounded-full border ${formData.userType === 'Candidate' ? 'border-white bg-white' : 'border-white/40 group-hover:border-white/80'}`}></div>
                </div>
                <span className="text-white">Candidate</span>
              </label>
            </div>
          </div>

          {/* Row 7: Submit Button */}
          <div className="flex justify-center pt-8">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-[#cbd5b1] text-slate-900 font-bold px-12 py-3.5 rounded-full hover:bg-[#b8c2a0] transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {isSubmitting ? (
                 <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
              ) : (
                "Send Message"
              )}
            </button>
          </div>

        </form>
      </main>

      <Footer />
    </div>
  );
}

export default ContactUs;
