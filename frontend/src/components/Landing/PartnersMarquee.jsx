function PartnersMarquee() {
  const clients = [
    { name: 'Apollo Hospital', logo: '/Client%20Logo/Apollo%20Hospital.png' },
    { name: 'Atharv Ability', logo: '/Client%20Logo/Atharv%20Ability.png' },
    { name: 'Dr. Lal Path labs', logo: '/Client%20Logo/Dr.%20Lal%20Path%20labs.png' },
    { name: 'Fortis', logo: '/Client%20Logo/Fortis.png' },
    { name: 'Lupin Diagnostics', logo: '/Client%20Logo/Lupin%20Diagnostics.png' },
    { name: 'Meyer Organics', logo: '/Client%20Logo/Meyer%20Organics.jpg' },
    { name: 'Neuberg Diagnostics', logo: '/Client%20Logo/Neuberg%20Diagnostics.png' },
    { name: 'PathKind Diagnostics', logo: '/Client%20Logo/PathKind%20Diagnostics.jpg' },
    { name: 'Soni Balaji Hospital', logo: '/Client%20Logo/Soni%20Balaji%20Hospital.jpg' },
    { name: 'TATA 1MG', logo: '/Client%20Logo/TATA%201MG.jpg' },
    { name: 'Vitro Naturals', logo: '/Client%20Logo/Vitro%20Naturals.jpg' },
  ];

  // Duplicate the array to ensure the content is wide enough for the marquee animation to seamlessly loop on large screens
  const displayClients = [...clients, ...clients];

  return (
    <div className="bg-white py-16 lg:py-24 overflow-hidden border-b border-slate-100">
      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap flex items-center gap-16 lg:gap-24 px-12">
          {displayClients.map((client, index) => (
            <div key={index} className="flex items-center justify-center transition-transform hover:scale-105 cursor-pointer w-48 h-20 shrink-0">
              <img src={client.logo} alt={client.name} className="max-w-full max-h-full object-contain" />
            </div>
          ))}
        </div>
        <div className="absolute top-0 animate-marquee2 group-hover:[animation-play-state:paused] whitespace-nowrap flex items-center gap-16 lg:gap-24 px-12 h-full">
          {displayClients.map((client, index) => (
            <div key={index + 50} className="flex items-center justify-center transition-transform hover:scale-105 cursor-pointer w-48 h-20 shrink-0">
              <img src={client.logo} alt={client.name} className="max-w-full max-h-full object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PartnersMarquee;
