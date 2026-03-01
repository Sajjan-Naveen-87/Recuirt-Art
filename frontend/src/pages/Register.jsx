import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Linkedin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '', // Kept for backend compatibility
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.mobile) newErrors.mobile = 'Mobile number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
        await register({
            email: formData.email,
            mobile: formData.mobile,
            full_name: `${formData.firstName} ${formData.lastName}`.trim(),
            password: formData.password,
            confirm_password: formData.confirmPassword
        });
        
        navigate('/dashboard');
    } catch (err) {
        console.error(err);
        setErrors({ form: err.message });
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#f4f4f0] font-sans flex flex-col relative overflow-hidden items-center justify-center p-6 md:p-10">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#cbd5b1]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-200/20 rounded-full blur-3xl -ml-32 -mb-32"></div>

      <div className="w-full max-w-4xl bg-white border border-slate-200/60 p-8 md:p-12 lg:p-16 rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm relative z-10 overflow-hidden">
        <div className="flex justify-center mb-10 md:mb-12">
          <Link to="/" className="w-40 md:w-48 h-10 md:h-12 overflow-hidden flex-shrink-0 flex items-center hover:opacity-90 transition-opacity">
            <img src="/Logo.jpg" alt="Recruit Art Logo" className="w-full h-full object-contain" />
          </Link>
        </div>

        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-serif font-black text-slate-900 mb-4 leading-none">Register Yourself.</h1>
          <p className="text-slate-500 font-medium text-sm md:text-base">Join the healthcare network and find your next craft.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 md:mb-12">
          <button className="flex items-center justify-center gap-3 bg-[#0a66c2]/10 text-[#0a66c2] px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#0a66c2] hover:text-white transition-all w-full shadow-sm">
            <Linkedin size={18} /> LinkedIn
          </button>
          <button className="flex items-center justify-center gap-3 bg-slate-50 text-slate-900 border border-slate-200/60 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all w-full shadow-sm">
            <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google Login
          </button>
        </div>

        {errors.form && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-2xl mx-auto">
             <AlertCircle size={16} />
             {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name*</label>
                <input 
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full bg-[#f4f4f0] text-slate-900 rounded-2xl py-4 px-6 outline-none border border-transparent focus:border-[#cbd5b1] focus:bg-white font-bold transition-all placeholder:text-slate-300"
                />
                {errors.firstName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1 ml-1">{errors.firstName}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name*</label>
                <input 
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full bg-[#f4f4f0] text-slate-900 rounded-2xl py-4 px-6 outline-none border border-transparent focus:border-[#cbd5b1] focus:bg-white font-bold transition-all placeholder:text-slate-300"
                />
                {errors.lastName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1 ml-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email and Mobile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address*</label>
                <input 
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@healthcare.com"
                  className="w-full bg-[#f4f4f0] text-slate-900 rounded-2xl py-4 px-6 outline-none border border-transparent focus:border-[#cbd5b1] focus:bg-white font-bold transition-all placeholder:text-slate-300"
                />
                {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1 ml-1">{errors.email}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number*</label>
                <input 
                  required
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full bg-[#f4f4f0] text-slate-900 rounded-2xl py-4 px-6 outline-none border border-transparent focus:border-[#cbd5b1] focus:bg-white font-bold transition-all placeholder:text-slate-300"
                  placeholder="+91"
                />
                {errors.mobile && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1 ml-1">{errors.mobile}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password*</label>
                <div className="relative">
                  <input 
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-[#f4f4f0] text-slate-900 rounded-2xl py-4 pl-6 pr-14 outline-none border border-transparent focus:border-[#cbd5b1] focus:bg-white font-bold transition-all placeholder:text-slate-300"
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

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password*</label>
                <div className="relative">
                  <input 
                    required
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-[#f4f4f0] text-slate-900 rounded-2xl py-4 px-6 outline-none border border-transparent focus:border-[#cbd5b1] focus:bg-white font-bold transition-all placeholder:text-slate-300"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1 ml-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="flex justify-center pt-8 md:pt-10">
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto md:px-20 bg-[#121212] text-white font-black text-xs uppercase tracking-[0.2em] py-5 px-4 rounded-2xl hover:bg-[#cbd5b1] hover:text-[#121212] transition-all flex justify-center items-center shadow-xl active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
            
            <div className="pt-8 text-center border-t border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 Already have an account?{' '}
                 <Link to="/login" className="text-[#121212] border-b border-[#cbd5b1] pb-0.5 ml-1 hover:text-slate-900 transition-colors">
                   Sign In
                 </Link>
               </p>
             </div>
          </form>
      </div>
    </div>
  );
}

export default Register;
