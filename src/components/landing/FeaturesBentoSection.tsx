import { FolderKanban, AlertTriangle, Target, Sparkles } from "lucide-react";

export function FeaturesBentoSection() {
  return (
    <section className="w-full py-24 bg-[#050505] relative" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Why scattered resumes kill your job search</h2>
          <p className="text-gray-200 text-lg max-w-2xl">We built a project-based system that tracks every application, monitors CV health in real-time, and shows you exactly what each company wants.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="group p-6 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-primary/50 transition-colors flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <FolderKanban className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Project-Based Tracking</h3>
              <p className="text-sm text-gray-200 leading-relaxed">
                Create job search projects and track every application with match scores, keyword gaps, and company-specific insights.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group p-6 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-red-500/50 transition-colors flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="size-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <AlertTriangle className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Real-Time Health Monitor</h3>
              <p className="text-sm text-gray-200 leading-relaxed">
                Continuous CV integrity checks alert you instantly if an edit breaks ATS parsing—before you hit send.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group p-6 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-primary/50 transition-colors flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Target className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Keyword Gap Analysis</h3>
              <p className="text-sm text-gray-200 leading-relaxed">
                See side-by-side what Google wants vs. what Meta wants. Fill the gaps strategically for each company.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group p-6 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-[#22C55E]/50 transition-colors flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#22C55E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="size-12 rounded-lg bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E] group-hover:scale-110 group-hover:rotate-[-6deg] transition-all duration-300">
              <Sparkles className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">AI Cover Letter Generator</h3>
              <p className="text-sm text-gray-200 leading-relaxed">
                Generate tailored cover letters that explicitly bridge your keyword gaps for each specific role.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}