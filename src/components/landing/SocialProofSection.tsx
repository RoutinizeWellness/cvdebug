export function SocialProofSection() {
  return (
    <section className="w-full py-12 border-y border-white/10 bg-[#0a0a0a]/50">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm font-medium text-gray-500 mb-8">Trusted by 2,000+ job seekers at top tech companies</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="h-8 flex items-center gap-2 text-white font-bold text-xl">
            <span className="material-symbols-outlined">search</span> GOOGLE
          </div>
          <div className="h-8 flex items-center gap-2 text-white font-bold text-xl">
            <span className="material-symbols-outlined">all_inclusive</span> META
          </div>
          <div className="h-8 flex items-center gap-2 text-white font-bold text-xl">
            <span className="material-symbols-outlined">memory</span> NVIDIA
          </div>
          <div className="h-8 flex items-center gap-2 text-white font-bold text-xl">
            <span className="material-symbols-outlined">grid_view</span> MICROSOFT
          </div>
        </div>
      </div>
    </section>
  );
}
