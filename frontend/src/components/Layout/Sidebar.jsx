import { useState, useEffect } from 'react';
import { LayoutGrid, Search, Briefcase, User, Users, LogOut, MessageCircle, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
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
    { icon: <Heart size={22} />, label: "Testimonials" },
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
        initial={window.innerWidth < 1024 ? { width: 280 } : { width: 288 }}
        animate={{ 
          width: window.innerWidth < 1024 ? 280 : (isCollapsed ? 80 : 288) 
        }}
        className="h-full lg:h-[calc(100vh-2rem)] flex flex-col pt-8 md:pt-10 pb-8 md:pb-10 px-4 border-r border-white/5 bg-[#121212] z-40 relative shadow-2xl"
      >
        {/* Toggle Button - Only Desktop */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-12 w-8 h-8 bg-[#cbd5b1] rounded-full items-center justify-center text-[#121212] shadow-xl hover:scale-110 transition-all z-50 border-4 border-[#121212]"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div 
          onClick={() => setActiveTab('Dashboard')}
          className={`mb-10 md:mb-16 cursor-pointer group ${isCollapsed ? 'lg:px-2' : 'px-4'}`}
        >
          <div className={`relative transition-all duration-300 overflow-hidden ${isCollapsed ? 'lg:w-10 lg:h-10 lg:rounded-xl w-40 h-12 rounded-2xl' : 'w-40 h-12 rounded-2xl'}`}>
            <img 
              src="/Logo.png" 
              alt="Recruit Art Logo" 
              className={`w-full h-full object-cover transition-all duration-300 ${(isCollapsed && window.innerWidth >= 1024) ? 'scale-150' : 'scale-100'}`} 
            />
          </div>
        </div>

        <nav className="flex-1 space-y-3 md:space-y-4">
          {menu.map((item) => (
            <button 
              key={item.label}
              onClick={() => setActiveTab(item.label)} 
              className={`w-full flex items-center ${(isCollapsed && window.innerWidth >= 1024) ? 'justify-center px-0' : 'px-6 gap-5'} py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300 font-bold text-[11px] md:text-[11px] uppercase tracking-widest border ${
                activeTab === item.label 
                ? 'bg-[#cbd5b1] text-[#121212] border-[#cbd5b1] shadow-xl shadow-[#cbd5b1]/10 translate-x-1' 
                : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-white'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <div className="shrink-0">{item.icon}</div>
              {(!isCollapsed || window.innerWidth < 1024) && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        <nav className="space-y-3 md:space-y-4 mt-auto">
          {bottomMenu.map((item) => (
            <button 
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center ${(isCollapsed && window.innerWidth >= 1024) ? 'justify-center px-0' : 'px-6 gap-5'} py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300 font-black text-[11px] uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-white border border-transparent`}
              title={isCollapsed ? item.label : ''}
            >
              <div className="shrink-0">{item.icon}</div>
              {(!isCollapsed || window.innerWidth < 1024) && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
          
          <div className="h-px w-full bg-white/5 my-4 md:my-6"></div>

          <button 
            onClick={handleLogout}
            className={`w-full flex items-center ${(isCollapsed && window.innerWidth >= 1024) ? 'justify-center px-0' : 'px-6 gap-5'} py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300 font-black text-[11px] uppercase tracking-widest text-[#cbd5b1] hover:bg-[#cbd5b1]/10 border border-transparent`}
            title={isCollapsed ? "Sign Out" : ''}
          >
            <div className="shrink-0"><LogOut size={20} md:size={22} /></div>
            {(!isCollapsed || window.innerWidth < 1024) && <span className="whitespace-nowrap">Sign Out</span>}
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
