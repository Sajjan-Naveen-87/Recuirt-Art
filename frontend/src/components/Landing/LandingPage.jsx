import { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import HeroSection from './HeroSection';
import AboutUs from './AboutUs';
import PartnersMarquee from './PartnersMarquee';
import Services from './Services';
import TeamSection from './TeamSection';
import LatestJobs from './LatestJobs';
import Testimonials from './Testimonials';
import InsightsSection from './InsightsSection';

function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const scrollToJobs = () => {
    const jobsSection = document.getElementById('jobs');
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="font-sans min-h-screen bg-white scroll-smooth" style={{ scrollPaddingTop: '100px' }}>
      <Navbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onSearchFocus={scrollToJobs}
      />
      
      <main>
        <HeroSection />
        <AboutUs />
        <PartnersMarquee />
        <Services />
        <TeamSection />
        <LatestJobs searchQuery={searchQuery} />
        <Testimonials />
        <InsightsSection />
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;
