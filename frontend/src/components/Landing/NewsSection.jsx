import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Newspaper, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { contentService } from '../../services/content';

const NewsSection = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await contentService.getNews();
                setNews(Array.isArray(data) ? data : data?.results || []);
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    if (loading || news.length === 0) return null;

    return (
        <section className="bg-[#0c0e14] py-24 px-6 overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 text-[#FFC107] mb-4"
                        >
                            <Newspaper size={20} />
                            <span className="text-xs font-black uppercase tracking-[0.4em]">Insights</span>
                        </motion.div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-serif font-black text-white tracking-tight"
                        >
                            Latest <span className="text-[#FFC107]">News</span> & Updates
                        </motion.h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {news.slice(0, 3).map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-[#1a1d24] rounded-[2rem] overflow-hidden border border-white/5 hover:border-[#FFC107]/20 transition-all duration-500 shadow-2xl hover:shadow-black/50"
                        >
                            {/* Image Container */}
                            <div className="aspect-[16/10] overflow-hidden relative">
                                {item.image ? (
                                    <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#0c0e14] flex items-center justify-center">
                                        <Newspaper size={48} className="text-white/5" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d24] via-transparent to-transparent opacity-60" />
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <div className="flex items-center gap-3 text-white/30 text-[10px] font-black uppercase tracking-widest mb-4">
                                    <Calendar size={12} className="text-[#FFC107]" />
                                    {new Date(item.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </div>
                                <h3 className="text-xl font-serif font-black text-white mb-4 group-hover:text-[#FFC107] transition-colors line-clamp-2">
                                    {item.title}
                                </h3>
                                <p className="text-white/50 text-sm leading-relaxed mb-8 line-clamp-3">
                                    {item.description || item.content}
                                </p>
                                
                                {item.link_url && (
                                    <a 
                                        href={item.link_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-[#FFC107] font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all"
                                    >
                                        Read More <ExternalLink size={12} />
                                    </a>
                                )}
                            </div>

                            {/* Hover Glow */}
                            <div className="absolute inset-0 border-[3px] border-[#FFC107] opacity-0 group-hover:opacity-10 rounded-[2rem] transition-opacity pointer-events-none" />
                        </motion.div>
                    ))}
                </div>

                {news.length > 3 && (
                    <div className="flex justify-center pt-8">
                        <Link 
                            to="/news" 
                            className="group relative px-12 py-5 bg-[#FFC107] text-[#0c0e14] rounded-full font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
                        >
                            View All News & Updates
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default NewsSection;
