import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, ExternalLink } from 'lucide-react';
import Navbar from '../components/Landing/Navbar';
import Footer from '../components/Landing/Footer';
import { feedbackService } from '../services/feedback';

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await feedbackService.getTestimonials();
        setTestimonials(data.results || data || []);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-[#f4f4f0] font-sans flex flex-col relative overflow-hidden">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-32 px-6 relative z-10 w-full max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-7xl font-serif text-[#121212] mb-20 text-center tracking-tight font-black">
          Testimonials
        </h1>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#121212]/10 border-t-[#121212] rounded-full animate-spin"></div>
          </div>
        ) : testimonials.length > 0 ? (
          <div className="relative w-full max-w-5xl aspect-[16/9] md:aspect-[21/9] flex items-center justify-center">
            {/* Giant Quote Icon */}
            <div className="absolute top-0 left-0 md:left-20 text-[#121212] opacity-10">
              <Quote size={80} strokeWidth={3} />
            </div>

            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="w-full text-center px-4 md:px-20"
              >
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-3xl md:text-[2.5rem] font-serif font-black text-[#121212] tracking-tight">
                      {testimonials[currentIndex].original_url ? (
                        <a 
                          href={testimonials[currentIndex].original_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#cbd5b1] transition-colors"
                        >
                          {testimonials[currentIndex].author_name}
                        </a>
                      ) : (
                        testimonials[currentIndex].author_name
                      )}
                    </h2>
                    <p className="text-lg md:text-xl font-serif italic text-slate-500 font-bold">
                      {testimonials[currentIndex].author_position}
                    </p>
                  </div>

                  <p className="text-xl md:text-3xl lg:text-4xl font-serif font-medium text-[#121212]/80 leading-snug max-w-4xl mx-auto italic">
                    "{testimonials[currentIndex].content}"
                  </p>

                  {/* Corner Button */}
                  {testimonials[currentIndex].original_url && (
                    <div className="pt-10">
                      <a 
                        href={testimonials[currentIndex].original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-[#121212] text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-[#cbd5b1] hover:text-[#121212] transition-all shadow-xl"
                      >
                        View Original <ExternalLink size={14} />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="absolute inset-x-0 bottom-[-80px] md:bottom-auto md:inset-y-0 flex justify-center md:justify-between items-center px-4 gap-8 md:gap-0 pointer-events-none">
              <button
                onClick={() => paginate(-1)}
                className="w-14 h-14 rounded-full border border-[#121212]/10 flex items-center justify-center text-[#121212] hover:bg-[#121212] hover:text-white transition-all pointer-events-auto bg-white/50 backdrop-blur-sm"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => paginate(1)}
                className="w-14 h-14 rounded-full border border-[#121212]/10 flex items-center justify-center text-[#121212] hover:bg-[#121212] hover:text-white transition-all pointer-events-auto bg-white/50 backdrop-blur-sm"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-[4rem] border border-white/10 w-full max-w-4xl">
            <Quote size={48} className="mx-auto mb-6 text-[#121212]/20" />
            <p className="text-2xl font-serif italic text-slate-400">Our success stories are being written...</p>
          </div>
        )}

        {/* Dots Indicator */}
        {!loading && testimonials.length > 1 && (
          <div className="flex gap-3 mt-24">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-[#121212] w-8' : 'bg-[#121212]/20'
                }`}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Testimonials;
