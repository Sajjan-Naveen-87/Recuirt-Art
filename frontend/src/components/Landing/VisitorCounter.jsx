import { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Users, TrendingUp } from 'lucide-react';
import { contentService } from '../../services/content';

const VisitorCounter = () => {
    const [count, setCount] = useState(1000);
    const [hasIncremented, setHasIncremented] = useState(false);

    const springConfig = { damping: 30, stiffness: 100, mass: 1 };
    const springCount = useSpring(0, springConfig);
    const displayCount = useTransform(springCount, (latest) => Math.floor(latest));

    useEffect(() => {
        const fetchAndIncrement = async () => {
            try {
                // Check if already incremented in this session (local storage)
                const sessionKey = 'recruit_art_v_count';
                const hasBeenInSession = sessionStorage.getItem(sessionKey);

                if (!hasBeenInSession) {
                    const newCount = await contentService.incrementVisitors();
                    setCount(newCount);
                    sessionStorage.setItem(sessionKey, 'true');
                } else {
                    const currentCount = await contentService.getVisitorCount();
                    setCount(currentCount);
                }
                
                springCount.set(count);
            } catch (error) {
                console.error("Error with visitor counter:", error);
            }
        };

        fetchAndIncrement();
    }, []);

    useEffect(() => {
        springCount.set(count);
    }, [count, springCount]);

    return (
        <div className="flex flex-col items-center justify-center gap-2 py-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl"
            >
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FFC107] animate-pulse" />
                    <Users size={14} className="text-[#FFC107]" />
                </div>
                
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Visitors</span>
                    <motion.span className="text-sm font-black text-[#FFC107] min-w-[3rem] text-center font-mono">
                        {displayCount}
                    </motion.span>
                </div>

                <div className="flex items-center gap-1 ml-2 pl-4 border-l border-white/10">
                    <TrendingUp size={12} className="text-emerald-500" />
                    <span className="text-[9px] font-black text-emerald-500">Live</span>
                </div>
            </motion.div>
        </div>
    );
};

export default VisitorCounter;
