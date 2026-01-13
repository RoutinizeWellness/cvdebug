import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  History, 
  Sparkles, 
  Lock, 
  Download,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  GripVertical,
  ChevronDown,
  Edit,
  PlusCircle,
  CheckCircle,
  Diamond
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function WritingForge() {
  const [tone, setTone] = useState("technical");
  const [showUpgradeTooltip, setShowUpgradeTooltip] = useState(false);

  const handleRegenerate = () => {
    toast.success("Regenerating content with AI...");
  };

  const handleDownloadPDF = () => {
    toast.error("Upgrade to Interview Sprint to unlock PDF downloads");
  };

  const keywordGaps = [
    { name: "Edge Functions", completed: false },
    { name: "Turbopack", completed: false },
    { name: "Incremental Builds", completed: false },
    { name: "React 18", completed: true }
  ];

  return (
    <div className="h-full flex flex-col bg-[#0F172A]">
      {/* Top Navigation */}
      <header className="flex items-center justify-between border-b border-slate-800 bg-[#0F172A] px-6 py-3 shrink-0">
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-6">
            <a className="text-slate-400 hover:text-white text-sm font-medium transition-colors" href="#">
              Dashboard
            </a>
            <span className="text-white text-sm font-medium border-b-2 border-primary pb-0.5">
              Writing Forge
            </span>
            <a className="text-slate-400 hover:text-white text-sm font-medium transition-colors" href="#">
              Interview Sprint
            </a>
          </nav>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar: Configuration */}
        <aside className="w-80 flex flex-col border-r border-slate-800 bg-slate-900/40 overflow-y-auto backdrop-blur-xl">
          <div className="p-6 flex flex-col gap-8">
            {/* Tone Configuration */}
            <div className="flex flex-col gap-3">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Tone Strategy
              </label>
              <div className="relative">
                <select 
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full appearance-none rounded-lg bg-slate-800 border border-slate-700 text-white p-3 pr-10 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                >
                  <option value="technical">Technical Specialist</option>
                  <option value="executive">Executive Leader</option>
                  <option value="creative">Creative Storyteller</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Active Mission Card */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Active Mission
                </label>
                <button className="text-primary text-xs font-medium hover:text-primary/80 transition-colors flex items-center gap-1">
                  <Edit className="h-3 w-3" />
                  Edit
                </button>
              </div>
              <div className="flex flex-col gap-4 rounded-xl bg-[#1E293B] p-4 border border-slate-700 shadow-lg relative overflow-hidden group">
                {/* Decorative gradient blob */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all duration-500" />
                
                <div className="flex items-center gap-3 relative z-10">
                  <div className="size-10 rounded-lg bg-white p-2 flex items-center justify-center shadow-inner">
                    <svg className="w-6 h-6 text-black fill-current" fill="none" viewBox="0 0 76 65" xmlns="http://www.w3.org/2000/svg">
                      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-bold leading-tight">Senior Frontend Dev</h3>
                    <p className="text-slate-400 text-xs">Vercel Inc.</p>
                  </div>
                </div>
                
                <div className="flex gap-2 relative z-10">
                  <div className="flex-1 bg-slate-900/50 rounded p-2 border border-slate-800">
                    <span className="block text-[10px] text-slate-500 uppercase">Match</span>
                    <span className="block text-blue-400 font-mono text-sm font-bold">87%</span>
                  </div>
                  <div className="flex-1 bg-slate-900/50 rounded p-2 border border-slate-800">
                    <span className="block text-[10px] text-slate-500 uppercase">Gap</span>
                    <span className="block text-red-400 font-mono text-sm font-bold">13%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Keyword Gaps Widget */}
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex justify-between items-center">
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Keyword Gaps
                </label>
                <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded border border-red-500/30">
                  3 Critical
                </span>
              </div>
              <div className="flex flex-col gap-2 font-mono text-xs">
                {keywordGaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded border transition-colors ${
                      gap.completed
                        ? "bg-slate-900/20 border-slate-800/30 opacity-50"
                        : "bg-slate-900/40 border-slate-800/50 hover:border-primary/50 group cursor-pointer"
                    }`}
                  >
                    <span className={gap.completed ? "text-slate-500 line-through" : "text-slate-300 group-hover:text-primary transition-colors"}>
                      {gap.name}
                    </span>
                    {gap.completed ? (
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <PlusCircle className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-6 mt-auto border-t border-slate-800">
            <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
              Advanced Config
            </Button>
          </div>
        </aside>

        {/* Center: Editor Canvas */}
        <main className="flex-1 flex flex-col relative bg-slate-900/50">
          {/* Breadcrumbs & Heading */}
          <div className="flex flex-col border-b border-slate-800/50 bg-[#0F172A]/80 backdrop-blur-sm">
            <div className="px-8 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs mb-2">
                  <a className="text-slate-500 hover:text-slate-300" href="#">Home</a>
                  <span className="text-slate-600">/</span>
                  <span className="text-primary font-medium">Writing Forge</span>
                </div>
                <div className="flex items-center gap-3">
                  <h1 className="text-white text-2xl font-black leading-tight tracking-tight">
                    Draft #24 - Resume V3
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wide">
                    Autosaved
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button variant="ghost" className="text-slate-300 hover:text-white">
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
                <Button 
                  onClick={handleRegenerate}
                  className="bg-primary/10 hover:bg-primary/20 text-primary hover:text-white border border-primary/30 hover:border-primary shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>

                {/* Locked Download Button */}
                <div
                  className="relative"
                  onMouseEnter={() => setShowUpgradeTooltip(true)}
                  onMouseLeave={() => setShowUpgradeTooltip(false)}
                >
                  <Button
                    onClick={handleDownloadPDF}
                    disabled
                    className="bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700 opacity-60 relative"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Download PDF
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                  </Button>

                  {/* Enhanced Tooltip with Power Gradient CTA */}
                  {showUpgradeTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full right-0 mt-3 w-72 p-4 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="text-primary shrink-0 pt-0.5">
                          <Diamond className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-bold mb-1">Interview Sprint Required</p>
                          <p className="text-slate-400 text-xs leading-relaxed">
                            Unlock professional PDF exports, ATS optimization, and unlimited regenerations.
                          </p>
                        </div>
                      </div>

                      {/* Benefits List */}
                      <div className="space-y-2 mb-3 pl-9">
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <span className="text-green-400">✓</span>
                          <span>Unlimited PDF downloads</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <span className="text-green-400">✓</span>
                          <span>ATS-optimized formatting</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <span className="text-green-400">✓</span>
                          <span>AI-powered improvements</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {/* Navigate to pricing */}}
                        className="btn-power w-full px-4 py-2.5 rounded-lg text-white text-sm font-bold border-0 flex items-center justify-center gap-2 group"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Upgrade to Interview Sprint</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Editor Toolbar */}
            <div className="px-8 py-2 flex items-center gap-1 border-t border-slate-800/50">
              <Button variant="ghost" size="sm" className="p-1.5 text-slate-400 hover:text-white">
                <Bold className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1.5 text-slate-400 hover:text-white">
                <Italic className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1.5 text-slate-400 hover:text-white">
                <Underline className="h-5 w-5" />
              </Button>
              <div className="w-px h-5 bg-slate-700 mx-2" />
              <Button variant="ghost" size="sm" className="p-1.5 text-slate-400 hover:text-white">
                <List className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1.5 text-slate-400 hover:text-white">
                <ListOrdered className="h-5 w-5" />
              </Button>
              <div className="w-px h-5 bg-slate-700 mx-2" />
              <Button variant="ghost" size="sm" className="p-1.5 text-slate-400 hover:text-white">
                <Link2 className="h-5 w-5" />
              </Button>
              <div className="flex-1" />
              <span className="text-xs text-slate-500 font-mono">Markdown Supported</span>
            </div>
          </div>

          {/* Editor Surface */}
          <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-[#0F172A] relative">
            {/* Abstract Background Pattern */}
            <div 
              className="absolute inset-0 z-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#1E293B 1px, transparent 1px)",
                backgroundSize: "24px 24px"
              }}
            />

            <div className="w-full max-w-[800px] bg-[#1E293B] min-h-[1100px] shadow-2xl rounded-sm p-16 text-slate-100 border border-slate-700/50 z-10 relative">
              {/* Document Header */}
              <div className="border-b border-slate-700 pb-8 mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Alex Chen</h1>
                <p className="text-slate-400 text-lg">Senior Frontend Engineer</p>
                <div className="flex gap-4 mt-4 text-sm text-slate-400">
                  <span>San Francisco, CA</span>
                  <span>•</span>
                  <span>alex.chen@example.com</span>
                  <span>•</span>
                  <span>github.com/alexc</span>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="mb-8 group/section relative">
                <div className="absolute -left-12 top-0 opacity-0 group-hover/section:opacity-100 transition-opacity">
                  <button className="p-1.5 text-slate-500 hover:text-primary">
                    <GripVertical className="h-5 w-5" />
                  </button>
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                  Professional Summary
                </h3>
                <p className="text-base leading-relaxed text-slate-200">
                  Results-oriented Senior Frontend Engineer with 7+ years of experience building scalable web applications.
                  Specialized in the modern React ecosystem, including{" "}
                  <span className="underline decoration-primary decoration-2 underline-offset-4 hover:bg-primary/10 rounded px-1 cursor-pointer transition-all relative group/highlight">
                    Next.js architecture
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-primary text-white text-xs rounded opacity-0 group-hover/highlight:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      Keywords matched +5%
                    </span>
                  </span>{" "}
                  and server-side rendering performance optimization. Proven track record of leading teams at high-growth startups to deliver{" "}
                  <span className="underline decoration-primary decoration-2 underline-offset-4 hover:bg-primary/10 rounded px-1 cursor-pointer transition-all relative group/highlight">
                    robust UI systems
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-primary text-white text-xs rounded opacity-0 group-hover/highlight:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      Tone: Executive
                    </span>
                  </span>{" "}
                  that drive user engagement. Passionate about improving developer experience and implementing CI/CD pipelines.
                </p>
              </div>

              {/* Experience */}
              <div className="mb-8 group/section relative">
                <div className="absolute -left-12 top-0 opacity-0 group-hover/section:opacity-100 transition-opacity">
                  <button className="p-1.5 text-slate-500 hover:text-primary">
                    <GripVertical className="h-5 w-5" />
                  </button>
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
                  Experience
                </h3>
                
                <div className="mb-6">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-lg font-bold text-white">Lead UI Engineer</h4>
                    <span className="text-sm text-slate-400">2021 - Present</span>
                  </div>
                  <p className="text-blue-400 font-medium text-sm mb-3">TechFlow Systems</p>
                  <ul className="list-disc pl-4 space-y-2 text-sm text-slate-300 marker:text-slate-500">
                    <li>
                      Architected a migration from legacy monolith to micro-frontends using{" "}
                      <span className="underline decoration-primary decoration-2 underline-offset-4 hover:bg-primary/10 rounded px-1 cursor-pointer transition-all">
                        Module Federation
                      </span>
                      , reducing build times by 40%.
                    </li>
                    <li>Mentored 5 junior developers and established code review standards that decreased bug rate by 25%.</li>
                    <li>Implemented automated accessibility testing (WCAG 2.1) across the component library.</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-lg font-bold text-white">Frontend Developer</h4>
                    <span className="text-sm text-slate-400">2018 - 2021</span>
                  </div>
                  <p className="text-blue-400 font-medium text-sm mb-3">Creativ Agency</p>
                  <ul className="list-disc pl-4 space-y-2 text-sm text-slate-300 marker:text-slate-500">
                    <li>Developed interactive marketing sites for Fortune 500 clients using WebGL and GSAP.</li>
                    <li>Collaborated with design teams to create pixel-perfect implementations from Figma prototypes.</li>
                  </ul>
                </div>
              </div>

              {/* AI Suggestion Placeholder */}
              <div className="p-4 rounded-lg border border-dashed border-primary/30 bg-primary/5 flex items-center justify-center gap-3 cursor-pointer hover:bg-primary/10 transition-colors group/ai">
                <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover/ai:scale-110 transition-transform">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="text-primary font-medium text-sm">
                  AI Suggestion: Add "Technical Skills" section based on Vercel requirements?
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
