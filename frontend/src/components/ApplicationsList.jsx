import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApplicationDetailsModal from './Job/ApplicationDetailsModal';

const getStatusColor = (status) => {
  const colors = {
    'pending': 'bg-slate-50 text-slate-500 border-slate-200',
    'reviewing': 'bg-amber-50 text-amber-600 border-amber-200',
    'shortlisted': 'bg-indigo-50 text-indigo-600 border-indigo-200',
    'hired': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'rejected': 'bg-rose-50 text-rose-600 border-rose-200',
  };
  return colors[status.toLowerCase()] || 'bg-gray-50 text-gray-600 border-gray-200';
};

const ApplicationsList = ({ applications, isLoading }) => {
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleAppClick = (id) => {
    setSelectedAppId(id);
    setShowDetails(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="bg-white border border-slate-100 p-12 rounded-[3rem] text-center">
        <p className="text-slate-500 font-medium">No applications found. Start exploring jobs!</p>
      </div>
    );
  }

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Pending Review',
      'reviewing': 'Under Review',
      'shortlisted': 'Shortlisted',
      'hired': 'Hired',
      'rejected': 'Rejected'
    };
    return labels[status.toLowerCase()] || status.replace('_', ' ');
  };

  return (
    <div className="space-y-6">
      {applications.map((application, index) => (
        <motion.div
            key={application.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleAppClick(application.id)}
            className="bg-white border border-slate-100 p-8 rounded-[3rem] flex items-center justify-between group hover:border-indigo-600 transition-all shadow-sm cursor-pointer"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
              {application.company_name?.[0] || 'C'}
            </div>
            <div>
              <h4 className="text-xl font-black">{application.job_title || 'Job Title'}</h4>
              <p className="text-slate-400 font-bold text-sm">
                {application.company_name || 'Company'} • Applied {new Date(application.applied_at || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
          <span className={`px-4 py-2 border rounded-full text-xs font-bold uppercase tracking-tighter ${getStatusColor(application.status || 'pending')}`}>
            {getStatusLabel(application.status || 'pending')}
          </span>
        </motion.div>
      ))}

      <ApplicationDetailsModal 
        isOpen={showDetails} 
        onClose={() => setShowDetails(false)} 
        applicationId={selectedAppId} 
      />
    </div>
  );
};

export default ApplicationsList;
