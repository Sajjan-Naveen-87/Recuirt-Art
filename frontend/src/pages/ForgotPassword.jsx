import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Shield, Zap, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { authService } from '../services/auth';

function ForgotPassword() {
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrMobile) {
      setError('Please enter your email or mobile number');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.forgotPassword(emailOrMobile);
      setSuccess(true);
      // Determine if input is mobile to guide user
      const isMobile = /^\d+$/.test(emailOrMobile.replace(/\D/g, ''));
      
      // Navigate to reset page after a delay, passing the mobile/email state
      setTimeout(() => {
        navigate('/reset-password', { state: { emailOrMobile } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f4f4f0] font-sans">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#121212] relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#cbd5b1]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <Link to="/" className="w-40 h-12 overflow-hidden flex-shrink-0 flex items-center hover:opacity-90 transition-opacity">
            <img src="/Logo.png" alt="Recruit Art Logo" className="w-full h-full object-contain brightness-150" />
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <h2 className="text-5xl font-serif font-black text-white leading-tight">
            Recover your <br/>
            <span className="text-[#cbd5b1]">access.</span>
          </h2>
          <p className="text-slate-400 font-medium max-w-sm leading-relaxed">
            Secure account recovery protocols to get you back into the healthcare network.
          </p>
          
          <div className="flex gap-6 pt-4">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                <Shield size={20} className="text-[#cbd5b1]" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Secure</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                <Zap size={20} className="text-[#cbd5b1]" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Instant</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-[10px] font-black uppercase tracking-widest">
          © 2026 Recruit Art. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white border border-slate-200/60 rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm p-8 md:p-12 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#cbd5b1]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <Link to="/login" className="absolute top-8 left-8 text-slate-300 hover:text-slate-900 transition-colors z-10">
               <ArrowLeft size={24} />
            </Link>
          
            <div className="mb-10 mt-8">
              <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tight mb-3 text-slate-900 leading-none">Forgot Password?</h2>
              <p className="text-slate-500 font-medium text-sm md:text-base">Enter your credentials to receive a recovery code.</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 rounded-2xl"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            {success ? (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="p-8 bg-[#cbd5b1]/10 border border-[#cbd5b1]/20 rounded-[2rem] text-center mb-6"
               >
                 <div className="w-16 h-16 bg-[#cbd5b1] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#cbd5b1]/20">
                    <CheckCircle className="text-[#121212]" size={32} />
                 </div>
                 <h3 className="text-xl font-serif font-black text-[#121212] mb-1">Code Sent!</h3>
                 <p className="text-slate-600 font-medium italic">Please check your device for the OTP.</p>
               </motion.div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Email or Mobile
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input
                        type="text"
                        value={emailOrMobile}
                        onChange={(e) => setEmailOrMobile(e.target.value)}
                        placeholder="healthcare@pro.com"
                        className="w-full bg-[#f4f4f0] border border-transparent focus:border-[#cbd5b1] focus:bg-white rounded-2xl py-4 md:py-5 pl-14 pr-6 text-lg font-serif font-black placeholder:text-slate-300 transition-all outline-none"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#121212] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#cbd5b1] hover:text-[#121212] transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Send Recovery Code
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
            )}

            <div className="mt-10 text-center pt-8 border-t border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Remember your password?{' '}
                <Link to="/login" className="text-[#121212] border-b border-[#cbd5b1] pb-0.5 ml-1 transition-colors">
                  Login Now
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ForgotPassword;
