export function SocialProofSection() {
  return (
    <section className="w-full py-12 border-y border-white/10 bg-[#0a0a0a]/50">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm font-medium text-gray-500 mb-8">Trusted by 2,000+ job seekers at top tech companies</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="h-8 flex items-center gap-2 text-white font-bold text-xl">
            <span className="text-2xl">🔍</span> GOOGLE
          </div>
          <div className="h-8 flex items-center gap-2 text-white font-bold text-xl">
            <span className="text-2xl">♾️</span> META
          </div>
          <div className="h-8 flex items-center gap-2 text-white font-bold text-xl">
            <span className="text-2xl">🧠</span> NVIDIA
          </div>
          <div className="h-8 flex items-center gap-2 text-white font-bold text-xl">
            <span className="text-2xl">🪟</span> MICROSOFT
          </div>
        </div>
      </div>
    </section>
  );
}
