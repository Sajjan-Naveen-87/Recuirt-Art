import { useState, useEffect } from 'react';
import { LayoutGrid, Search, Briefcase, User, Users, LogOut, ShieldCheck, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import ContactUs from '../Contact/ContactUs';
import { motion } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab, onLogout, onHireTalent }) => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menu = [
    { icon: <LayoutGrid size={22} />, label: "Dashboard" },
    { icon: <Search size={22} />, label: "Explore" },
    { icon: <Briefcase size={22} />, label: "Applications" },
    // Removed Profile as requested
  ];

  const bottomMenu = [
    { icon: <Users size={22} />, label: "Hire Talent", action: () => onHireTalent?.() },
    { icon: <MessageCircle size={22} />, label: "Contact Us", action: () => setShowContactModal(true) },
  ];

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
  };

  return (
    <>
      <motion.aside 
        initial={{ width: 288 }}
        animate={{ width: isCollapsed ? 80 : 288 }}
        className="h-[calc(100vh-2rem)] sticky top-4 flex flex-col pt-8 pb-8 px-4 border-r border-white/5 bg-[#121212] z-20 relative transition-all duration-300"
      >
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-500 transition-colors z-50 border border-[#121212]"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div 
          onClick={() => setActiveTab('Dashboard')}
          className={`flex items-center gap-3 mb-12 px-2 cursor-pointer group ${isCollapsed ? 'justify-center' : ''}`}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-900/20 group-hover:scale-105 transition-transform shrink-0">
            <ShieldCheck className="text-white" size={24} />
          </div>
          {!isCollapsed && (
             <motion.span 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-2xl font-serif font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors whitespace-nowrap"
             >
               Recruit Art
             </motion.span>
          )}
        </div>

        <nav className="flex-1 space-y-3">
          {menu.map((item) => (
            <button 
              key={item.label}
              onClick={() => setActiveTab(item.label)} 
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-5 gap-4'} py-4 rounded-[1.5rem] transition-all duration-300 font-bold text-sm border ${
                activeTab === item.label 
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-900/20' 
                : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-white'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <div className="shrink-0">{item.icon}</div>
              {!isCollapsed && <span className="font-sans whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        <nav className="space-y-3 mt-auto">
          {bottomMenu.map((item) => (
            <button 
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-5 gap-4'} py-4 rounded-[1.5rem] transition-all duration-300 font-bold text-sm text-slate-400 hover:bg-white/5 hover:text-white border border-transparent`}
              title={isCollapsed ? item.label : ''}
            >
              <div className="shrink-0">{item.icon}</div>
              {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
          
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-5 gap-4'} py-4 rounded-[1.5rem] transition-all duration-300 font-bold text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-500 border border-transparent`}
            title={isCollapsed ? "Sign Out" : ''}
          >
            <div className="shrink-0"><LogOut size={20} /></div>
            {!isCollapsed && <span className="whitespace-nowrap">Sign Out</span>}
          </button>
        </nav>
      </motion.aside>

      <ContactUs 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)}
        isModal={true}
      />
    </>
  );
};

export default Sidebar;
