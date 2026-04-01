function HeroSection() {
  return (
    <div className="flex flex-col lg:flex-row min-h-[600px] lg:min-h-[800px] bg-[#0c0e14]">
      {/* Left side - Image with curved edge */}
      <div className="w-full lg:w-1/2 bg-[#0c0e14] relative flex items-center h-[500px] md:h-[600px] lg:h-auto">
        <div className="w-full h-full absolute inset-0 p-4 lg:p-0">
          <div className="w-full h-full relative overflow-hidden rounded-[2rem] lg:rounded-none">
            <img 
              src="/Female.jpg" 
              alt="Healthcare professional smiling" 
              className="absolute inset-0 w-full h-full object-cover object-center lg:object-left scale-105"
            />
            {/* Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14]/40 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Right side - Dark with grid */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-10 md:p-20 lg:p-24 relative overflow-hidden">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #4473C5 1px, transparent 1px),
              linear-gradient(to bottom, #4473C5 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        
        <div className="max-w-xl relative z-10 w-full space-y-6 md:space-y-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black text-white leading-[1.1] tracking-tight">
            Explore<br className="hidden md:block" />
            <span className="text-[#FFC107]">New Career</span> Opportunities.
          </h1>
          <p className="text-slate-400 text-sm md:text-lg lg:text-xl leading-relaxed max-w-md font-medium italic">
            Connect with top employers and discover opportunities that match your precise healthcare skills.
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a href="#jobs" className="inline-block bg-[#FFC107] text-[#0c0e14] px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-[#FFC107]/10 text-center">
              Explore Jobs
            </a>
            <a href="#about-us" className="inline-block bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all text-center">
              Our Story
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
