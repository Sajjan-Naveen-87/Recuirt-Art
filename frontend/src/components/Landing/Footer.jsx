import { Link } from 'react-router-dom';
import VisitorCounter from './VisitorCounter';

function Footer() {
  return (
    <footer id="footer" className="bg-[#0c0e14] text-white py-12 md:py-20 px-6 md:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-12 border-b border-white/10 pb-12 md:pb-16">
        
        {/* Contact Section */}
        <div className="w-full lg:max-w-xs text-center lg:text-left">
          <div className="space-y-4 text-slate-400">
            <h2 className="text-2xl md:text-3xl font-serif font-black mb-6 md:mb-8 text-[#FFC107]">Contact Us</h2>
            <a href="mailto:admin@recruitart.in" className="block text-sm md:text-base font-medium hover:text-[#FFC107] transition-colors">
              admin@recruitart.in
            </a>
            <p className="text-sm md:text-base leading-relaxed italic">
              Plot No. 40, Nagla Enclave Part 1, NIIT, Faridabad, Haryana 121004
            </p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12">
          
          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-2xl md:text-3xl font-serif font-black mb-6 md:mb-8 text-[#FFC107]">Quick Links</h4>
            <div className="flex flex-col items-center sm:items-start gap-4 md:gap-6 font-bold text-slate-400">
              <Link 
                to="/" 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-[#FFC107] transition-colors border-b-2 border-[#FFC107]/30 w-max pb-1 text-sm md:text-base"
              >
                Home
              </Link>
              <a href="/#about-us" className="hover:text-[#FFC107] transition-colors text-sm md:text-base">Our Story</a>
              <a href="/#portfolio" className="hover:text-[#FFC107] transition-colors text-sm md:text-base">Impact Portal</a>
              <a href="/#team" className="hover:text-[#FFC107] transition-colors text-sm md:text-base">Our Team</a>
              <a href="/#testimonials" className="hover:text-[#FFC107] transition-colors text-sm md:text-base">Testimonials</a>
            </div>
          </div>

          {/* For Employers */}
          <div className="text-center sm:text-left">
            <h4 className="text-2xl md:text-3xl font-serif font-black mb-6 md:mb-8 text-[#FFC107]">Employers</h4>
            <div className="flex flex-col items-center sm:items-start gap-4 md:gap-6 font-bold text-slate-400">
              <a href="/#services" className="hover:text-[#FFC107] transition-colors text-sm md:text-base">Services</a>
              <a href="/#contact" className="hover:text-[#FFC107] transition-colors text-sm md:text-base">Submit Requirements</a>
            </div>
          </div>

          {/* For Candidates */}
          <div className="text-center sm:text-left">
            <h4 className="text-2xl md:text-3xl font-serif font-black mb-6 md:mb-8 text-[#FFC107]">Candidates</h4>
            <div className="flex flex-col items-center sm:items-start gap-4 md:gap-6 font-bold text-slate-400">
              <Link to="/jobs" className="hover:text-[#FFC107] transition-colors text-sm md:text-base">Jobs Available</Link>
              <a 
                href="/#submit-resume" 
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('open-submit-resume-modal'));
                }}
                className="hover:text-[#FFC107] transition-colors text-sm md:text-base cursor-pointer"
              >
                Submit Resume
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-10 md:mt-12 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-6 text-slate-500 text-sm font-medium">
        
        <div className="flex flex-col items-center gap-4">
          {/* Mobile Visitor Counter - Only visible on small screens */}
          <div className="block lg:hidden">
            <VisitorCounter compact={true} />
          </div>

          {/* Social Icons */}
          <div className="flex gap-1 md:gap-2">

          <a href="https://www.facebook.com/people/Recruit-Art-Hiring-Experts/61585426577974/?ref=1" className="w-12 h-12 flex items-center justify-center hover:scale-110 transition-all" target="_blank">
            <img src="/Facebook.png" alt="Facebook" className="w-10 h-10 object-contain" />
          </a>
          <a href="https://www.linkedin.com/groups/16095191/" className="w-12 h-12 flex items-center justify-center hover:scale-110 transition-all" target="_blank">
            <img src="/LinkedIn.png" alt="LinkedIn" className="w-10 h-10 object-contain" />
          </a>
          <a href="https://www.instagram.com/recruitart_hiring/" className="w-12 h-12 flex items-center justify-center hover:scale-110 transition-all" target="_blank">
            <img src="/Instagram.png" alt="Instagram" className="w-10 h-10 object-contain" />
          </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 items-center">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center font-black uppercase tracking-widest text-[9px] md:text-[10px]">
            <span>&copy; 2019 Recruit Art - Hiring Experts</span>
            <span className="hidden sm:inline opacity-20">|</span>
            <Link to="/privacy" className="hover:text-[#FFC107] transition-colors">Privacy policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
