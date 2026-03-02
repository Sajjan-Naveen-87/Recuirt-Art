import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';

function Counter({ from, to }) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration: 2, ease: "easeOut" });
      return () => controls.stop();
    }
  }, [inView, to, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

function AboutUs() {
  return (
    <section id="about-us" className="py-16 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section 1 - Image Left, Text Right */}
        <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-20 mb-24 md:mb-40">
          {/* Image */}
          <div className="w-full lg:w-1/2 relative group">
            <div className="aspect-[4/5] md:aspect-[4/3] rounded-[3rem] md:rounded-[4rem] rounded-br-2xl overflow-hidden relative shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
              <img 
                src="/Our-Story-1.png" 
                alt="About us presentation" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/20 to-transparent" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNjYmQ1YjEiLz48L3N2Zz4=')] opacity-30 -z-10 bg-repeat" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#cbd5b1]/10 rounded-full blur-2xl -z-10" />
          </div>

          {/* Text */}
          <div className="w-full lg:w-1/2 space-y-2">
            <div className="space-y-2">
              <h3 className="text-[14px] font-black uppercase tracking-[0.8em] text-black">Established 2019</h3>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-black text-slate-900 leading-[1.1] tracking-tight">
                Our Story.
              </h2>
            </div>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
              Recruit Art was founded by <strong className="text-slate-900">Sahitya Saini</strong>, a healthcare recruitment specialist with over a decade of experience. His journey began with structured workforce planning within healthcare institutions, leading campus drives and setup recruitments across India.
            </p>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed italic border-l-4 border-[#cbd5b1] pl-6 py-2">
              Over 2000 healthcare professionals have been successfully placed, building a focused, reliable, and quality-driven firm dedicated exclusively to the healthcare sector.
            </p>

            <div className="pt-4">
              <a href="#services" className="inline-block bg-[#121212] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#cbd5b1] hover:text-[#121212] transition-all">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Banner Section */}
      <div className="w-full bg-[#121212] py-20 xl:py-0 my-24 xl:my-40 relative overflow-hidden flex flex-col xl:flex-row items-center justify-between shadow-2xl min-h-[600px]">
          {/* Subtle grid background */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(to right, white 1px, transparent 1px),
                linear-gradient(to bottom, white 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />

        {/* Left Arc & Image */}
        <div className="w-full xl:w-1/3 h-[450px] md:h-[600px] xl:h-[600px] bg-[#cbd5b1] relative z-10 xl:rounded-r-[15rem] rounded-b-[4rem] xl:rounded-b-none overflow-hidden self-stretch flex items-end justify-center order-first group">
           <img 
                src="/Founder-Image.jpeg" 
                alt="Recruiter professional" 
                className="w-full h-full object-cover object-top drop-shadow-2xl transition-all duration-700"
              />
           <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/20 to-transparent pointer-events-none" />
        </div>

        {/* Center Stats */}
        <div className="w-full xl:w-1/3 flex flex-col md:flex-row xl:flex-col gap-12 md:gap-8 xl:gap-16 text-center text-white relative z-10 py-16 xl:py-0 px-8 items-center justify-center">
            <div className="group">
              <div className="text-6xl md:text-7xl lg:text-8xl font-serif font-black mb-2 text-white group-hover:text-[#cbd5b1] transition-colors">
                <Counter from={0} to={10} />+
              </div>
              <div className="font-black uppercase tracking-[0.3em] text-slate-500 text-[10px]">Strategic Clients</div>
            </div>
            <div className="group">
              <div className="text-6xl md:text-7xl lg:text-8xl font-serif font-black mb-2 text-white group-hover:text-[#cbd5b1] transition-colors">
                <Counter from={0} to={10} />+
              </div>
              <div className="font-black uppercase tracking-[0.3em] text-slate-500 text-[10px]">Expert Recruiters</div>
            </div>
            <div className="group">
              <div className="text-6xl md:text-7xl lg:text-8xl font-serif font-black mb-2 text-white group-hover:text-[#cbd5b1] transition-colors">
                <Counter from={0} to={800} />+
              </div>
              <div className="font-black uppercase tracking-[0.3em] text-slate-500 text-[10px]">Placed Candidates</div>
            </div>
          </div>

        {/* Right Arc & Text */}
        <div className="w-full xl:w-1/3 bg-[#f4f4f0] py-16 md:py-24 px-8 md:px-12 xl:pr-16 relative z-10 xl:rounded-l-[15rem] rounded-3xl xl:rounded-r-none mx-6 xl:mx-0 xl:mr-0 box-border text-center xl:text-right">
            <h4 className="text-[12px] font-black text-black uppercase tracking-[0.8em] mb-6">RECRUIT ART IMPACT</h4>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-slate-900 leading-[1.1] mb-8 max-w-sm mx-auto xl:mx-0 xl:ml-auto">
              Connecting Talent with Purpose.
            </h3>
            <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed max-w-sm mx-auto xl:mx-0 xl:ml-auto italic">
              We focus on building strong, lasting connections between exceptional healthcare professionals and leading institutions. Quality and integrity are at the heart of every placement.
            </p>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-40">
        {/* Section 2 - Image Left, Text Right */}
        <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-16">
          {/* Image */}
          <div className="w-full lg:w-1/2 relative group">
            <div className="aspect-[4/5] md:aspect-[4/3] rounded-[3rem] md:rounded-[4rem] rounded-br-2xl overflow-hidden relative shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
              <img 
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                alt="Technology discussion" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/20 to-transparent" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#121212] rounded-full opacity-5 -z-10" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#cbd5b1] rounded-full opacity-20 -z-10" />
          </div>

          {/* Text */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <h4 className="text-[12px] font-black uppercase tracking-[0.8em] text-black">Sector Strategy</h4>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-black text-slate-900 leading-[1.1] tracking-tight">
                Our Focus.
              </h2>
            </div>
            <div className="space-y-6">
              <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                Today, Recruit Art is strategically aligned toward comprehensive hospital hiring solutions. Our primary focus is on Clinicians, Super-Specialists, Nursing Professionals, and Hospital Operations leadership.
              </p>
              <p className="text-slate-500 text-base md:text-lg leading-relaxed italic border-l-4 border-[#cbd5b1] pl-6 py-2">
                We work closely with multi-speciality hospitals and diagnostic chains to close critical, time-sensitive roles with precision and confidentiality.
              </p>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                Under Sahitya Saini’s leadership, Recruit Art continues to position itself as a premium healthcare recruitment partner — ethical, performance-focused, and committed to organizational excellence.
              </p>
            </div>
            <div className="pt-6">
              <a href="#services" className="inline-block bg-[#cbd5b1] text-[#121212] px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#cbd5b1]/10 hover:bg-[#b8c2a0] transition-all">
                Work With Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
