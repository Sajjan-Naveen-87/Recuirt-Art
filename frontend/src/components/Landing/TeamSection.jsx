import { useState, useEffect } from 'react';
import { Linkedin } from 'lucide-react';
import { feedbackService } from '../../services/feedback';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

function TeamSection() {
  const team = [
    { name: "Sahitya Saini", role: "Managing Director", image: "/Founder-Image.jpeg", linkedin_url: "https://www.linkedin.com/in/sahitya-saini-7b104a98" },
    { name: "Mansi Agrawal", role: "Senior Leadership Hiring Expert", image: "/Mansi-Agrawal.jpeg", linkedin_url: "https://www.linkedin.com/in/mansi-agrawal-034b041b5" },
    { name: "Prerana Agrawal", role: "Clinician Hiring Expert", image: "/Prerana-Agrawal.png", linkedin_url: "https://www.linkedin.com/in/prerna-agrawal-24b87b135" },
    { name: "Kratika Singh", role: "Non-Clinician Hiring Expert", image: "/Kratika-Singh.jpeg", linkedin_url: "https://www.linkedin.com/in/kratika-singh-591b0a231" }
  ];

  return (
    <section id="team" className="py-20 md:py-40 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        <div className="space-y-4 mb-20 md:mb-32">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#cbd5b1]">The Leadership</h4>
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-serif font-black text-slate-900 tracking-tight leading-none">
            Meet <span className="text-[#cbd5b1]">The Team.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12 lg:gap-20">
          {team.map((member, index) => {
            return (
              <a 
                key={index} 
                href={member.linkedin_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group cursor-pointer"
              >
                {/* Arched Image Container */}
                <div className="w-full aspect-[3/4] mb-8 overflow-hidden rounded-t-[10rem] flex justify-center items-end bg-[#f4f4f0] transition-all duration-700 group-hover:-translate-y-4 relative shadow-2xl shadow-slate-200">
                  <img 
                    src={member.image || '/Founder-Image.jpeg'} 
                    alt={member.name} 
                    className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-110"
                  />
                  
                  {/* LinkedIn Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#0077b5] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                        <Linkedin size={24} fill="currentColor" />
                     </div>
                  </div>
                  <div className="absolute inset-0 border border-[#cbd5b1]/10 rounded-t-[10rem] pointer-events-none" />
                </div>
                
                <h3 className="text-2xl md:text-3xl font-serif font-black text-slate-900 mb-2 group-hover:text-[#cbd5b1] transition-colors leading-tight">
                  {member.name}
                </h3>
                <p className="text-slate-400 text-sm md:text-base font-black uppercase tracking-[0.2em]">
                  {member.role}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TeamSection;
