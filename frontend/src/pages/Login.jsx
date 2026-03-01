import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const emailInputRef = useRef(null);

  const validateForm = () => {
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
    if (error) clearError();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await login({
        login_type: 'email',
        email: email.toLowerCase(),
        password,
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f0] flex items-center justify-center p-6 md:p-10 font-sans">
      <div className="w-full max-w-lg bg-white border border-slate-200/60 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#cbd5b1]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className="relative z-10">
          <div className="flex justify-center mb-10 md:mb-12">
            <Link to="/" className="w-36 md:w-40 h-10 md:h-12 overflow-hidden flex-shrink-0 flex items-center hover:opacity-90 transition-opacity">
              <img src="/Logo.jpg" alt="Recruit Art Logo" className="w-full h-full object-contain" />
            </Link>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-black text-slate-900 mb-8 md:mb-10 tracking-tight leading-none">Sign In.</h1>

          {(error || errors.form) && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-black uppercase tracking-widest flex items-center gap-2 rounded-2xl">
              <AlertCircle size={16} />
              {error || errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input
                ref={emailInputRef}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="name@healthcare.com"
                className="w-full bg-[#f4f4f0] border border-transparent focus:border-[#cbd5b1] focus:bg-white outline-none px-6 py-4 rounded-2xl text-slate-900 font-bold transition-all placeholder:text-slate-300"
                required
              />
              {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1 ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  placeholder="••••••••"
                  className="w-full bg-[#f4f4f0] border border-transparent focus:border-[#cbd5b1] focus:bg-white outline-none pl-6 pr-14 py-4 rounded-2xl text-slate-900 font-bold transition-all placeholder:text-slate-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1 ml-1">{errors.password}</p>}
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <Link to="/forgot-password" size="sm" className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-[#121212] transition-colors inline-block w-fit">
                Forgot password?
              </Link>
            </div>

            <div className="space-y-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#121212] text-white font-black text-xs uppercase tracking-[0.2em] py-5 px-4 rounded-2xl hover:bg-[#cbd5b1] hover:text-[#121212] transition-all flex justify-center items-center shadow-xl active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Login"
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full bg-[#f4f4f0] text-slate-500 font-black text-xs uppercase tracking-[0.2em] py-5 px-4 rounded-2xl hover:bg-white hover:text-slate-900 transition-all border border-slate-200/40"
              >
                Cancel
              </button>
            </div>

            <div className="pt-8 text-center border-t border-slate-100">
              <Link to="/register" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#121212] transition-colors">
                Don't have an account? <span className="text-[#121212] border-b border-[#cbd5b1] pb-0.5 ml-1">Register Now</span>
              </Link>
            </div>
          </form>
        </div>

        <div className="border-t border-slate-200 mt-8 pt-8">
          <div className="flex justify-center items-center gap-10">
            {/* Google Icon SVG */}
            <button className="text-black hover:text-slate-700 transition-colors">
              <svg viewBox="0 0 24 24" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
              </svg>
            </button>
            {/* LinkedIn Icon SVG */}
            <button className="text-black hover:text-slate-700 transition-colors">
              <svg viewBox="0 0 24 24" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
                 <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
