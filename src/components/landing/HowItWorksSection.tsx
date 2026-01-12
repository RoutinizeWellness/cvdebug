import { Eye, Terminal, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export function HowItWorksSection() {
  return (
    <section className="w-full relative" id="features">
      {/* Decorative Elements */}
      <div className="absolute -top-10 -left-10 w-24 h-24 bg-secondary/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>

      <div className="glass-card rounded-xl p-1 md:p-2 shadow-2xl overflow-hidden">
        <div className="bg-slate-950/50 rounded-lg border border-slate-800 flex flex-col md:flex-row h-[500px] md:h-[600px] relative">
          {/* Left: Human View */}
          <div className="flex-1 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col relative group">
            <div className="h-10 border-b border-slate-800 bg-slate-900/80 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Eye className="h-4 w-4 text-secondary" />
                <span>HUMAN_VIEW.PDF</span>
              </div>
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-slate-700"></div>
                <div className="size-2.5 rounded-full bg-slate-700"></div>
              </div>
            </div>
            <div className="flex-1 bg-white p-8 overflow-hidden relative">
              {/* Mock Resume Content */}
              <div className="flex flex-col gap-6 opacity-90 scale-[0.85] origin-top md:scale-100">
                <div className="flex justify-between items-start border-b-2 border-slate-200 pb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Alex Designer</h2>
                    <p className="text-slate-500 font-medium">Senior Product Designer</p>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    alex@example.com<br />San Francisco, CA
                  </div>
                </div>
                <div className="flex gap-8">
                  <div className="w-2/3 flex flex-col gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Experience</h3>
                      <div className="mb-3">
                        <div className="flex justify-between mb-1">
                          <span className="font-bold text-slate-800">TechCorp Inc.</span>
                          <span className="text-xs text-slate-500">2020 - Present</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Led design system overhaul resulting in 40% faster dev handoff.
                          Designed "feature X" increasing retention by 15%.
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Image Trap Simulation */}
                  <div className="w-1/3">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Skills</h3>
                    <div className="w-full h-32 bg-slate-100 rounded border border-slate-200 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100"></div>
                      <span className="text-xs font-bold text-slate-400 transform -rotate-12 relative z-10">Graph Image</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating Label */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur shadow-lg border border-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                <span className="size-2 rounded-full bg-green-500"></span> Looks great to humans
              </div>
            </div>
          </div>

          {/* Right: Robot View */}
          <div className="flex-1 flex flex-col bg-slate-950 relative">
            <div className="h-10 border-b border-slate-800 bg-slate-900/80 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Terminal className="h-4 w-4 text-primary" />
                <span>ROBOT_PARSER_LOGS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[10px] text-red-400 font-mono">2 CRITICAL ERRORS</span>
              </div>
            </div>
            <div className="flex-1 p-6 font-mono text-xs leading-relaxed text-slate-400 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-1">
                <div><span className="text-slate-600 select-none">01</span> <span className="text-teal-400">GET</span> resume_content <span className="text-slate-500">...loading</span></div>
                <div><span className="text-slate-600 select-none">02</span> <span className="text-green-400">SUCCESS:</span> Text layer extracted.</div>
                <div><span className="text-slate-600 select-none">03</span> <span className="text-blue-400">PARSING:</span> Contact Info</div>
                <div><span className="text-slate-600 select-none">04</span>   Name: "Alex Designer" <span className="text-emerald-400">✓ OK</span></div>
                <div><span className="text-slate-600 select-none">05</span>   Email: "alex@example.com" <span className="text-emerald-400">✓ OK</span></div>
                <div><span className="text-slate-600 select-none">06</span> <span className="text-blue-400">PARSING:</span> Experience Section</div>
                <div><span className="text-slate-600 select-none">07</span>   Company: "TechCorp Inc." <span className="text-emerald-400">✓ OK</span></div>
                <div><span className="text-slate-600 select-none">08</span> <span className="text-blue-400">PARSING:</span> Skills Section</div>
                <div><span className="text-slate-600 select-none">09</span> <span className="text-red-400 font-bold">ERROR:</span> <span className="bg-red-500/20 text-red-300 border-b border-dashed border-red-400">Unreadable Content Block detected.</span></div>
                <div><span className="text-slate-600 select-none">10</span> <span className="text-slate-500 italic">// ATS cannot read text inside images.</span></div>
                <div><span className="text-slate-600 select-none">11</span> <span className="text-slate-500 italic">// Candidate skills score: 0/10</span></div>
                <div><span className="text-slate-600 select-none">12</span></div>
                <div><span className="text-slate-600 select-none">13</span> <span className="text-blue-400">ANALYSIS:</span> Keywords</div>
                <div><span className="text-slate-600 select-none">14</span>   Found: "Design System", "Handoff"</div>
                <div><span className="text-slate-600 select-none">15</span>   <span className="text-yellow-400">WARNING:</span> Missing "Figma", "Agile" from JD.</div>
                <div><span className="text-slate-600 select-none">16</span></div>
                <div><span className="text-slate-600 select-none">17</span> <span className="animate-pulse">_</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}