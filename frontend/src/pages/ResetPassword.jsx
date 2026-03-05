import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, Shield, Zap, AlertCircle, CheckCircle, Smartphone } from 'lucide-react';
import { authService } from '../services/auth';

function ResetPassword() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Pre-fill mobile/email if available from previous step
    if (location.state?.emailOrMobile) {
       // Simple check if it looks like a mobile number
       const input = location.state.emailOrMobile;
       const isMobile = /^\d+$/.test(input.replace(/\D/g, ''));
       if (isMobile) {
          setMobile(input);
       } else {
          // If email was used, we probably need deeper integration or just ask for mobile as the backend OTP flow seems mobile-centric for resets in some views, but let's check.
          // The backend sends OTP to mobile even if email is provided if user has mobile.
          // For simplicity, let's ask for mobile if not clear, or prefill what we have.
           setMobile(input);
       }
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mobile || !otp || !newPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.resetPassword(mobile, otp, newPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. Please check your OTP and try again.');
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
            Secure your <br/>
            <span className="text-[#cbd5b1]">future.</span>
          </h2>
          <p className="text-slate-400 font-medium max-w-sm leading-relaxed">
            Set a strong password to protect your professional profile and career progress.
          </p>
          
          <div className="flex gap-6 pt-4">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                <Shield size={20} className="text-[#cbd5b1]" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Enterprise Security</span>
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
            
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tight mb-3 text-slate-900 leading-none">Reset Password</h2>
              <p className="text-slate-500 font-medium text-sm md:text-base">Enter your verification code to finalize your recovery.</p>
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
                 <h3 className="text-xl font-serif font-black text-[#121212] mb-1">Password Reset!</h3>
                 <p className="text-slate-600 font-medium italic">Redirecting to login secure area...</p>
               </motion.div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="Verified mobile number"
                        className="w-full bg-[#f4f4f0] border border-transparent focus:border-[#cbd5b1] focus:bg-white rounded-2xl py-4 md:py-5 pl-14 pr-6 text-lg font-serif font-black placeholder:text-slate-300 transition-all outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      OTP Code
                    </label>
                    <div className="relative">
                      <Zap className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="6-digit code"
                        className="w-full bg-[#f4f4f0] border border-transparent focus:border-[#cbd5b1] focus:bg-white rounded-2xl py-4 md:py-5 pl-14 pr-6 text-lg font-serif font-black placeholder:text-slate-300 transition-all outline-none"
                        required
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#f4f4f0] border border-transparent focus:border-[#cbd5b1] focus:bg-white rounded-2xl py-4 md:py-5 pl-14 pr-6 text-lg font-serif font-black placeholder:text-slate-300 transition-all outline-none"
                          required
                        />
                      </div>
                    </div>

                     <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Repeat
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#f4f4f0] border border-transparent focus:border-[#cbd5b1] focus:bg-white rounded-2xl py-4 md:py-5 pl-14 pr-6 text-lg font-serif font-black placeholder:text-slate-300 transition-all outline-none"
                          required
                        />
                      </div>
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
                        Reset Password
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
            )}

             <div className="mt-10 text-center pt-8 border-t border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Changed your mind?{' '}
                <Link to="/login" className="text-[#121212] border-b border-[#cbd5b1] pb-0.5 ml-1 transition-colors">
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ResetPassword;
