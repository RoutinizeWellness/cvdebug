import { useNavigate } from "react-router";

export function HeroVisualizerSection() {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full pt-20 pb-20 md:pt-32 md:pb-32 overflow-hidden" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(124, 59, 237, 0.15) 0%, rgba(5, 5, 5, 0) 70%)' }}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center z-10 relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          ✨ Career Application Command Center
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 max-w-4xl">
          Your Job Search HQ <br className="hidden md:block" />With AI-Powered Safety Checks
        </h1>

        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-10 leading-relaxed">
          Track every application, <span className="text-primary font-bold">match against any Job Description</span>, and generate AI cover letters that bridge your keyword gaps.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-16">
          <button 
            onClick={() => navigate("/auth")}
            className="flex items-center justify-center h-12 px-8 bg-primary hover:bg-primary/90 text-black text-base font-bold rounded-lg transition-all hover:scale-[1.02] shadow-[0_0_20px_-5px_rgba(249,245,6,0.5)]"
          >
            <span className="mr-2 text-xl">🎯</span>
            Start Your First Project (Free)
          </button>
          <button 
            onClick={scrollToHowItWorks}
            className="flex items-center justify-center h-12 px-8 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 text-white text-base font-medium rounded-lg transition-all hover:scale-[1.02]"
          >
            <span className="mr-2 text-xl">▶️</span>
            Watch Demo
          </button>
        </div>

        {/* Split Screen Visualizer */}
        <div className="relative w-full max-w-5xl aspect-[16/9] md:aspect-[21/9] bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row group">
          {/* Human View */}
          <div className="flex-1 bg-white p-6 md:p-8 text-left border-r border-gray-200 md:border-r-0 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">👤 Human View</div>
            
            {/* Fake Resume Content */}
            <div className="flex flex-col gap-4 opacity-40 blur-[0.5px] scale-95 origin-top-left select-none pointer-events-none">
              <div className="w-1/3 h-8 bg-gray-800 rounded"></div>
              <div className="w-1/4 h-4 bg-gray-400 rounded"></div>
              <div className="w-full h-[1px] bg-gray-300 my-2"></div>
              <div className="flex gap-4">
                <div className="w-1/4 h-32 bg-gray-200 rounded"></div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="w-full h-3 bg-gray-300 rounded"></div>
                  <div className="w-5/6 h-3 bg-gray-300 rounded"></div>
                  <div className="w-4/6 h-3 bg-gray-300 rounded"></div>
                  <div className="w-full h-3 bg-gray-300 rounded mt-2"></div>
                  <div className="w-3/4 h-3 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>

            {/* Overlay warning icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center animate-pulse">
                <span className="material-symbols-outlined text-red-500 text-3xl">warning</span>
              </div>
            </div>
          </div>

          {/* Robot View (Terminal) */}
          <div className="flex-1 bg-[#0f0f0f] p-6 md:p-8 text-left font-mono text-xs md:text-sm overflow-hidden relative border-l border-white/5">
            <div className="absolute top-4 right-4 bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded uppercase tracking-wider border border-primary/30">🤖 Robot View</div>
            
            <div className="flex flex-col gap-1 text-gray-400">
              <div className="flex gap-2">
                <span className="text-gray-600">01</span>
                <span className="text-purple-400">const</span> <span className="text-blue-400">resumeData</span> = <span className="text-yellow-300">JSON</span>.<span className="text-blue-300">parse</span>(file);
              </div>
              <div className="flex gap-2">
                <span className="text-gray-600">02</span>
                <span className="text-gray-500">// Parsing layout...</span>
              </div>
              <div className="flex gap-2 bg-red-500/10 -mx-6 px-6 py-1 border-l-2 border-red-500">
                <span className="text-gray-600">03</span>
                <span className="text-red-400">❌ Error: Column structure not recognized.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-600">04</span>
                <span className="text-purple-400">if</span> (!keywords.<span className="text-blue-300">includes</span>(<span className="text-green-400">"Python"</span>)) {'{'}
              </div>
              <div className="flex gap-2 bg-red-500/10 -mx-6 px-6 py-1 border-l-2 border-red-500">
                <span className="text-gray-600">05</span>
                <span className="text-red-400">  status = "AUTO_REJECT";</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-600">06</span>
                {'}'}
              </div>
              <div className="flex gap-2 mt-2">
                <span className="text-gray-600">07</span>
                <span className="text-gray-500">_</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}