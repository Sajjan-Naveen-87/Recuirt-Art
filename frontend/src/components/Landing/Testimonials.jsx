import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';
import { feedbackService } from '../../services/feedback';

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await feedbackService.getTestimonials();
        setTestimonials(data.results || data || []);
      } catch (err) {
        console.error("Error fetching landing testimonials:", err);
      }
    };
    fetchTestimonials();
  }, []);

  // Auto-play for landing page
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonials]);

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-5xl lg:text-7xl font-serif font-black text-slate-900 text-center mb-16 tracking-tight">
          Testimonials
        </h2>

        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              {/* Giant Quote Marks */}
              <div className="text-[12rem] md:text-[15rem] font-serif font-black text-slate-900 leading-none h-[140px] md:h-[180px] mb-4 md:mb-8 select-none flex self-start lg:translate-x-[-20%] opacity-5">
                &ldquo;
              </div>

              <div className="text-center space-y-6 max-w-3xl md:-mt-10 relative z-10 px-4">
                <div className="space-y-1">
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 font-serif">
                    {testimonials[activeIndex].author_name}
                  </h3>
                  
                  <p className="text-lg md:text-xl font-serif font-bold text-slate-500 italic">
                    {testimonials[activeIndex].author_position}
                  </p>
                </div>
                
                <p className="text-slate-800 text-xl md:text-3xl leading-relaxed italic font-serif">
                  "{testimonials[activeIndex].content}"
                </p>

                {/* Dots to track progress */}
                <div className="flex justify-center gap-2 pt-12">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`h-1.5 transition-all duration-500 rounded-full ${
                        i === activeIndex ? 'w-10 bg-slate-900' : 'w-2 bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
