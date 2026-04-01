import { Link } from 'react-router-dom';

function Services() {
  return (
    <section id="services" className="bg-[#0c0e14] relative overflow-hidden scroll-mt-32">
      {/* Our Services Section */}
      <div className="flex flex-col lg:flex-row min-h-[500px] lg:min-h-screen">
        {/* Left side - Image */}
        <div className="w-full lg:w-1/2 bg-[#0c0e14] relative flex items-stretch h-[400px] md:h-[500px] lg:h-auto p-4 lg:p-0">
          <div className="w-full h-full relative overflow-hidden rounded-[2rem] lg:rounded-none">
            <img 
              src="/Our-Services.png" 
              alt="Our Services" 
              className="w-full h-full object-cover block scale-105"
            />
          </div>
        </div>

        {/* Right side - Text */}
        <div className="w-full lg:w-1/2 bg-[#0c0e14] flex items-center justify-center p-8 md:p-20 lg:px-24 relative overflow-hidden">
          {/* Subtle Grid Background */}
          <div 
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, #4473C5 1px, transparent 1px),
                linear-gradient(to bottom, #4473C5 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
          <div className="max-w-xl relative z-10 w-full space-y-10 md:space-y-16">
            <div>
              <h4 className="text-[14px] font-black uppercase tracking-[0.8em] text-[#FFC107] mb-6">Expert Solutions</h4>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-white leading-[1.1] tracking-tight">
                Our <br className="hidden md:block" /> Services.
              </h2>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div className="space-y-8 md:space-y-12">
                {/* Service 1 */}
                <div className="group">
                  <h3 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-[#FFC107] transition-colors leading-tight">Clinical & Super-Specialist Hiring</h3>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium italic">
                    Placement of Consultants, Super-Specialists, and Critical Care Experts through precision headhunting.
                  </p>
                </div>

                {/* Service 2 */}
                <div className="group">
                  <h3 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-[#FFC107] transition-colors leading-tight">Nursing & Allied Healthcare</h3>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium italic">
                    Structured hiring of Nursing and Paramedical Professionals to ensure uninterrupted clinical operations.
                  </p>
                </div>

                {/* Service 3 */}
                <div className="group">
                  <h3 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-[#FFC107] transition-colors leading-tight">Hospital Leadership & Ops</h3>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium italic">
                    Strategic recruitment of Administrators and Operations Heads aligned with institutional growth.
                  </p>
                </div>
              </div>

              {/* <a href="/#footer" className="inline-block bg-[#FFC107] text-[#0c0e14] px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#FFC107]/10 hover:scale-105 transition-all">
                Work With Us
              </a> */}
            </div>
          </div>
        </div>
      </div>

      {/* Our Specialities Section */}
      <div className="flex flex-col lg:flex-row min-h-[500px] lg:min-h-screen">
        {/* Left side - Image */}
        <div className="w-full lg:w-1/2 bg-[#0c0e14] relative flex items-stretch h-[400px] md:h-[500px] lg:h-auto p-4 lg:p-0">
          <div className="w-full h-full relative overflow-hidden rounded-[2rem] lg:rounded-none">
            <img 
              src="/Our-Specialities.jpg" 
              alt="Our Specialties" 
              className="w-full h-full object-cover block scale-105"
            />
          </div>
        </div>

        {/* Right side - Text */}
        <div className="w-full lg:w-1/2 bg-[#0c0e14] flex items-center justify-center p-8 md:p-20 lg:px-24 relative text-white overflow-hidden">
          {/* Subtle Grid Background */}
          <div 
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, #4473C5 1px, transparent 1px),
                linear-gradient(to bottom, #4473C5 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
          <div className="max-w-xl relative z-10 w-full space-y-10 md:space-y-16">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FFC107] mb-6">Healthcare Mastery</h4>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-white leading-[1.1] tracking-tight">
                Our <br className="hidden md:block" /> Specialities
              </h2>
            </div>
            
            <div className="space-y-8 md:space-y-12">
              {/* Specialty 1 */}
              <div className="group">
                <h3 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-[#FFC107] transition-colors leading-tight">Clinical Leadership</h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium italic border-l-4 border-[#4473C5]/30 pl-6 py-2">
                  Experts in Oncology, Cardiology, Neurology, Radiology, Surgery, and General Medicine across India.
                </p>
              </div>

              {/* Specialty 2 */}
              <div className="group">
                <h3 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-[#FFC107] transition-colors leading-tight">Digital Systems & IT</h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium italic border-l-4 border-[#4473C5]/30 pl-6 py-2">
                  IT Heads, LIMS/HIMS Specialists, and Digital Transformation Experts for modern healthcare chains.
                </p>
              </div>

              {/* Specialty 3 */}
              <div className="group">
                <h3 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-[#FFC107] transition-colors leading-tight">Operations & Supply Chain</h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium italic border-l-4 border-[#4473C5]/30 pl-6 py-2">
                  Logistics, Warehouse Managers, and Finance Professionals supporting healthcare operations leadership.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
