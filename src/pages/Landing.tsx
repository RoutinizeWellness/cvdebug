import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const apiAny: any = api;

export default function Landing() {
  const betaStatus = useQuery(apiAny.users.getBetaStatus);
  const claimed = betaStatus?.claimed ?? 47;
  const remaining = betaStatus?.remaining ?? 53;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-primary/30 selection:text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-8 rounded bg-[#7c3bed]/20 text-[#7c3bed] border border-[#7c3bed]/30">
              <span className="material-symbols-outlined text-[20px]">terminal</span>
            </div>
            <h1 className="text-white text-lg font-bold tracking-tight">CVDebug</h1>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-sm font-medium text-gray-400 hover:text-white transition-colors" href="#features">Features</a>
            <a className="text-sm font-medium text-gray-400 hover:text-white transition-colors" href="#pricing">Pricing</a>
            <a className="text-sm font-medium text-gray-400 hover:text-white transition-colors" href="#faq">FAQ</a>
          </div>
          <button className="hidden md:flex items-center justify-center h-9 px-4 bg-[#22C55E] hover:bg-[#16a34a] text-black text-sm font-bold rounded-lg transition-colors shadow-[0_0_15px_-3px_rgba(34,197,94,0.4)]">
            Get Started
          </button>
          <button className="md:hidden text-white">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full pt-20 pb-20 md:pt-32 md:pb-32 overflow-hidden" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(124, 59, 237, 0.15) 0%, rgba(5, 5, 5, 0) 70%)' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center z-10 relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7c3bed]/10 border border-[#7c3bed]/20 text-[#7c3bed] text-xs font-semibold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7c3bed] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7c3bed]"></span>
            </span>
            New ATS Parser Engine v2.0
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 max-w-4xl">
            Is your Resume <br className="hidden md:block" />Invisible to Robots?
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
            90% of resumes are auto-rejected before a human sees them. We show you exactly what the ATS sees, so you can fix parsing errors and get hired.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-16">
            <button className="flex items-center justify-center h-12 px-8 bg-[#7c3bed] hover:bg-[#6d28d9] text-white text-base font-bold rounded-lg transition-all hover:scale-[1.02] shadow-[0_0_20px_-5px_rgba(124,59,237,0.5)]">
              <span className="material-symbols-outlined mr-2 text-[20px]">bug_report</span>
              Debug my Resume (Free Scan)
            </button>
            <button className="flex items-center justify-center h-12 px-8 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-base font-medium rounded-lg transition-colors">
              <span className="material-symbols-outlined mr-2 text-[20px]">play_circle</span>
              Watch Demo
            </button>
          </div>

          {/* Split Screen Visualizer */}
          <div className="relative w-full max-w-5xl aspect-[16/9] md:aspect-[21/9] bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row group">
            {/* Human View */}
            <div className="flex-1 bg-white p-6 md:p-8 text-left border-r border-gray-200 md:border-r-0 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Human View</div>
              
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
              <div className="absolute top-4 right-4 bg-[#7c3bed]/20 text-[#7c3bed] text-xs font-bold px-2 py-1 rounded uppercase tracking-wider border border-[#7c3bed]/30">Robot View</div>
              
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
                  <span className="text-red-400">Error: Column structure not recognized.</span>
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

      {/* Social Proof */}
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

      {/* Features Bento Grid */}
      <section className="w-full py-24 bg-[#050505] relative" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Why your resume is failing</h2>
            <p className="text-gray-400 text-lg max-w-2xl">We reverse-engineered the top parsing engines (Workday, Greenhouse, Lever) to give you an unfair advantage.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="group p-6 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-[#7c3bed]/50 transition-colors flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="size-12 rounded-lg bg-[#7c3bed]/10 flex items-center justify-center text-[#7c3bed] group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined">database</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Professional Parsing</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  We use enterprise-grade parsers to show you exactly how systems like Workday interpret your work history.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-red-500/50 transition-colors flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="size-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined">image</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">The Image Trap</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Detects invisible text and layout issues caused by designing in creative tools like Canva or Figma.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-[#7c3bed]/50 transition-colors flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="size-12 rounded-lg bg-[#7c3bed]/10 flex items-center justify-center text-[#7c3bed] group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined">target</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Keyword Match</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Scan your resume against specific Job Descriptions to see missing hard skills and keywords instantly.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group p-6 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-[#22C55E]/50 transition-colors flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#22C55E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="size-12 rounded-lg bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E] group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined">trending_up</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">ROI Driven</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Users with an 80+ score get 3x more callbacks on average. Data-backed optimization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-24 bg-[#121212] relative overflow-hidden" id="pricing">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7c3bed]/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">The Repair Shop</h2>
            <p className="text-gray-400">Simple pricing. No recurring subscriptions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Free Tier */}
            <div className="p-8 rounded-2xl bg-[#050505] border border-white/10 flex flex-col gap-6 h-full">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Free Audit</h3>
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
                MOST POPULAR - PAY ONCE
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Pro Pass</h3>
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

      {/* FAQ Section */}
      <section className="w-full py-24 bg-[#050505] border-t border-white/10" id="faq">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">Common Queries</h2>
          
          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <details className="group bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden transition-all duration-300 open:border-[#7c3bed]/50">
              <summary className="flex items-center justify-between p-6 cursor-pointer select-none">
                <h3 className="text-base font-medium text-white group-hover:text-[#7c3bed] transition-colors">Do you sell my data?</h3>
                <span className="material-symbols-outlined transform group-open:rotate-180 transition-transform text-gray-400">expand_more</span>
              </summary>
              <div className="px-6 pb-6 pt-0 text-gray-400 text-sm leading-relaxed">
                Never. Your resume is parsed in memory and stored securely only for your session. We do not sell data to recruiters or third parties.
              </div>
            </details>

            {/* FAQ Item 2 */}
            <details className="group bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden transition-all duration-300 open:border-[#7c3bed]/50">
              <summary className="flex items-center justify-between p-6 cursor-pointer select-none">
                <h3 className="text-base font-medium text-white group-hover:text-[#7c3bed] transition-colors">What is the "Image Trap"?</h3>
                <span className="material-symbols-outlined transform group-open:rotate-180 transition-transform text-gray-400">expand_more</span>
              </summary>
              <div className="px-6 pb-6 pt-0 text-gray-400 text-sm leading-relaxed">
                Many modern resume templates (from Canva or Photoshop) export text as flattened images or complex vector shapes. While they look good to humans, ATS robots see blank pages. Our tool detects this instantly.
              </div>
            </details>

            {/* FAQ Item 3 */}
            <details className="group bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden transition-all duration-300 open:border-[#7c3bed]/50">
              <summary className="flex items-center justify-between p-6 cursor-pointer select-none">
                <h3 className="text-base font-medium text-white group-hover:text-[#7c3bed] transition-colors">Does this work for all industries?</h3>
                <span className="material-symbols-outlined transform group-open:rotate-180 transition-transform text-gray-400">expand_more</span>
              </summary>
              <div className="px-6 pb-6 pt-0 text-gray-400 text-sm leading-relaxed">
                Yes, but it is optimized for technical and corporate roles where ATS usage is heaviest (Tech, Finance, Healthcare, Engineering).
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-white/10 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-6 rounded bg-[#7c3bed]/20 text-[#7c3bed] border border-[#7c3bed]/30">
              <span className="material-symbols-outlined text-[14px]">terminal</span>
            </div>
            <span className="text-white font-bold text-sm tracking-tight">CVDebug</span>
          </div>
          <div className="flex items-center gap-8">
            <a className="text-sm text-gray-500 hover:text-white transition-colors" href="#">Terms of Service</a>
            <a className="text-sm text-gray-500 hover:text-white transition-colors" href="#">Privacy Policy</a>
            <a className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1" href="#">
              Twitter <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
            </a>
          </div>
          <div className="text-xs text-gray-600">
            © 2024 CVDebug. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}