import { useState } from 'react';
import { LayoutGrid, Search, Briefcase, User, LogOut, ShieldCheck, MessageCircle } from 'lucide-react';
import NotificationsDropdown from '../Notifications/NotificationsDropdown';
import ContactUs from '../Contact/ContactUs';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const [showContactModal, setShowContactModal] = useState(false);

  const menu = [
    { icon: <LayoutGrid size={22} />, label: "Dashboard" },
    { icon: <Search size={22} />, label: "Explore" },
    { icon: <Briefcase size={22} />, label: "Applications" },
    { icon: <User size={22} />, label: "Profile" },
  ];

  const bottomMenu = [
    { icon: <MessageCircle size={22} />, label: "Contact Us", action: () => setShowContactModal(true) },
  ];

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
  };

  const handleNavigate = (path) => {
    if (path === '/applications') {
      setActiveTab('Applications');
    } else if (path === '/profile') {
      setActiveTab('Profile');
    }
  };

  return (
    <>
      <aside className="w-72 h-[calc(100vh-2rem)] sticky top-4 bg-white rounded-[3rem] border border-slate-200/50 flex flex-col p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">Recuirt Art</span>
        </div>

        <nav className="flex-1 space-y-3">
          {menu.map((item) => (
            <button 
              key={item.label}
              onClick={() => setActiveTab(item.label)} 
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-300 font-bold text-sm ${
                activeTab === item.label 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="py-4 border-t border-slate-100 mb-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Updates</span>
          </div>
          <div className="mt-3">
            <NotificationsDropdown onNavigate={handleNavigate} />
          </div>
        </div>

        <nav className="space-y-3">
          {bottomMenu.map((item) => (
            <button 
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-300 font-bold text-sm text-slate-400 hover:bg-slate-50 hover:text-slate-900"
            >
              {item.icon} {item.label}
            </button>
          ))}
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-300 font-bold text-sm text-slate-400 hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </nav>
      </aside>

      <ContactUs 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)}
        isModal={true}
      />
    </>
  );
};

export default Sidebar;
