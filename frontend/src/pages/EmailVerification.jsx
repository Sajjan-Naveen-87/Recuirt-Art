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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Verify your Email
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {user?.email ? `We need to verify ${user.email} before you continue.` : 'Please verify your email address.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 border border-red-100 rounded-md text-red-600 text-sm flex items-center gap-2"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-green-50 border border-green-100 rounded-md text-green-600 text-sm flex items-center gap-2"
            >
                <CheckCircle size={18} />
                {success}
            </motion.div>
          )}

          {!otpSent ? (
            <div className="space-y-6">
                <p className="text-sm text-slate-500 text-center">
                    Click the button below to receive a verification code.
                </p>
                <button
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isLoading ? <Loader className="animate-spin" size={20} /> : 'Send Verification Code'}
                </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-slate-700">
                  Verification Code
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    name="otp"
                    id="otp"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-3"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                   {isLoading ? <Loader className="animate-spin" size={20} /> : 'Verify Email'}
                </button>
              </div>
              
              <div className="text-center">
                    <button 
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isLoading}
                        className="text-xs text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                        Resend Code
                    </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;
