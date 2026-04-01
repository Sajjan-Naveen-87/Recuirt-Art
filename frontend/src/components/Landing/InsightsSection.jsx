import { ArrowRight } from 'lucide-react';

function InsightsSection() {
  const articles = [
    {
      id: 1,
      title: "The Future of Remote Work in 2026",
      category: "Workplace",
      date: "Jan 24, 2026",
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "Explore the evolving landscape of remote work and discover how top companies are maintaining culture and productivity."
    },
    {
      id: 2,
      title: "How to Build a World-Class Engineering Team",
      category: "Leadership",
      date: "Feb 15, 2026",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "Learn proven strategies for attracting, evaluating, and retaining top-tier engineering talent in a competitive market."
    },
    {
      id: 3,
      title: "Navigating Global Talent Acquisition",
      category: "Recruitment",
      date: "Feb 20, 2026",
      image: "https://images.unsplash.com/photo-1558402529-d2638a7023e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "Insights into the challenges and opportunities of hiring talent across borders, and how to stay compliant while scaling."
    }
  ];

  return (
    <section id="insights" className="py-24 bg-[#0c0e14] scroll-mt-32">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-5xl lg:text-6xl font-serif font-black text-white mb-6 tracking-tight uppercase">
              Brand <span className="text-[#FFC107]">Insights.</span>
            </h2>
            <p className="text-white/60 text-lg lg:text-xl font-medium">
              Stay updated with the latest trends, strategies, and insights from our team of industry experts.
            </p>
          </div>
          <button className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px] text-white pb-2 border-b-2 border-white hover:text-[#FFC107] hover:border-[#FFC107] transition-colors shrink-0">
            View All Articles <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {articles.map((article) => (
            <div key={article.id} className="group cursor-pointer">
              <div className="w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-8 relative shadow-2xl shadow-black/20">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
                <div className="absolute top-6 left-6 bg-[#0c0e14]/90 backdrop-blur-md px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[#FFC107]">
                  {article.category}
                </div>
              </div>
              
              <div className="space-y-4 pr-6">
                <div className="text-[#FFC107] font-black uppercase tracking-widest text-[10px] opacity-60">
                  {article.date}
                </div>
                <h3 className="text-2xl font-serif font-black text-white group-hover:text-[#FFC107] transition-colors leading-tight tracking-tight">
                  {article.title}
                </h3>
                <p className="text-white/50 line-clamp-2 font-serif italic text-lg leading-relaxed">
                  {article.excerpt}
                </p>
                <div className="pt-4 font-black text-[#FFC107] uppercase tracking-[0.3em] text-[9px] flex items-center gap-3 group-hover:translate-x-3 transition-transform">
                  Read Journey <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default InsightsSection;
