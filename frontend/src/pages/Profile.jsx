import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Camera, FileText, Edit3, Save, X, Briefcase, Link as LinkIcon, Mail, Phone, Calendar, Upload, AlertCircle, Linkedin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import profileService from '../services/profile';
import ApplicationsList from '../components/ApplicationsList';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', current_position: '', linkedin_url: '', portfolio_url: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileService.getProfile();
      setProfile(response.user);
      if (updateUser) updateUser(response.user);
      setApplications(response.applications || []);
      setFormData({
        full_name: response.user.full_name || '',
        current_position: response.user.current_position || '',
        linkedin_url: response.user.linkedin_url || '',
        portfolio_url: response.user.portfolio_url || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const result = await profileService.updateProfile(formData);
      const updatedProfile = result.user || result;
      setProfile(updatedProfile);
      if (updateUser) updateUser(updatedProfile);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error);
      alert('Failed to update profile: ' + JSON.stringify(error.response?.data || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="h-12 w-12 border-4 border-[#cbd5b1] border-t-transparent rounded-full" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-16 md:pb-20 px-6 md:px-8 lg:px-16 pt-6 md:pt-8">
      {/* Profile Header Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start">
        
        {/* Left Column: Profile Snapshot */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60 relative overflow-hidden"
          >
            {/* Subtle background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#cbd5b1]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="relative group mb-6">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border-4 border-[#f4f4f0] shadow-lg bg-slate-100 flex items-center justify-center">
                  {profile?.profile_image ? (
                    <img 
                      src={profile.profile_image.startsWith('http') ? profile.profile_image : `${import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'}${profile.profile_image}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={40} md:size={48} className="text-slate-300" />
                  )}
                </div>
                
                <button 
                  onClick={() => document.getElementById('profile-image-upload').click()}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-[#121212] text-[#cbd5b1] rounded-xl flex items-center justify-center border-2 border-white shadow-lg hover:scale-110 transition-transform cursor-pointer"
                >
                  <Camera size={18} />
                </button>
                <input 
                  type="file" 
                  id="profile-image-upload" 
                  accept="image/*" 
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if(!file) return;
                    const data = new FormData();
                    data.append('profile_image', file);
                    try {
                      await profileService.updateProfile(data);
                      fetchProfile();
                    } catch(err) {
                      console.error('Image upload failed', err);
                    }
                  }}
                />
              </div>

              <h2 className="text-2xl md:text-3xl font-serif font-black text-slate-900 mb-1 leading-tight">
                {profile?.full_name || 'User'}
              </h2>
              <p className="text-slate-500 text-sm md:text-base font-medium mb-6 md:mb-8">
                {profile?.current_position || 'Open to Opportunities'}
              </p>

              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-4 p-4 bg-[#f4f4f0] rounded-2xl border border-slate-200/50 overflow-hidden">
                  <div className="w-10 h-10 bg-[#121212] rounded-lg flex items-center justify-center text-[#cbd5b1] flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                    <p className="text-xs md:text-sm font-bold text-slate-700 truncate">{profile?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-[#f4f4f0] rounded-2xl border border-slate-200/50 overflow-hidden">
                  <div className="w-10 h-10 bg-[#121212] rounded-lg flex items-center justify-center text-[#cbd5b1] flex-shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                    <p className="text-xs md:text-sm font-bold text-slate-700">{profile?.mobile || 'Not set'}</p>
                  </div>
                </div>
              </div>

              <div className="w-full mt-8">
                {!editing ? (
                  <button 
                    onClick={() => setEditing(true)}
                    className="w-full py-4 bg-[#121212] text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10 transition-transform active:scale-[0.98]"
                  >
                    <Edit3 size={18} /> Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button 
                      onClick={handleUpdateProfile}
                      className="flex-1 py-4 bg-[#cbd5b1] text-[#121212] rounded-2xl font-bold hover:bg-[#b8c2a0] transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Save size={18} /> Save
                    </button>
                    <button 
                      onClick={() => setEditing(false)}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#121212] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
            <div className="relative z-10 grid grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1">
                <p className="text-3xl md:text-4xl font-serif font-black text-[#cbd5b1]">{applications.length}</p>
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-50">Total Applications</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl md:text-4xl font-serif font-black text-[#cbd5b1]">
                  {applications.filter(a => ['accepted', 'interview'].includes(a.status)).length}
                </p>
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-50">Active Processes</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Detailed Forms and Lists */}
        <div className="lg:col-span-8 space-y-8">
          
          <AnimatePresence mode="wait">
            {editing ? (
              <motion.div 
                key="edit"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-200/60 transition-all"
              >
                <h3 className="text-xl md:text-2xl font-serif font-black text-slate-900 mb-6 md:mb-8 flex items-center gap-3">
                  <Edit3 className="text-[#cbd5b1]" size={20} md:size={24} /> Edit Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full bg-[#f4f4f0] p-3.5 md:p-4 rounded-xl font-bold text-slate-800 border border-transparent focus:border-[#cbd5b1] focus:bg-white outline-none transition-all text-sm md:text-base"
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Position</label>
                    <input
                      type="text"
                      className="w-full bg-[#f4f4f0] p-3.5 md:p-4 rounded-xl font-bold text-slate-800 border border-transparent focus:border-[#cbd5b1] focus:bg-white outline-none transition-all text-sm md:text-base"
                      value={formData.current_position}
                      placeholder="e.g. Senior Product Manager"
                      onChange={(e) => setFormData({...formData, current_position: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">LinkedIn URL</label>
                    <input
                      type="url"
                      className="w-full bg-[#f4f4f0] p-3.5 md:p-4 rounded-xl font-bold text-slate-800 border border-transparent focus:border-[#cbd5b1] focus:bg-white outline-none transition-all text-sm md:text-base"
                      value={formData.linkedin_url}
                      placeholder="https://linkedin.com/in/..."
                      onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Portfolio URL</label>
                    <input
                      type="url"
                      className="w-full bg-[#f4f4f0] p-3.5 md:p-4 rounded-xl font-bold text-slate-800 border border-transparent focus:border-[#cbd5b1] focus:bg-white outline-none transition-all text-sm md:text-base"
                      value={formData.portfolio_url}
                      placeholder="https://yourportfolio.com"
                      onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Professional Links */}
                <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-200/60">
                  <h3 className="text-xl md:text-2xl font-serif font-black text-slate-900 mb-6 md:mb-8 flex items-center gap-3">
                    <Briefcase className="text-[#cbd5b1]" size={20} md:size={24} /> Professional Presence
                  </h3>
                  
                  <div className="flex flex-col md:flex-row flex-wrap gap-4 md:gap-6">
                    {profile?.linkedin_url ? (
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-[#f4f4f0] p-4 rounded-2xl border border-slate-200/50 hover:bg-[#cbd5b1]/20 transition-all group">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0077b5] text-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                          <Linkedin size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connect</p>
                          <p className="text-xs md:text-sm font-black text-slate-800">LinkedIn Profile</p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 bg-[#f4f4f0] p-4 rounded-2xl border border-dashed border-slate-300 opacity-60">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-300 text-white rounded-xl flex items-center justify-center">
                          <AlertCircle size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Not Added</p>
                          <p className="text-xs md:text-sm font-black text-slate-500">LinkedIn Profile</p>
                        </div>
                      </div>
                    )}

                    {profile?.portfolio_url ? (
                      <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-[#f4f4f0] p-4 rounded-2xl border border-slate-200/50 hover:bg-[#cbd5b1]/20 transition-all group">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#121212] text-[#cbd5b1] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                          <LinkIcon size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">View Work</p>
                          <p className="text-xs md:text-sm font-black text-slate-800">Portfolio</p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 bg-[#f4f4f0] p-4 rounded-2xl border border-dashed border-slate-300 opacity-60">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-300 text-white rounded-xl flex items-center justify-center">
                          <AlertCircle size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Not Added</p>
                          <p className="text-xs md:text-sm font-black text-slate-500">Portfolio</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Resume Card */}
                <div className="bg-[#cbd5b1] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden group border border-[#b8c2a0]">
                  <div className="relative z-10 flex-1 w-full text-center lg:text-left">
                    <h3 className="text-2xl md:text-3xl font-serif font-black text-[#121212] mb-3 flex items-center justify-center lg:justify-start gap-3">
                      <FileText size={24} md:size={28} /> Career Resume
                    </h3>
                    <p className="text-[#121212]/70 font-medium max-w-md mb-6 md:mb-8 leading-relaxed mx-auto lg:mx-0 text-sm md:text-base">
                      Download your latest CV or update it for recruiters. We recommend PDF formats for compatibility.
                    </p>
                    
                    <div className="flex flex-col md:flex-row flex-wrap gap-3 md:gap-4 justify-center lg:justify-start">
                      {profile?.resume && (
                        <a 
                          href={profile.resume.startsWith('http') ? profile.resume : `${import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'}${profile.resume}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-6 md:px-8 py-3.5 md:py-4 bg-[#121212] text-white rounded-xl md:rounded-2xl font-black hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-3 text-xs md:text-sm uppercase tracking-widest"
                        >
                          View Current
                        </a>
                      )}
                      <div>
                        <input
                          type="file"
                          id="resume-main-upload"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if(!file) return;
                            const data = new FormData();
                            data.append('resume', file);
                            try {
                              await profileService.updateProfile(data);
                              fetchProfile();
                            } catch(err) {
                              console.error("Resume upload failed", err);
                            }
                          }}
                        />
                        <label 
                          htmlFor="resume-main-upload" 
                          className="cursor-pointer px-6 md:px-8 py-3.5 md:py-4 bg-white text-[#121212] rounded-xl md:rounded-2xl font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-md border border-black/5 text-xs md:text-sm uppercase tracking-widest w-full md:w-auto"
                        >
                          <Upload size={18} /> {profile?.resume ? 'Update File' : 'Upload Resume'}
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Visual Decoration */}
                  <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white/20 rounded-3xl flex items-center justify-center p-6 backdrop-blur-sm transform rotate-6 border border-white/30 transition-transform group-hover:rotate-12 duration-500 lg:block hidden">
                    <FileText size={60} md:size={80} className="text-[#121212]/50" />
                  </div>
                </div>

                {/* Application History */}
                <div className="space-y-6 md:space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-slate-200"></div>
                    <h3 className="text-xl md:text-2xl font-serif font-black text-slate-900 tracking-tight">Application Journey</h3>
                    <div className="h-px flex-1 bg-slate-200"></div>
                  </div>
                  
                  <div className="-mx-4 md:mx-0">
                    <ApplicationsList applications={applications} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

export default Profile;
