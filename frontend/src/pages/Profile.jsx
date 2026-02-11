import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Camera, FileText, Edit3, Save, X, Briefcase, Link as LinkIcon, Mail, Phone, Calendar, Upload, AlertCircle } from 'lucide-react';
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
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Banner */}
      <div className="h-64 bg-gradient-to-r from-indigo-900 to-violet-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        {/* Overlay Stats Header */}
        <div className="absolute inset-x-0 bottom-0 top-0 flex items-end justify-center pb-24 z-10">
          <div className="flex gap-8 text-white/90">
             <div className="text-center">
                <p className="text-4xl font-black">{applications.length}</p>
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">Applications</p>
             </div>
             <div className="w-px bg-white/20 h-10 self-center"></div>
             <div className="text-center">
                <p className="text-4xl font-black">{applications.filter(a => a.status === 'accepted' || a.status === 'interview').length}</p>
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">Active</p>
             </div>
             <div className="w-px bg-white/20 h-10 self-center"></div>
             <div className="text-center">
                <p className="text-4xl font-black">{applications.filter(a => a.status === 'accepted').length}</p>
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">Offers</p>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-20">
        <div className="flex gap-10 items-start">
          
          {/* Left Column: Profile Snapshot */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-indigo-900/5 border border-slate-100 text-center relative">
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="w-32 h-32 mx-auto bg-slate-100 rounded-[2rem] -mt-16 mb-4 relative z-10 border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center transform"
              >
                {profile?.profile_image ? (
                   <img 
                      src={profile.profile_image.startsWith('http') ? profile.profile_image : `http://localhost:8000${profile.profile_image}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                   />
                ) : (
                   <User size={48} className="text-slate-300" />
                )}
                
                {/* Formatting camera icon to appear on hover/always */}
                <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                     onClick={() => document.getElementById('profile-image-upload').click()}>
                   <Camera className="text-white drop-shadow-lg" size={32} />
                </div>
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
                           fetchProfile(); // Refresh to show new image
                       } catch(err) {
                           console.error('Image upload failed', err);
                           alert('Failed to upload image');
                       }
                   }}
                />
              </motion.div>
              
              <h2 className="text-2xl font-black text-slate-900 mb-1">{profile?.full_name || 'User'}</h2>
              <p className="text-sm font-bold text-slate-400 mb-6">{profile?.current_position || ''}</p>

              <div className="space-y-3 text-left">
                 <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Mail size={16} className="text-indigo-500" />
                    <div className="overflow-hidden">
                       <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                       <p className="text-sm font-bold text-slate-700 truncate">{profile?.email}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Phone size={16} className="text-indigo-500" />
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase">Mobile</p>
                       <p className="text-sm font-bold text-slate-700">{profile?.mobile}</p>
                    </div>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                 {!editing ? (
                    <button 
                      onClick={() => setEditing(true)}
                      className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit3 size={18} /> Edit Profile
                    </button>
                 ) : (
                    <div className="flex gap-2">
                       <button 
                         onClick={handleUpdateProfile}
                         className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
                       >
                         Save
                       </button>
                       <button 
                         onClick={() => setEditing(false)}
                         className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                       >
                         Cancel
                       </button>
                    </div>
                 )}
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="flex-1 space-y-8 pt-12">
            
            {/* Edit Form or View Mode */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-lg shadow-indigo-900/5 border border-slate-100">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Briefcase className="text-indigo-500" size={20} /> Professional Details
                  </h3>
               </div>

               {editing ? (
                   <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label>
                         <input
                           type="text"
                           value={formData.full_name}
                           onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                           className="w-full bg-slate-50 p-4 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-400 uppercase ml-1">Current Position</label>
                         <input
                           type="text"
                           value={formData.current_position}
                           onChange={(e) => setFormData({...formData, current_position: e.target.value})}
                           className="w-full bg-slate-50 p-4 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                           placeholder="Product Designer"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-400 uppercase ml-1">LinkedIn Profile</label>
                         <input
                           type="url"
                           placeholder="https://linkedin.com/..."
                           value={formData.linkedin_url}
                           onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                           className="w-full bg-slate-50 p-4 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-400 uppercase ml-1">Portfolio URL</label>
                         <input
                           type="url"
                           placeholder="https://myportfolio.com"
                           value={formData.portfolio_url}
                           onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})}
                           className="w-full bg-slate-50 p-4 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                         />
                      </div>
                   </div>
               ) : (
                   <div className="flex gap-8 py-4">
                       {/* LinkedIn */}
                       <div className="relative group">
                           {profile?.linkedin_url ? (
                               <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="block w-16 h-16 bg-[#0077b5] text-white rounded-2xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-blue-200">
                                   <LinkIcon size={28} />
                               </a>
                           ) : (
                               <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center grayscale opacity-70">
                                   <LinkIcon size={28} />
                                   {/* Warning Badge */}
                                   <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                       <AlertCircle size={14} />
                                   </div>
                               </div>
                           )}
                           <p className="text-xs font-bold text-center mt-2 text-slate-400">LinkedIn</p>
                       </div>

                       {/* Portfolio */}
                       <div className="relative group">
                           {profile?.portfolio_url ? (
                               <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="block w-16 h-16 bg-pink-500 text-white rounded-2xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-pink-200">
                                   <Briefcase size={28} />
                               </a>
                           ) : (
                               <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center grayscale opacity-70">
                                   <Briefcase size={28} />
                                   {/* Warning Badge */}
                                   <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                       <AlertCircle size={14} />
                                   </div>
                               </div>
                           )}
                           <p className="text-xs font-bold text-center mt-2 text-slate-400">Portfolio</p>
                       </div>
                   </div>
               )}
            </div>

            {/* Resume Card */}
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden flex items-center justify-between">
               <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
                     <FileText /> My Resume
                  </h3>
                  <p className="opacity-80 font-medium max-w-md mb-6">
                     Upload your resume to share with recruiters. We accept PDF and Word documents.
                  </p>
                  
                  <div className="flex gap-3">
                     {profile?.resume && (
                        <a 
                           href={profile.resume.startsWith('http') ? profile.resume : `http://localhost:8000${profile.resume}`}
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold transition-colors backdrop-blur-md"
                        >
                           View Current
                        </a>
                     )}
                     <div className="relative">
                        <input
                           type="file"
                           id="resume-main"
                           className="hidden"
                           accept=".pdf,.doc,.docx"
                           onChange={async (e) => {
                              const file = e.target.files[0];
                              if(!file) return;
                              const data = new FormData();
                              data.append('resume', file);
                              // We can send partial update in many backends, or re-send name. 
                              // Our backend serializer updates what is present.
                              try {
                                 await profileService.updateProfile(data);
                                 fetchProfile();
                                 alert('Resume uploaded!');
                              } catch(err) {
                                 console.error("Resume upload failed", err.response?.data || err);
                                 alert('Upload failed: ' + JSON.stringify(err.response?.data || 'Unknown error'));
                              }
                           }}
                        />
                        <label htmlFor="resume-main" className="cursor-pointer px-6 py-3 bg-white text-indigo-600 rounded-xl font-black hover:bg-indigo-50 transition-colors flex items-center gap-2">
                           <Upload size={18} /> {profile?.resume ? 'Update File' : 'Upload Resume'}
                        </label>
                     </div>
                  </div>
               </div>
               <div className="hidden md:block opacity-20 transform rotate-12 bg-white/30 p-8 rounded-3xl backdrop-blur-3xl absolute -right-10 -bottom-10 w-64 h-64 pointer-events-none"></div>
            </div>

            {/* Applications List */}
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-800 px-2">Application History</h3>
              <ApplicationsList applications={applications} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
