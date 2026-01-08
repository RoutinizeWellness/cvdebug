import { motion } from "framer-motion";
import { Eye, Bug } from "lucide-react";

export function ComparisonVisualSection() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden" id="how-it-works">
      {/* Background texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-base font-semibold leading-7 text-primary">
            Reality Check
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            What you see vs. What they see
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            Most modern resume templates look great to humans but are a
            nightmare for robots. Columns, icons, and graphics often break the
            parsing logic.
          </p>
        </motion.div>

        <div className="relative mt-16 rounded-xl bg-slate-900/50 ring-1 ring-white/10 sm:mt-20">
          <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/30 to-secondary/30 opacity-20 blur-lg"></div>
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-px bg-slate-800/50 rounded-xl overflow-hidden border border-white/10">
            {/* Left: Beautiful Resume */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#e2e8f0] p-8 md:p-12 flex flex-col items-center"
            >
              <div className="mb-4 flex items-center gap-2 rounded-full bg-slate-900/10 px-3 py-1 text-xs font-medium text-slate-600">
                <Eye className="h-3.5 w-3.5" />
                Human View (PDF)
              </div>

              {/* Mock Resume Document */}
              <div className="w-full max-w-sm bg-white shadow-2xl rounded-sm p-6 aspect-[1/1.41] transform transition hover:scale-[1.02] duration-500 origin-top">
                <div className="flex gap-4 mb-6">
                  <div className="size-16 rounded-full bg-slate-200"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-3/4 bg-slate-800 rounded"></div>
                    <div className="h-3 w-1/2 bg-slate-400 rounded"></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 h-3/4">
                  <div className="col-span-1 bg-slate-50 h-full rounded p-2 space-y-2">
                    <div className="h-2 w-full bg-slate-200 rounded"></div>
                    <div className="h-2 w-2/3 bg-slate-200 rounded"></div>
                    <div className="h-2 w-full bg-slate-200 rounded"></div>
                  </div>
                  <div className="col-span-2 space-y-3">
                    <div className="h-3 w-1/3 bg-slate-300 rounded mb-2"></div>
                    <div className="h-2 w-full bg-slate-100 rounded"></div>
                    <div className="h-2 w-full bg-slate-100 rounded"></div>
                    <div className="h-2 w-5/6 bg-slate-100 rounded"></div>
                    <div className="h-3 w-1/3 bg-slate-300 rounded mb-2 mt-4"></div>
                    <div className="h-2 w-full bg-slate-100 rounded"></div>
                    <div className="h-2 w-full bg-slate-100 rounded"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Terminal/Robot View */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#0f172a] p-8 md:p-12 relative overflow-hidden group"
            >
              {/* Matrix rain effect overlay hint */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,22,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_2px,3px_100%]"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400 border border-red-500/20">
                    <Bug className="h-3.5 w-3.5" />
                    Robot View (Parsed)
                  </div>
                  <div className="flex gap-1.5">
                    <div className="size-2.5 rounded-full bg-slate-600"></div>
                    <div className="size-2.5 rounded-full bg-slate-600"></div>
                    <div className="size-2.5 rounded-full bg-slate-600"></div>
                  </div>
                </div>

                <div className="w-full flex-1 rounded bg-[#020617] border border-slate-700/50 p-4 font-mono text-xs sm:text-sm text-green-400 overflow-hidden shadow-inner">
                  <div className="opacity-70 select-none">
                    <span className="text-blue-400">root@ats-bot</span>:
                    <span className="text-blue-300">~</span>$ parse_resume.sh
                    --input=candidate.pdf
                    <br />
                    <span className="text-yellow-300">Warning:</span> Complex
                    formatting detected.
                    <br />
                    <span className="text-red-400">Error:</span> Column
                    structure misinterpreted as linear text.
                    <br />
                    Processing...
                    <br />
                    ----------------------------------------
                    <br />
                  </div>
                  <div className="mt-2 text-slate-300 break-words leading-relaxed">
                    {"{"}
                    <br />
                    &nbsp;&nbsp;"name":{" "}
                    <span className="text-red-400">
                      "Profile Contact Skills"
                    </span>
                    ,<br />
                    &nbsp;&nbsp;"email": <span className="text-red-400">
                      null
                    </span>
                    ,<br />
                    &nbsp;&nbsp;"experience": [<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;"Senior Designer 2018-2023
                    Marketing Team Lead",
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;"Managed budget of $50k Education
                    B.A. History"
                    <br />
                    &nbsp;&nbsp;],
                    <br />
                    &nbsp;&nbsp;"skills":{" "}
                    <span className="text-red-400">
                      "Java Photoshop Excel (Unreadable Icon)"
                    </span>
                    <br />
                    {"}"}
                    <br />
                    <span className="animate-pulse">_</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
