import Navbar from '../components/Landing/Navbar';
import Footer from '../components/Landing/Footer';

function Portfolio() {
  return (
    <div className="min-h-screen bg-[#f4f4f0] font-sans flex flex-col relative overflow-hidden">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-32 px-6 relative z-10 w-full max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-8 text-center tracking-wide font-black">
          Our Portfolio
        </h1>
        <p className="text-slate-500 text-center max-w-2xl text-lg">
          Check back soon to see our latest successful placements and recruitment achievements.
        </p>
      </main>

      <Footer />
    </div>
  );
}

export default Portfolio;
