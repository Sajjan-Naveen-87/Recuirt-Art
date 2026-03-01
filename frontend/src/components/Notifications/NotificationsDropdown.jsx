import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, CheckCheck, X, Clock, Briefcase, FileText, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { notificationsService } from '../../services/notifications';

const NotificationsDropdown = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationsService.getNotifications({ is_read: false });
      setNotifications(data.results || data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationsService.getNotificationCount();
      setUnreadCount(data.unread || 0);
    } catch (error) {
      console.error('Failed to fetch notification count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsService.markSingleAsRead(notificationId);
      setNotifications(prev => 
        prev.filter(n => n.id !== notificationId)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
    setIsOpen(false);
    if (notification.action_url && onNavigate) {
      onNavigate(notification.action_url);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application_submitted':
        return <FileText className="w-4 h-4 text-emerald-500" />;
      case 'application_status':
        return <Briefcase className="w-4 h-4 text-blue-500" />;
      case 'job_recommendation':
        return <Briefcase className="w-4 h-4 text-purple-500" />;
      case 'profile_update':
        return <User className="w-4 h-4 text-orange-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const formatTimeAgo = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return created.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-12 h-12 rounded-2xl bg-white border border-slate-200/60 hover:border-[#cbd5b1] hover:bg-slate-50 transition-all flex items-center justify-center group shadow-sm"
      >
        <Bell 
          size={20} 
          className="text-slate-400 group-hover:text-[#121212] transition-colors" 
        />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#121212] rounded-full flex items-center justify-center border-2 border-[#f4f4f0]"
          >
            <span className="text-[#cbd5b1] text-[9px] font-black uppercase tracking-tighter">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </motion.div>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute right-0 top-16 w-96 bg-white rounded-[2.5rem] shadow-2xl border border-slate-200/60 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-serif font-black text-[#121212]">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-[10px] font-black uppercase tracking-widest text-[#cbd5b1] hover:text-[#121212] flex items-center gap-1.5 transition-colors"
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="p-12 flex justify-center">
                   <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-8 w-8 border-2 border-[#cbd5b1] border-t-transparent rounded-full"
                    />
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-[#f4f4f0] rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Bell size={24} className="text-slate-300" />
                  </div>
                  <p className="text-lg font-serif font-black text-[#121212]">No alerts</p>
                  <p className="text-slate-400 text-xs font-medium mt-1">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-6 hover:bg-slate-50 cursor-pointer transition-all ${
                        !notification.is_read ? 'bg-[#cbd5b1]/5' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 flex-shrink-0">
                          {getNotificationIcon(notification.notification_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-serif font-black text-[#121212] text-sm truncate">
                              {notification.title}
                            </p>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-[#cbd5b1] rounded-full flex-shrink-0 mt-2 animate-pulse" />
                            )}
                          </div>
                          <p className="text-slate-500 text-xs font-medium mt-1 line-clamp-2 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                            <Clock size={11} />
                            <span>
                              {formatTimeAgo(notification.created_at)}
                            </span>
                          </div>
                        </div>
                        {notification.is_read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="text-slate-300 hover:text-[#cbd5b1] transition-colors"
                          >
                            <Check size={16} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-[#f4f4f0]/30">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigate && onNavigate('/notifications');
                  }}
                  className="w-full py-3 text-center text-[10px] font-black uppercase tracking-[0.2em] text-[#121212] hover:text-[#cbd5b1] transition-colors"
                >
                  View all alerts
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationsDropdown;

