import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, User, Calendar, ExternalLink } from 'lucide-react';
import { feedbackService } from '../../services/feedback';

const TestimonialsList = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const data = await feedbackService.getTestimonials();
        setTestimonials(data.results || data || []);
      } catch (err) {
        console.error("Error fetching dashboard testimonials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-4 border-[#cbd5b1] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="bg-white border border-slate-200/60 p-20 rounded-[3rem] text-center shadow-sm">
         <div className="w-16 h-16 bg-[#f4f4f0] rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Quote size={32} />
         </div>
        <p className="text-xl font-serif text-slate-400 italic">No success stories found. They are being written as we speak.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
       <div className="flex items-center justify-between mb-6 md:mb-8 px-2 md:px-0">
          <h2 className="text-2xl md:text-3xl font-serif font-black text-[#121212]">Success Stories</h2>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white px-4 py-2 rounded-xl border border-slate-100">{testimonials.length} Total</span>
       </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id || index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-slate-200/60 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex flex-col justify-between group hover:border-[#cbd5b1] transition-all duration-300 shadow-sm"
          >
            <div className="relative mb-6">
              <Quote size={40} className="text-[#cbd5b1]/20 absolute -top-4 -left-4" />
              <p className="text-slate-600 text-base md:text-lg leading-relaxed font-serif italic relative z-10 px-4">
                "{testimonial.content}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#f4f4f0] rounded-xl flex items-center justify-center text-slate-400">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="font-serif font-black text-[#121212] leading-tight">{testimonial.author_name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{testimonial.author_position}</p>
                </div>
              </div>

              {testimonial.original_url && (
                <a 
                  href={testimonial.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#121212] text-[#cbd5b1] rounded-xl flex items-center justify-center hover:bg-[#cbd5b1] hover:text-[#121212] transition-colors shadow-lg"
                  title="View Original"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsList;
