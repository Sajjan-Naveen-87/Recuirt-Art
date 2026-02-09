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
    <div className="min-h-screen flex bg-[#F0F2F5]">
      {/* Left Panel - Branding (Same as Login) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-[2px] w-8 bg-indigo-500 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Recuirt Art</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white lowercase">Recuirt.</h1>
        </div>

        <div className="relative z-10 space-y-8">
          <h2 className="text-4xl font-black text-white leading-tight">
            Recover your <br/>
            <span className="text-indigo-400">access.</span>
          </h2>
          <p className="text-slate-400 font-medium max-w-sm leading-relaxed">
            Secure account recovery protocols to get you back on track.
          </p>
          
          <div className="flex gap-6 pt-4">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                <Shield size={20} />
              </div>
              <span className="text-sm font-medium">Secure Recovery</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                <Zap size={20} />
              </div>
              <span className="text-sm font-medium">Instant OTP</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-sm">
          © 2026 Recuirt Art. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-2xl rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] p-12 border border-white relative">
            <Link to="/login" className="absolute top-8 left-8 text-slate-400 hover:text-slate-600 transition-colors">
               <ArrowLeft size={24} />
            </Link>
          
            <div className="mb-8 mt-6">
              <h2 className="text-3xl font-black tracking-tight mb-3">Forgot Password?</h2>
              <p className="text-slate-500 font-medium">Enter your email or mobile number to receive a recovery code.</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium flex items-center gap-2"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            {success ? (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="p-6 bg-green-50 border border-green-100 rounded-2xl text-center mb-6"
               >
                 <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="text-green-600" size={24} />
                 </div>
                 <h3 className="text-lg font-bold text-green-800 mb-1">Code Sent!</h3>
                 <p className="text-green-600 text-sm">Please check your email or mobile for the OTP.</p>
               </motion.div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                      Email or Mobile
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input
                        type="text"
                        value={emailOrMobile}
                        onChange={(e) => setEmailOrMobile(e.target.value)}
                        placeholder="you@example.com or 9876543210"
                        className="w-full bg-slate-50 border-0 rounded-[2rem] py-5 pl-14 pr-6 text-lg font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-950 text-white py-5 rounded-[2rem] font-bold text-lg shadow-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Send Recovery Code
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </form>
            )}

            <div className="mt-8 text-center">
              <p className="text-slate-500 font-medium">
                Remember your password?{' '}
                <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                  Login
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
