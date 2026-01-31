import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, FileText, CheckCircle, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import profileService from '../services/profile';
import JobCard from '../components/Job/JobCard';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ full_name: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileService.getProfile();
      setProfile(response.data.user);
      setApplications(response.data.applications || []);
      setFormData({ full_name: response.data.user.full_name || '' });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await profileService.updateProfile(formData);
      setProfile({ ...profile, full_name: formData.full_name });
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'applied': 'bg-blue-50 text-blue-600 border-blue-200',
      'in_review': 'bg-yellow-50 text-yellow-600 border-yellow-200',
      'interview': 'bg-purple-50 text-purple-600 border-purple-200',
      'accepted': 'bg-green-50 text-green-600 border-green-200',
      'rejected': 'bg-red-50 text-red-600 border-red-200',
    };
    return colors[status.toLowerCase()] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, rotateX: 20 }}
      animate={{ opacity: 1, rotateX: 0 }}
      exit={{ opacity: 0 }}
      className="px-16 pb-16"
    >
      <div className="flex gap-16">
        <div className="w-1/3 space-y-8">
          <div className="bg-white border border-slate-100 p-4 rounded-[4rem] shadow-2xl relative">
            <div className="aspect-square bg-slate-50 rounded-[3.5rem] flex items-center justify-center text-slate-200">
              <User size={120} />
            </div>
            <button className="absolute bottom-6 right-6 bg-slate-950 text-white p-6 rounded-3xl border-4 border-white hover:bg-indigo-600 transition-colors">
              <Camera size={24} />
            </button>
          </div>
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Member Since</p>
            <p className="text-xl font-bold italic">
              {profile?.date_joined ? new Date(profile.date_joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2024'}
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="p-10 border border-slate-100 rounded-[3rem] bg-white">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black text-slate-300 uppercase">Full Name</p>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateProfile}
                      className="text-green-600 hover:text-green-700 transition-colors"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData({ full_name: profile?.full_name || '' });
                      }}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
              {editing ? (
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ full_name: e.target.value })}
                  className="text-2xl font-black bg-transparent border-b-2 border-indigo-600 focus:outline-none w-full"
                />
              ) : (
                <p className="text-2xl font-black">{profile?.full_name || 'Not set'}</p>
              )}
            </div>
            <div className="p-10 border border-slate-100 rounded-[3rem] bg-white">
              <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Email</p>
              <p className="text-2xl font-black">{profile?.email}</p>
            </div>
          </div>

          <div className="p-10 border border-slate-100 rounded-[3rem] bg-white">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Mobile</p>
            <p className="text-2xl font-black">{profile?.mobile}</p>
          </div>

          <div className="p-10 bg-indigo-600 text-white rounded-[4rem] flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                <FileText size={32} />
              </div>
              <div>
                <p className="text-xl font-black italic tracking-tight">Resume.pdf</p>
                <p className="text-xs font-bold opacity-60">Upload your resume to get better matches</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-colors">
              Upload
            </button>
          </div>

          {/* Applications Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black">My Applications</h3>
            {applications.length === 0 ? (
              <div className="bg-white border border-slate-100 p-12 rounded-[3rem] text-center">
                <p className="text-slate-500 font-medium">No applications yet. Start exploring jobs!</p>
              </div>
            ) : (
              applications.map((application) => (
                <div key={application.id} className="bg-white border border-slate-100 p-8 rounded-[3rem] flex items-center justify-between group hover:border-indigo-600 transition-all shadow-sm">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                      {application.job?.company_name?.[0] || 'C'}
                    </div>
                    <div>
                      <h4 className="text-xl font-black">{application.job?.title || 'Job Title'}</h4>
                      <p className="text-slate-400 font-bold text-sm">{application.job?.company_name || 'Company'} • Applied {new Date(application.applied_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 border rounded-full text-xs font-bold uppercase tracking-tighter ${getStatusColor(application.status)}`}>
                    {application.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
