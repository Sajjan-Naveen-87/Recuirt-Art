import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { authService } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';

function EmailVerification() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  
  const { user, checkAuthStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email_verified) {
        navigate('/dashboard'); 
    }
  }, [user, navigate]);

  const handleSendOtp = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await authService.requestEmailVerification();
      setOtpSent(true);
      setSuccess(`Verification code sent to ${user?.email}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send verification email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit code.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await authService.verifyEmailOTP(otp);
      setSuccess('Email verified successfully!');
      
      // Refresh user status
      await checkAuthStatus();
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f0] flex items-center justify-center p-6 md:p-10 font-sans">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#cbd5b1]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-200/20 rounded-full blur-3xl -ml-32 -mb-32"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white border border-slate-200/60 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm relative z-10 overflow-hidden"
      >
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#cbd5b1]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

        <div className="mb-10 text-center">
          <div className="w-20 h-20 bg-[#f4f4f0] rounded-3xl flex items-center justify-center mx-auto mb-6 text-[#cbd5b1] shadow-inner-lg">
            <Mail size={36} />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900 leading-tight mb-3">
            Verify Email.
          </h2>
          <p className="text-slate-500 font-medium text-sm md:text-base italic px-4">
            {user?.email ? `Confirming access for ${user.email}` : 'Security check required to continue.'}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-5 bg-[#cbd5b1]/10 border border-[#cbd5b1]/20 rounded-2xl text-[#121212] text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
          >
            <CheckCircle size={18} className="text-[#cbd5b1]" />
            {success}
          </motion.div>
        )}

        {!otpSent ? (
          <div className="space-y-8">
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] text-center leading-relaxed">
              Click below to initiate the secure verification protocol for your account.
            </p>
            <button
              onClick={handleSendOtp}
              disabled={isLoading}
              className="w-full bg-[#121212] text-white py-5 px-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-[#cbd5b1] hover:text-[#121212] transition-all flex justify-center items-center gap-3 disabled:opacity-50 active:scale-[0.98]"
            >
              {isLoading ? <Loader className="animate-spin" size={18} /> : (
                <>Send Secure Code <ArrowRight size={16} /></>
              )}
            </button>
          </div>
        ) : (
          <form className="space-y-8" onSubmit={handleVerifyOtp}>
            <div className="space-y-3">
              <label htmlFor="otp" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Security Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-300" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  className="w-full bg-[#f4f4f0] border border-transparent focus:border-[#cbd5b1] focus:bg-white rounded-2xl py-4 md:py-5 pl-14 pr-6 text-xl md:text-2xl font-serif font-black placeholder:text-slate-200 transition-all outline-none text-center tracking-[0.5em]"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#121212] text-white py-5 px-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-[#cbd5b1] hover:text-[#121212] transition-all flex justify-center items-center gap-3 disabled:opacity-50 active:scale-[0.98]"
              >
                 {isLoading ? <Loader className="animate-spin" size={18} /> : 'Finalize Verification'}
              </button>
              
              <div className="text-center pt-2">
                <button 
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#121212] transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                  Code not received? <span className="text-[#cbd5b1] border-b border-[#cbd5b1] pb-0.5">Resend</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default EmailVerification;
