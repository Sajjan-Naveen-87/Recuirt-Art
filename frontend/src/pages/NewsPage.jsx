import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Briefcase, IndianRupee, Clock, ArrowRight, ChevronLeft, Calendar, Newspaper, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { contentService } from '../services/content';
import Navbar from '../components/Landing/Navbar';
import Footer from '../components/Landing/Footer';

const NewsPage = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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
        window.scrollTo(0, 0);
    }, []);

    const filteredNews = news.filter(item => 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0c0e14] font-sans">
            <Navbar 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
            />

            <main className="max-w-7xl mx-auto px-6 py-20 md:py-32">
                <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white mb-12 transition-colors font-bold uppercase tracking-widest text-[10px]">
                    <ChevronLeft size={16} /> Back to home
                </Link>

                <div className="mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 text-[#FFC107] mb-4"
                    >
                        <Newspaper size={20} />
                        <span className="text-xs font-black uppercase tracking-[0.4em]">Insights & Updates</span>
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-white mb-6 tracking-tight">
                        Latest <span className="text-[#FFC107]">News</span> & Updates.
                    </h1>
                    <p className="text-white/50 text-lg md:text-xl font-medium max-w-2xl italic">
                        Stay informed about current healthcare trends, industry breakthroughs, and our latest clinical opportunities.
                    </p>
                </div>

                {loading ? (
                    <div className="py-24 text-center">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-12 w-12 border-4 border-[#FFC107] border-t-transparent rounded-full mx-auto" />
                    </div>
                ) : filteredNews.length === 0 ? (
                    <div className="bg-[#1a1d24] p-16 md:p-24 rounded-[3rem] text-center border border-white/5 shadow-xl">
                        <Search size={48} className="mx-auto mb-6 text-white/5" />
                        <p className="text-white/20 font-serif text-2xl italic">No news items matching your search were found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
                        {filteredNews.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
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
                                    <p className="text-white/50 text-sm leading-relaxed mb-8 line-clamp-4">
                                        {item.description || item.content}
                                    </p>
                                    
                                    {item.link_url && (
                                        <a 
                                            href={item.link_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-[#FFC107] font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all"
                                        >
                                            Explore Article <ExternalLink size={12} />
                                        </a>
                                    )}
                                </div>

                                {/* Hover Glow */}
                                <div className="absolute inset-0 border-[3px] border-[#FFC107] opacity-0 group-hover:opacity-10 rounded-[2rem] transition-opacity pointer-events-none" />
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default NewsPage;
