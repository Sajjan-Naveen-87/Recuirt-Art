import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, ArrowRight, Sparkles, Shield, Zap, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
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
    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.whatsapp) newErrors.whatsapp = 'WhatsApp number is required';
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
            mobile: formData.whatsapp,
            full_name: formData.fullName,
            password: formData.password,
            confirm_password: formData.confirmPassword
        });
        
        // Redirect to dashboard on success (AuthContext usually sets user)
        navigate('/');
    } catch (err) {
        console.error(err);
        setErrors({ form: err.message });
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
            Join the elite <br/>
            <span className="text-indigo-400">talent network.</span>
          </h2>
          <p className="text-slate-400 font-medium max-w-sm leading-relaxed">
            Create your professional profile and get matched with top global companies.
          </p>
        </div>

        <div className="relative z-10 text-slate-500 text-sm">
          © 2026 Recuirt Art. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] p-10 border border-white relative">
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight mb-3">Create Account</h2>
              <p className="text-slate-500 font-medium">Start your journey with Recuirt Art</p>
            </div>

            {errors.form && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium flex items-center gap-2">
                   <AlertCircle size={18} />
                   {errors.form}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
                <div className="relative">
                   <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                   <input 
                      name="fullName" 
                      value={formData.fullName} 
                      onChange={handleChange} 
                      className="w-full bg-slate-50 border-0 rounded-[2rem] py-4 pl-14 pr-6 font-medium outline-none focus:ring-2 focus:ring-indigo-500" 
                      placeholder="John Doe" 
                   />
                </div>
                {errors.fullName && <p className="text-red-500 text-xs mt-1 ml-4">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email</label>
                <div className="relative">
                   <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                   <input 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className="w-full bg-slate-50 border-0 rounded-[2rem] py-4 pl-14 pr-6 font-medium outline-none focus:ring-2 focus:ring-indigo-500" 
                      placeholder="john@example.com" 
                   />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1 ml-4">{errors.email}</p>}
              </div>

               {/* WhatsApp Field (Mandatory) */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                   WhatsApp Number <span className="text-indigo-500">*</span>
                </label>
                <div className="relative">
                   <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                   <input 
                      name="whatsapp" 
                      value={formData.whatsapp} 
                      onChange={handleChange} 
                      className="w-full bg-slate-50 border-0 rounded-[2rem] py-4 pl-14 pr-6 font-medium outline-none focus:ring-2 focus:ring-indigo-500" 
                      placeholder="+91 98765 43210" 
                   />
                </div>
                {errors.whatsapp && <p className="text-red-500 text-xs mt-1 ml-4">{errors.whatsapp}</p>}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Password</label>
                <div className="relative">
                   <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                   <input 
                      name="password" 
                      type="password" 
                      value={formData.password} 
                      onChange={handleChange} 
                      className="w-full bg-slate-50 border-0 rounded-[2rem] py-4 pl-14 pr-6 font-medium outline-none focus:ring-2 focus:ring-indigo-500" 
                      placeholder="••••••••" 
                   />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1 ml-4">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Confirm Password</label>
                <div className="relative">
                   <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                   <input 
                      name="confirmPassword" 
                      type="password" 
                      value={formData.confirmPassword} 
                      onChange={handleChange} 
                      className="w-full bg-slate-50 border-0 rounded-[2rem] py-4 pl-14 pr-6 font-medium outline-none focus:ring-2 focus:ring-indigo-500" 
                      placeholder="••••••••" 
                   />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-4">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-950 text-white py-4 rounded-[2rem] font-bold text-lg shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 mt-6"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Create Account"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-500 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
