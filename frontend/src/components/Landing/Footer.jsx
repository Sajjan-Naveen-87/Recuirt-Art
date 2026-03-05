import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Instagram } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-[#cbd5b1] text-slate-900 py-12 md:py-20 px-6 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-12 border-b border-slate-900/10 pb-12 md:pb-16">
        
        {/* Logo Section */}
        <div className="w-full lg:max-w-xs text-center lg:text-left">
          <div className="space-y-4 text-slate-700">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6 md:mb-8">Contact Us</h2>
            <a href="mailto:admin@recuruitart.in" className="block text-sm md:text-base font-medium hover:text-slate-900 transition-colors">
              admin@recuruitart.in
            </a>
            <p className="text-sm md:text-base leading-relaxed">
              Plot No. 40, Nagla Enclave Part 1, NIIT, Faridabad, Haryana 121004
            </p>
            
          </div>
        </div>

        {/* Links Grid */}
        <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12">
          
          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-2xl md:text-3xl font-serif font-bold mb-6 md:mb-8">Quick Links</h4>
            <div className="flex flex-col items-center sm:items-start gap-4 md:gap-6 font-bold text-slate-700">
              <Link to="/" className="hover:text-slate-900 transition-colors border-b-2 border-slate-900 w-max pb-1 text-sm md:text-base">Home</Link>
              <a href="/#about-us" className="hover:text-slate-900 transition-colors text-sm md:text-base">Our Story</a>
            </div>
          </div>

          {/* For Employers */}
          <div className="text-center sm:text-left">
            <h4 className="text-2xl md:text-3xl font-serif font-bold mb-6 md:mb-8">For Employers</h4>
            <div className="flex flex-col items-center sm:items-start gap-4 md:gap-6 font-bold text-slate-700">
              <a href="/#services" className="hover:text-slate-900 transition-colors text-sm md:text-base">Services</a>
              <Link to="/contact" className="hover:text-slate-900 transition-colors text-sm md:text-base">Submit Vacancy</Link>
            </div>
          </div>

          {/* For Candidates */}
          <div className="text-center sm:text-left">
            <h4 className="text-2xl md:text-3xl font-serif font-bold mb-6 md:mb-8">For Candidates</h4>
            <div className="flex flex-col items-center sm:items-start gap-4 md:gap-6 font-bold text-slate-700">
              <Link to="/jobs" className="hover:text-slate-900 transition-colors text-sm md:text-base">Jobs Available</Link>
              <Link to="/jobs" className="hover:text-slate-900 transition-colors text-sm md:text-base">Submit Resume</Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-10 md:mt-12 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-6 text-slate-900 text-sm font-medium">
        
        {/* Social Icons */}
        <div className="flex gap-4">
          <a href="https://www.facebook.com/people/Recruit-Art-Hiring-Experts/61585426577974/?ref=1" className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-[#cbd5b1] hover:bg-slate-800 transition-colors" target="_blank">
            <Facebook size={18} fill="currentColor" className="border-none" />
          </a>
          <a href="https://www.linkedin.com/groups/16095191/" className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-[#cbd5b1] hover:bg-slate-800 transition-colors" target="_blank">
            <Linkedin size={18} fill="currentColor" />
          </a>
          <a href="https://www.instagram.com/recruitart_hiring/" className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-[#cbd5b1] hover:bg-slate-800 transition-colors" target="_blank">
            <Instagram size={18} />
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center font-bold text-xs md:text-sm">
          <span>&copy; {new Date().getFullYear()} Recruit Art</span>
          <span className="hidden sm:inline opacity-30">|</span>
          <Link to="/privacy" className="hover:text-slate-700 transition-colors">Privacy policy</Link>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
