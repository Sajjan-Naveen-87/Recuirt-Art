function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-8">
        <h2 className="text-5xl lg:text-7xl font-serif font-black text-slate-900 text-center mb-16 tracking-tight">
          Testimonials
        </h2>

        <div className="flex flex-col items-center">
          {/* Giant Quote Marks */}
          <div className="text-[12rem] font-serif font-black text-slate-900 leading-none h-[140px] mb-8 select-none flex self-start">
            &ldquo;
          </div>

          <div className="text-center space-y-4 max-w-3xl -mt-10">
            <h3 className="text-3xl font-bold text-slate-900">
              Steve Jobs
            </h3>
            
            <p className="text-xl font-serif font-bold text-slate-900 mb-8">
              Apple
            </p>
            
            <p className="text-slate-600 text-xl leading-relaxed mt-8">
              I am writing to express my sincere appreciation for the support you provided during my job search. Your expertise and guidance were invaluable in helping me navigate the hiring process and ultimately secure a position that is a great fit for my skills and career goals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
