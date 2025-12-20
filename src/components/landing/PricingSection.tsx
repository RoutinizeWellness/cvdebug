export function PricingSection() {
  return (
    <section className="w-full py-24 bg-[#121212] relative overflow-hidden" id="pricing">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7c3bed]/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Pay Per Use Pricing</h2>
          <p className="text-gray-200">No subscriptions. No hidden fees. Just pay for what you need.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Free Tier */}
          <div className="p-8 rounded-2xl bg-[#050505] border border-white/10 flex flex-col gap-6 h-full hover:border-primary/30 transition-all">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">🆓 Free Preview</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$0</span>
              </div>
              <p className="text-sm text-gray-200 mt-2">Basic scan to see where you stand.</p>
            </div>
            <button className="w-full h-12 rounded-lg bg-[#0a0a0a] border border-white/10 hover:bg-[#121212] hover:border-primary/30 text-white font-bold transition-all hover:scale-[1.02]">
              Try Free
            </button>
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 text-sm text-gray-200">
                <span className="text-xl">✅</span>
                Score 0-100
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-200">
                <span className="text-xl">✅</span>
                Top 3 keywords missing
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-200">
                <span className="text-xl">✅</span>
                Top 2 format issues
              </div>
            </div>
          </div>

          {/* Single Scan */}
          <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/10 flex flex-col gap-6 h-full hover:border-primary/30 transition-all">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">⚡ Single Scan</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$4.99</span>
                <span className="text-sm text-gray-400 font-medium">/ one-time</span>
              </div>
              <p className="text-sm text-gray-200 mt-2">One-time fix for this file. No history. No AI advice.</p>
            </div>
            <button className="w-full h-12 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 text-white font-bold transition-all hover:scale-[1.02]">
              Get Single Scan
            </button>
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 text-sm text-gray-200">
                <span className="text-xl">✅</span>
                Full ATS Analysis
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-200">
                <span className="text-xl">✅</span>
                Basic Keyword Report
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-200">
                <span className="text-xl">✅</span>
                Format Check
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-200">
                <span className="text-xl">✅</span>
                PDF Sanitization
              </div>
            </div>
          </div>

          {/* Interview Sprint - Most Popular */}
          <div className="p-8 rounded-2xl bg-[#0F0A1F] border-2 border-primary shadow-[0_0_40px_-10px_rgba(249,245,6,0.3)] flex flex-col gap-6 relative h-full transform md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black text-xs font-bold px-4 py-1.5 rounded-full tracking-wide shadow-lg whitespace-nowrap">
              🚀 MOST POPULAR
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">🎯 Interview Sprint</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">$14.99</span>
                <span className="text-lg text-gray-400 line-through decoration-red-500/50">$49.99</span>
              </div>
              <p className="text-xs text-primary font-bold mt-1">70% OFF - 7 days unlimited</p>
              <p className="text-sm text-gray-200 mt-2">Unlimited scans for 7 days. AI Bullet Point Rewriter. Dashboard to track your applications.</p>
            </div>
            <button className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 text-black font-bold transition-all hover:scale-[1.02] shadow-lg shadow-primary/25">
              Start Interview Sprint
            </button>
            <div className="space-y-4 pt-4 border-t border-primary/20">
              <div className="flex items-center gap-3 text-sm text-white font-medium">
                <span className="text-xl">✅</span>
                Unlimited Scans (7 Days)
              </div>
              <div className="flex items-center gap-3 text-sm text-white font-medium">
                <span className="text-xl">✅</span>
                AI Keyword Recommendations
              </div>
              <div className="flex items-center gap-3 text-sm text-white font-medium">
                <span className="text-xl">✅</span>
                Job Application Tracker
              </div>
              <div className="flex items-center gap-3 text-sm text-white font-medium">
                <span className="text-xl">✅</span>
                Targeted Match History
              </div>
              <div className="flex items-center gap-3 text-sm text-white font-medium">
                <span className="text-xl">✅</span>
                Priority Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}