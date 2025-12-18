export function PricingSection() {
  return (
    <section className="w-full py-24 bg-[#121212] relative overflow-hidden" id="pricing">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7c3bed]/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">💰 The Repair Shop</h2>
          <p className="text-gray-400">Simple pricing. No recurring subscriptions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Free Tier */}
          <div className="p-8 rounded-2xl bg-[#050505] border border-white/10 flex flex-col gap-6 h-full">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">🆓 Free Audit</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$0</span>
                <span className="text-sm text-gray-500 font-medium">/ forever</span>
              </div>
            </div>
            <button className="w-full h-12 rounded-lg bg-[#0a0a0a] border border-white/10 hover:bg-[#121212] hover:border-white/20 text-white font-bold transition-all">
              Scan for Free
            </button>
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span className="material-symbols-outlined text-[#22C55E] text-[20px]">check</span>
                Basic Resume Score
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span className="material-symbols-outlined text-[#22C55E] text-[20px]">check</span>
                Top 3 Critical Errors
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span className="material-symbols-outlined text-[#22C55E] text-[20px]">check</span>
                Format Audit
              </div>
            </div>
          </div>

          {/* Pro Tier */}
          <div className="p-8 rounded-2xl bg-[#0F0A1F] border border-[#7c3bed] shadow-[0_0_40px_-10px_rgba(124,59,237,0.3)] flex flex-col gap-6 relative h-full transform md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#7c3bed] text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-wide shadow-lg whitespace-nowrap">
              ⭐ MOST POPULAR - PAY ONCE
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">🚀 Pro Pass</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$4.99</span>
                <span className="text-sm text-gray-400 font-medium">/ one-time</span>
              </div>
            </div>
            <button className="w-full h-12 rounded-lg bg-[#7c3bed] hover:bg-[#6d28d9] text-white font-bold transition-all shadow-lg shadow-[#7c3bed]/25">
              Get Pro Access
            </button>
            <div className="space-y-4 pt-4 border-t border-[#7c3bed]/20">
              <div className="flex items-center gap-3 text-sm text-white font-medium">
                <span className="material-symbols-outlined text-[#7c3bed] text-[20px]">check_circle</span>
                Full Keyword Report
              </div>
              <div className="flex items-center gap-3 text-sm text-white font-medium">
                <span className="material-symbols-outlined text-[#7c3bed] text-[20px]">check_circle</span>
                AI-Powered Bullet Points
              </div>
              <div className="flex items-center gap-3 text-sm text-white font-medium">
                <span className="material-symbols-outlined text-[#7c3bed] text-[20px]">check_circle</span>
                Priority Parsing (Zero Wait)
              </div>
              <div className="flex items-center gap-3 text-sm text-white font-medium">
                <span className="material-symbols-outlined text-[#7c3bed] text-[20px]">check_circle</span>
                Unlimited Retries & Re-scans
              </div>
              <div className="flex items-center gap-3 text-sm text-white font-medium">
                <span className="material-symbols-outlined text-[#7c3bed] text-[20px]">check_circle</span>
                Lifetime Access
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}