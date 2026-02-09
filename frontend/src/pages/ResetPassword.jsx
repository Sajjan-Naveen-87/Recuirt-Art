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
            Secure your <br/>
            <span className="text-indigo-400">future.</span>
          </h2>
          <p className="text-slate-400 font-medium max-w-sm leading-relaxed">
            Set a strong password to protect your professional profile.
          </p>
          
          <div className="flex gap-6 pt-4">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                <Shield size={20} />
              </div>
              <span className="text-sm font-medium">Bank-grade Security</span>
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
            
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight mb-3">Reset Password</h2>
              <p className="text-slate-500 font-medium">Enter the OTP sent to your mobile and choose a new password.</p>
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
                 <h3 className="text-lg font-bold text-green-800 mb-1">Password Reset!</h3>
                 <p className="text-green-600 text-sm">Your password has been updated successfully. Redirecting to login...</p>
               </motion.div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="Your mobile number"
                        className="w-full bg-slate-50 border-0 rounded-[2rem] py-5 pl-14 pr-6 text-lg font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                      OTP Code
                    </label>
                    <div className="relative">
                      <Zap className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        className="w-full bg-slate-50 border-0 rounded-[2rem] py-5 pl-14 pr-6 text-lg font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                        required
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border-0 rounded-[2rem] py-5 pl-14 pr-6 text-lg font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                        required
                      />
                    </div>
                  </div>

                   <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border-0 rounded-[2rem] py-5 pl-14 pr-6 text-lg font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                        required
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
                        Reset Password
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

export default ResetPassword;
