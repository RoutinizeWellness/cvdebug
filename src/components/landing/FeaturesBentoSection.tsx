export function FeaturesBentoSection() {
  return (
    <section className="w-full py-24 bg-[#050505] relative" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Why your resume is failing</h2>
          <p className="text-gray-200 text-lg max-w-2xl">We reverse-engineered the top parsing engines (Workday, Greenhouse, Lever) to give you an unfair advantage.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="group p-6 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-[#7c3bed]/50 transition-colors flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="size-12 rounded-lg bg-[#7c3bed]/10 flex items-center justify-center text-[#7c3bed] group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🔍</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Professional Parsing</h3>
              <p className="text-sm text-gray-200 leading-relaxed">
                We use enterprise-grade parsers to show you exactly how systems like Workday interpret your work history.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group p-6 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-red-500/50 transition-colors flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="size-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🖼️</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">The Image Trap</h3>
              <p className="text-sm text-gray-200 leading-relaxed">
                Detects invisible text and layout issues caused by designing in creative tools like Canva or Figma.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group p-6 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-[#7c3bed]/50 transition-colors flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="size-12 rounded-lg bg-[#7c3bed]/10 flex items-center justify-center text-[#7c3bed] group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Keyword Match</h3>
              <p className="text-sm text-gray-200 leading-relaxed">
                Scan your resume against specific Job Descriptions to see missing hard skills and keywords instantly.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group p-6 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-[#22C55E]/50 transition-colors flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#22C55E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="size-12 rounded-lg bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E] group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">📈</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">ROI Driven</h3>
              <p className="text-sm text-gray-200 leading-relaxed">
                Users with an 80+ score get 3x more callbacks on average. Data-backed optimization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}