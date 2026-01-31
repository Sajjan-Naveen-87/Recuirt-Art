import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Sparkles, Shield, Zap, Check, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const emailInputRef = useRef(null);

  // Load remember me preference
  useEffect(() => {
    const savedRememberMe = localStorage.getItem('remember_me') === 'true';
    setRememberMe(savedRememberMe);
    if (savedRememberMe) {
      const savedEmail = localStorage.getItem('remembered_email');
      if (savedEmail) setEmail(savedEmail);
    }
  }, []);

  // Clear errors when inputs change
  useEffect(() => {
    if (error) clearError();
    setErrors({});
  }, [email, password, error, clearError]);

  const validateEmailForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmailForm()) return;
    
    setIsLoading(true);
    try {
      await login({
        login_type: 'email',
        email: email.toLowerCase(),
        password,
      });
      handleSuccess();
    } catch (err) {
      // Error is handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login for development - skips authentication
  const handleDemoLogin = () => {
    setIsLoading(true);
    
    // Create a mock user for demo purposes
    const mockUser = {
      id: 1,
      email: 'demo@recruirtart.com',
      first_name: 'Demo',
      last_name: 'User',
      role: 'admin'
    };
    
    // Store mock token
    localStorage.setItem('access_token', 'demo_token');
    localStorage.setItem('refresh_token', 'demo_refresh_token');
    localStorage.setItem('remember_me', 'true');
    
    // Navigate after a brief loading animation
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const handleSuccess = () => {
    setSuccess(true);
    
    // Handle remember me
    if (rememberMe) {
      localStorage.setItem('remember_me', 'true');
      localStorage.setItem('remembered_email', email);
    } else {
      localStorage.removeItem('remember_me');
      localStorage.removeItem('remembered_email');
    }

    // Navigate after success animation
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      if (field === 'email' || field === 'password') {
        handleSubmit(e);
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F0F2F5]">
      {/* Left Panel - Branding */}
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
            The elite pipeline <br/>
            <span className="text-indigo-400">is waiting.</span>
          </h2>
          <p className="text-slate-400 font-medium max-w-sm leading-relaxed">
            Synchronized with Recuirt Art RM protocols for seamless hiring management.
          </p>
          
          <div className="flex gap-6 pt-4">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                <Shield size={20} />
              </div>
              <span className="text-sm font-medium">Secure Auth</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                <Zap size={20} />
              </div>
              <span className="text-sm font-medium">Instant Access</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-sm">
          © 2026 Recuirt Art. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Success Animation Overlay */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-2xl rounded-[4rem]"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="text-green-600" size={40} />
                  </motion.div>
                  <h3 className="text-2xl font-black text-slate-900">Welcome back!</h3>
                  <p className="text-slate-500 mt-2">Redirecting to dashboard...</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white/80 backdrop-blur-2xl rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] p-12 border border-white relative">
            <Sparkles className="absolute top-8 right-8 text-indigo-100" size={40} />
            
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight mb-3">Welcome back</h2>
              <p className="text-slate-500 font-medium">Enter your credentials to access your account</p>
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

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input
                    ref={emailInputRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'email')}
                    placeholder="you@example.com"
                    className={`w-full bg-slate-50 border-0 rounded-[2rem] py-5 pl-14 pr-6 text-lg font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none ${
                      errors.email ? 'ring-2 ring-red-300 bg-red-50' : ''
                    }`}
                    required
                  />
                </div>
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-2 ml-4 flex items-center gap-1"
                  >
                    <AlertCircle size={12} />
                    {errors.email}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'password')}
                    placeholder="••••••••"
                    className={`w-full bg-slate-50 border-0 rounded-[2rem] py-5 pl-14 pr-14 text-lg font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none ${
                      errors.password ? 'ring-2 ring-red-300 bg-red-50' : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-2 ml-4 flex items-center gap-1"
                  >
                    <AlertCircle size={12} />
                    {errors.password}
                  </motion.p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-slate-500 group-hover:text-slate-600 transition-colors">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                  Forgot password?
                </Link>
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
                    Sign In
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Demo Login Button */}
            <div className="mt-6">
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              
              <button
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-[2rem] font-bold text-lg shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>🚀</span>
                    Demo Login
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate-400 mt-3">
                Quick access for development and testing
              </p>
            </div>

            <div className="mt-8 text-center">
              <p className="text-slate-500 font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Mobile logo */}
          <div className="lg:hidden mt-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-[2px] w-8 bg-indigo-600 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Recuirt Art</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;

