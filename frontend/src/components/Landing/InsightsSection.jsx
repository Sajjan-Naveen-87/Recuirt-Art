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
    <section id="insights" className="py-24 bg-[#cbd5b1]/20 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-5xl lg:text-6xl font-serif font-black text-slate-900 mb-6 tracking-tight">
              News and Insights
            </h2>
            <p className="text-slate-600 text-lg">
              Stay updated with the latest trends, strategies, and insights from our team of industry experts.
            </p>
          </div>
          <button className="flex items-center gap-2 font-bold text-slate-900 pb-1 border-b-2 border-slate-900 hover:text-slate-600 hover:border-slate-600 transition-colors shrink-0">
            View All Articles <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article.id} className="group cursor-pointer">
              <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden mb-6 relative">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-slate-900">
                  {article.category}
                </div>
              </div>
              
              <div className="space-y-4 pr-6">
                <div className="text-slate-500 font-medium text-sm">
                  {article.date}
                </div>
                <h3 className="text-2xl font-serif font-bold text-slate-900 group-hover:text-[#8a986c] transition-colors leading-tight">
                  {article.title}
                </h3>
                <p className="text-slate-600 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="pt-2 font-bold text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                  Read More <ArrowRight size={14} />
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
