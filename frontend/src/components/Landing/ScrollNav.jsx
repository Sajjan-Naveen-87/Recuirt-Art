import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

const ScrollNav = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [showBottomBtn, setShowBottomBtn] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Show top button when scrolled down slightly
      if (window.scrollY > 300) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }

      // Hide bottom button when near the bottom of the page
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (documentHeight - scrollPosition < 200) {
        setShowBottomBtn(false);
      } else {
        setShowBottomBtn(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed right-6 md:right-8 bottom-8 z-[60] flex flex-col gap-3">
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="w-12 h-12 md:w-14 md:h-14 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#0c0e14] border border-[#0c0e14]/5 shadow-xl hover:bg-[#FFC107] hover:text-[#0c0e14] transition-all group cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBottomBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            onClick={scrollToBottom}
            className="w-12 h-12 md:w-14 md:h-14 bg-[#0c0e14]/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-xl hover:bg-[#FFC107] hover:text-[#0c0e14] transition-all group cursor-pointer"
            aria-label="Scroll to bottom"
          >
            <ArrowDown size={24} className="group-hover:translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScrollNav;
