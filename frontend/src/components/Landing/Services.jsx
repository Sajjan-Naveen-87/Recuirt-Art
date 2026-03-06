import { Link } from 'react-router-dom';

function Services() {
  return (
    <div id="services" className="flex flex-col bg-white overflow-hidden">
      {/* Our Services Section */}
      <div className="flex flex-col lg:flex-row min-h-[600px] lg:min-h-[800px]">
        {/* Left side - Image with curved edge */}
        <div className="w-full lg:w-1/2 bg-white relative flex items-center h-[500px] md:h-[600px] lg:h-auto overflow-hidden">
          <div className="w-full h-full absolute inset-0">
            <div className="w-full h-full relative overflow-hidden rounded-t-[4rem] rounded-b-[4rem] md:rounded-t-none md:rounded-b-[8rem] lg:rounded-b-none lg:rounded-l-[15rem]">
              <img 
                src="/Our-Services.png" 
                alt="Our Services" 
                className="absolute inset-0 w-full h-full object-cover scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right side - Dark with grid */}
        <div className="w-full lg:w-1/2 bg-[#121212] flex items-center justify-center p-10 md:p-20 lg:p-24 relative overflow-hidden">
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
          <div className="max-w-xl relative z-10 w-full space-y-10 md:space-y-16 py-8 md:py-12">
            <div>
              <h4 className="text-[14px] font-black uppercase tracking-[0.8em] text-[#cbd5b1] mb-6">Expert Solutions</h4>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-white leading-[1.1] tracking-tight">
                Our <br className="hidden md:block" /> Services.
              </h2>
            </div>

            <div className="space-y-8 md:space-y-12">
              {/* Service 1 */}
              <div className="group">
                <h3 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-[#cbd5b1] transition-colors leading-tight">Clinical & Super-Specialist Hiring</h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium italic">
                  Placement of Consultants, Super-Specialists, and Critical Care Experts through precision headhunting.
                </p>
              </div>

              {/* Service 2 */}
              <div className="group">
                <h3 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-[#cbd5b1] transition-colors leading-tight">Nursing & Allied Healthcare</h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium italic">
                  Structured hiring of Nursing and Paramedical Professionals to ensure uninterrupted clinical operations.
                </p>
              </div>

              {/* Service 3 */}
              <div className="group">
                <h3 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-[#cbd5b1] transition-colors leading-tight">Hospital Leadership & Ops</h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium italic">
                  Strategic recruitment of Administrators and Operations Heads aligned with institutional growth.
                </p>
              </div>
            </div>

            <Link to="/contact" className="inline-block bg-[#cbd5b1] text-[#121212] px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#cbd5b1]/10 hover:bg-[#b8c2a0] transition-all">
              Work With Us
            </Link>
          </div>
        </div>
      </div>

      {/* Our Specialties Section */}
      <div className="flex flex-col-reverse lg:flex-row min-h-[600px] lg:min-h-[800px] bg-white">
        {/* Left side - Dark Background with curved image */}
        <div className="w-full lg:w-1/2 bg-white relative flex items-center h-[500px] md:h-[600px] lg:h-auto overflow-hidden">
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
          <div className="w-full h-full absolute inset-0 lg:py-0">
            <div className="w-full h-full relative overflow-hidden rounded-t-[4rem] md:rounded-t-[8rem] lg:rounded-t-none lg:rounded-bl-[15rem]">
              <img 
                src="./Our-Specialities.png" 
                alt="Our Specialties" 
                className="absolute inset-0 w-full h-full object-cover scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/30 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right side - White with Text */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-10 md:p-20 lg:p-24 relative">
          <div className="max-w-xl relative z-10 w-full space-y-10 md:space-y-16 py-8 md:py-12">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#cbd5b1] mb-6">Healthcare Mastery</h4>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-slate-900 leading-[1.1] tracking-tight">
                Our <br className="hidden md:block" /> Specialties.
              </h2>
            </div>
            
            <div className="space-y-8 md:space-y-12">
              {/* Specialty 1 */}
              <div className="group">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 group-hover:text-[#cbd5b1] transition-colors leading-tight">Clinical Leadership</h3>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium italic border-l-4 border-slate-100 pl-6 py-2">
                  Experts in Oncology, Cardiology, Neurology, Radiology, Surgery, and General Medicine across India.
                </p>
              </div>

              {/* Specialty 2 */}
              <div className="group">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 group-hover:text-[#cbd5b1] transition-colors leading-tight">Digital Systems & IT</h3>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium italic border-l-4 border-slate-100 pl-6 py-2">
                  IT Heads, LIMS/HIMS Specialists, and Digital Transformation Experts for modern healthcare chains.
                </p>
              </div>

              {/* Specialty 3 */}
              <div className="group">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 group-hover:text-[#cbd5b1] transition-colors leading-tight">Operations & Supply Chain</h3>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium italic border-l-4 border-slate-100 pl-6 py-2">
                  Logistics, Warehouse Managers, and Finance Professionals supporting healthcare operations leadership.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
