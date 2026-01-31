import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Building2, Clock, Briefcase, DollarSign, CheckCircle, Loader2, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import JobApplyModal from './JobApplyModal';

const JobDetailsModal = ({ job, isOpen, onClose, onApply }) => {
  const { isAuthenticated } = useAuth();
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Handle both real API data and demo data
  const jobData = {
    id: job?.id || 0,
    title: job?.title || 'Unknown Position',
    company_name: job?.company_name || job?.company || 'Unknown Company',
    location: job?.location || 'Remote',
    job_type: job?.job_type || 'full_time',
    description: job?.description || 'No description available.',
    skills_required: job?.skills_required || job?.skills_list || [],
    salary_range: job?.salary_range || job?.salary || 'Negotiable',
    experience_required: job?.experience_required || '',
    apply_deadline: job?.apply_deadline || null,
    is_active: job?.is_active !== undefined ? job.is_active : true,
    created_at: job?.created_at || null,
  };

  const formatJobType = (type) => {
    const types = {
      'full_time': 'Full-time',
      'part_time': 'Part-time',
      'internship': 'Internship',
      'contract': 'Contract',
    };
    return types[type] || type || 'Full-time';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getSkillsList = () => {
    if (Array.isArray(jobData.skills_required)) {
      return jobData.skills_required;
    }
    if (typeof jobData.skills_required === 'string') {
      return jobData.skills_required.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      // Redirect to login or show message
      alert('Please login to apply for this job.');
      return;
    }
    setShowApplyModal(true);
  };

  const handleApplySuccess = () => {
    setShowApplyModal(false);
    onClose();
  };

  if (!job) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl md:max-h-[90vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-8 border-b border-slate-100 flex items-start justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-[1.8rem] flex items-center justify-center text-2xl font-black text-indigo-600 border border-slate-100">
                    {jobData.company_name[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{jobData.title}</h2>
                    <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                      <Building2 size={16} />
                      {jobData.company_name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8">
                {/* Job Meta */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                    <MapPin size={18} className="text-indigo-600" />
                    <span className="font-medium text-slate-700">{jobData.location}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                    <Briefcase size={18} className="text-indigo-600" />
                    <span className="font-medium text-slate-700">{formatJobType(jobData.job_type)}</span>
                  </div>
                  {jobData.salary_range && (
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                      <DollarSign size={18} className="text-indigo-600" />
                      <span className="font-medium text-slate-700">{jobData.salary_range}</span>
                    </div>
                  )}
                  {jobData.apply_deadline && (
                    <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl">
                      <Clock size={18} className="text-amber-600" />
                      <span className="font-medium text-amber-700">Due: {formatDate(jobData.apply_deadline)}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Job Description</h3>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {jobData.description}
                    </p>
                  </div>
                </div>

                {/* Skills Required */}
                {getSkillsList().length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Skills Required</h3>
                    <div className="flex flex-wrap gap-2">
                      {getSkillsList().map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-medium border border-indigo-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {jobData.experience_required && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Experience Required</h3>
                    <p className="text-slate-600">{jobData.experience_required}</p>
                  </div>
                )}

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  {jobData.is_active ? (
                    <span className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-medium">
                      <CheckCircle size={18} />
                      Accepting Applications
                    </span>
                  ) : (
                    <span className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl font-medium">
                      Applications Closed
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-8 border-t border-slate-100 flex justify-end gap-4 flex-shrink-0">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Close
                </button>
                {jobData.is_active && (
                  <button
                    onClick={handleApplyClick}
                    disabled={!isAuthenticated}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isAuthenticated ? 'Apply Now' : 'Login to Apply'}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Apply Modal */}
      <JobApplyModal
        job={job}
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSuccess={handleApplySuccess}
      />
    </>
  );
};

export default JobDetailsModal;

