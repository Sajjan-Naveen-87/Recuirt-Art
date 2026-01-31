import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, Zap } from 'lucide-react';

const Achievements = ({ applicationsCount = 0 }) => {
  const stats = [
    {
      label: 'Applications Sent',
      value: applicationsCount,
      icon: <Target size={20} />,
      color: 'bg-indigo-600',
      textColor: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      label: 'Profile Views',
      value: '142',
      icon: <TrendingUp size={20} />,
      color: 'bg-emerald-600',
      textColor: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      label: 'Skills Verified',
      value: '8/10',
      icon: <Zap size={20} />,
      color: 'bg-amber-500', 
      textColor: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      label: 'Current Streak',
      value: '3 Days',
      icon: <Trophy size={20} />,
      color: 'bg-rose-500',
      textColor: 'text-rose-600', 
      bg: 'bg-rose-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-5 rounded-[1.5rem] border border-slate-100 hover:border-slate-200 transition-colors shadow-sm"
        >
          <div className="flex items-start justify-between mb-4">
             <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center ${stat.textColor}`}>
                {stat.icon}
             </div>
             {index === 0 && (
                <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded-full">
                   Top 10%
                </span>
             )}
          </div>
          <div>
             <h3 className="text-3xl font-bold font-serif text-slate-900">{stat.value}</h3>
             <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Achievements;
