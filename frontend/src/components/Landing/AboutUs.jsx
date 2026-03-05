import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

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

const clientLogos = [
  "/Client Logo/Apollo Hospital.png",
  "/Client Logo/Atharv Ability.png",
  "/Client Logo/Dr. Lal Path labs.png",
  "/Client Logo/Fortis.png",
  "/Client Logo/Lupin Diagnostics.png",
  "/Client Logo/Meyer Organics.jpg",
  "/Client Logo/Neuberg Diagnostics.png",
  "/Client Logo/PathKind Diagnostics.jpg",
  "/Client Logo/Soni Balaji Hospital.jpg",
  "/Client Logo/TATA 1MG.jpg",
  "/Client Logo/Vitro Naturals.jpg"
];

function AboutUs() {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLogoIndex((prev) => (prev + 1) % clientLogos.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="about-us" className="bg-white overflow-hidden">
      {/* Our Story Section */}
      <div className="flex flex-col lg:flex-row min-h-[600px] lg:min-h-[800px]">
        {/* Left side - Image */}
        <div className="w-full lg:w-1/2 bg-white relative flex items-center h-[500px] md:h-[600px] lg:h-auto overflow-hidden">
          <div className="w-full h-full absolute inset-0">
            <div className="w-full h-full relative overflow-hidden rounded-b-[4rem] md:rounded-b-[8rem] lg:rounded-b-none lg:rounded-l-[15rem]">
              <img 
                src="/Our-Story-1.png" 
                alt="Our Story" 
                className="absolute inset-0 w-full h-full object-cover scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right side - White with Text */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-10 md:p-20 lg:p-24 relative overflow-hidden">
          <div className="max-w-xl relative z-10 w-full space-y-10 md:space-y-16 py-8 md:py-12">
            <div>
              <h4 className="text-[14px] font-black uppercase tracking-[0.8em] text-black mb-6">Established 2019</h4>
              <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-black text-slate-900 leading-[1.1] tracking-tight">
                Our <br className="hidden md:block" /> Story.
              </h2>
            </div>

            <div className="space-y-6 md:space-y-8">
              <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                Recruit Art was founded by <strong className="text-slate-900">Sahitya Saini</strong>, a healthcare recruitment specialist with over a decade of experience. His journey began with structured workforce planning within healthcare institutions, leading campus drives and setup recruitments across India.
              </p>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium italic border-l-4 border-[#cbd5b1] pl-6 py-2">
                Over 2000 healthcare professionals have been successfully placed, building a focused, reliable, and quality-driven firm dedicated exclusively to the healthcare sector.
              </p>
            </div>

            <a href="#services" className="inline-block bg-[#121212] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#cbd5b1] hover:text-[#121212] transition-all">
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Our Focus Section */}
      <div className="flex flex-col-reverse lg:flex-row min-h-[600px] lg:min-h-[800px] bg-white">
        {/* Left side - White Background with Text */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-10 md:p-20 lg:p-24 relative">
          <div className="max-w-xl relative z-10 w-full space-y-8 md:space-y-12 py-8 md:py-12">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-black mb-6">Sector Strategy</h4>
              <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-black text-slate-900 leading-[1.1] tracking-tight">
                Our <br className="hidden md:block" /> Focus.
              </h2>
            </div>
            
            <div className="space-y-6 md:space-y-8">
              <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                Today, Recruit Art is strategically aligned toward comprehensive hospital hiring solutions. Our primary focus is on Clinicians, Super-Specialists, Nursing Professionals, and Hospital Operations leadership.
              </p>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium italic border-l-4 border-[#cbd5b1] pl-6 py-2">
                We work closely with multi-speciality hospitals and diagnostic chains to close critical, time-sensitive roles with precision and confidentiality.
              </p>
              <p className="text-slate-600 text-base leading-relaxed font-medium">
                Under <strong className="text-slate-900">Sahitya Saini's</strong> leadership, Recruit Art continues to position itself as a premium healthcare recruitment partner — ethical, performance-focused, and committed to organizational excellence.
              </p>
            </div>

            <Link to="/contact" className="inline-block bg-[#cbd5b1] text-[#121212] px-10 py-4 md:py-5 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#cbd5b1]/20 hover:bg-[#b8c2a0] transition-colors whitespace-nowrap">
              Work With Us
            </Link>

          </div>
        </div>

        {/* Right side - Image with curved edge */}
        <div className="w-full lg:w-1/2 bg-white relative flex items-center h-[500px] md:h-[600px] lg:h-auto overflow-hidden">
          <div className="w-full h-full absolute inset-0 lg:py-0">
              <div className="w-full h-full relative overflow-hidden rounded-t-[4rem] md:rounded-t-[8rem] lg:rounded-t-none lg:rounded-br-[15rem]">
              <img 
                src="/Our-Focus.png" 
                alt="Our Focus" 
                className="absolute inset-0 w-full h-full object-cover scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Banner Section */}
      <div className="w-full bg-[#121212] py-20 xl:py-16 relative overflow-hidden flex flex-col xl:flex-row items-center justify-between shadow-2xl min-h-[650px] border-t border-slate-800">
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

        {/* Left Arc & Image/Logos */}
        <div className="w-full xl:w-1/3 bg-[#f4f4f0] h-[400px] md:h-[500px] xl:h-[520px] relative z-10 rounded-[4rem] xl:rounded-none xl:rounded-r-full mx-6 xl:mx-0 box-border flex flex-col items-center justify-center p-12 lg:p-20">
            <h4 className="text-[12px] font-black text-black uppercase tracking-[0.8em] mb-10">Our Clients</h4>
            <div className="w-full h-32 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.img 
                    key={currentLogoIndex}
                    src={clientLogos[currentLogoIndex]}
                    alt={`Client Logo ${currentLogoIndex + 1}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm"
                  />
              </AnimatePresence>
            </div>
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
        <div className="w-full xl:w-1/3 bg-[#f4f4f0] h-[400px] md:h-[500px] xl:h-[520px] relative z-10 rounded-[4rem] xl:rounded-none xl:rounded-l-full mx-6 xl:mx-0 box-border text-center xl:text-right flex flex-col justify-center p-12 lg:p-20 lg:pr-24">
            <h4 className="text-[12px] font-black text-black uppercase tracking-[0.8em] mb-6">RECRUIT ART IMPACT</h4>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-slate-900 leading-[1.1] mb-8 max-w-sm mx-auto xl:mx-0 xl:ml-auto">
              Connecting Talent with Purpose.
            </h3>
            <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed max-w-sm mx-auto xl:mx-0 xl:ml-auto italic">
              We focus on building strong, lasting connections between exceptional healthcare professionals and leading institutions. Quality and integrity are at the heart of every placement.
            </p>
          </div>
      </div>

    </section>
  );
}

export default AboutUs;
