import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewFooter } from "@/components/landing/NewFooter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { Terminal, Users, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function GoogleSDEOptimize() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeUsers, setActiveUsers] = useState(12);

  useEffect(() => {
    document.title = "Google SDE Resume Optimizer | CVDebug";

    // Simulate live counter fluctuation
    const interval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newVal = prev + change;
        return Math.max(8, Math.min(22, newVal));
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const googleKeywords = [
    "distributed systems",
    "system design",
    "scalability",
    "data structures",
    "algorithms",
    "C++",
    "Java",
    "Python",
    "Go",
    "technical leadership",
    "cross-functional",
    "innovation"
  ];

  const terminalLogs = [
    { type: "WARN", msg: "Missing keyword: 'distributed systems'", impact: "-12%" },
    { type: "CRIT", msg: "Project section unparseable", impact: "REJECTED" },
    { type: "WARN", msg: "No metrics in experience bullets", impact: "-8%" },
    { type: "INFO", msg: "Education format: OK", impact: "+0%" },
  ];

  return (
    <div className="dark min-h-screen flex flex-col overflow-x-hidden selection:bg-primary/30 selection:text-white">
      <style>{`
        body {
          background: linear-gradient(180deg, #020617 0%, #0f172a 100%);
        }
      `}</style>

      <NewNavbar />

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Live Counter Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel border border-primary/30">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
                </div>
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-mono text-slate-300">
                  <span className="text-primary font-bold">{activeUsers}</span> people optimizing for Google right now
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tight text-white text-center mb-6"
            >
              Google SDE Resume<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                ATS Parser Check
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-400 text-lg md:text-xl text-center max-w-3xl mx-auto mb-12"
            >
              Google uses Workday ATS. It rejects 76% of resumes before a human sees them.
              See exactly what their bot sees in your resume.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-primary to-secondary px-8 text-base font-bold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all"
              >
                <Terminal className="mr-2 h-5 w-5" />
                Check Your Google-Specific Robot View
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Terminal View Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                What Google's ATS Actually Sees
              </h2>
              <p className="text-slate-400 text-lg">
                Not stock photos. Real parsing logs from Workday's resume parser.
              </p>
            </motion.div>

            {/* Terminal Component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-panel rounded-xl overflow-hidden bg-[#0d1117] border border-slate-800 shadow-2xl"
            >
              {/* Terminal Header */}
              <div className="bg-[#161b22] px-4 py-3 flex items-center gap-2 border-b border-slate-800">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-[#22C55E]"></div>
                </div>
                <span className="ml-3 text-xs text-[#64748B] font-mono">workday-ats-parser — v4.2.1</span>
              </div>

              {/* Terminal Body */}
              <div className="p-6 font-mono text-sm space-y-3">
                <div className="text-[#22C55E]">➜ Parsing resume for: Google L4 SDE Position</div>
                <div className="text-[#64748B]">➜ Scanning document structure...</div>

                {terminalLogs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.15 }}
                    className="flex gap-3"
                  >
                    <span className={`font-bold shrink-0 ${
                      log.type === "CRIT" ? "text-rose-500" :
                      log.type === "WARN" ? "text-[#F59E0B]" :
                      "text-[#3B82F6]"
                    }`}>
                      [{log.type}]
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-300">{log.msg}</span>
                      <span className={`text-xs ${
                        log.impact.includes("REJECTED") ? "text-rose-400" :
                        log.impact.startsWith("-") ? "text-amber-400" :
                        "text-[#475569]"
                      }`}>
                        match_score impact: {log.impact}
                      </span>
                    </div>
                  </motion.div>
                ))}

                <div className="pt-4 border-t border-slate-800 mt-4">
                  <div className="text-rose-500 font-bold">
                    ✗ ATS Compatibility Score: 42/100 (LIKELY_REJECTED)
                  </div>
                </div>

                <div className="flex gap-2 items-center pt-2 animate-pulse">
                  <span className="text-[#22C55E]">➜</span>
                  <span className="w-2 h-4 bg-[#F8FAFC]0 block"></span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Keywords Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Google L4/L5 SDE Keywords That Matter
              </h2>
              <p className="text-slate-400 text-lg">
                Keywords extracted from 200+ Google SDE job postings analyzed in Q1 2025
              </p>
            </motion.div>

            <div className="flex flex-wrap gap-3 justify-center">
              {googleKeywords.map((keyword, index) => (
                <motion.div
                  key={keyword}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 font-mono text-sm hover:border-primary transition-colors"
                >
                  {keyword}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="glass-panel rounded-xl p-6 text-center"
              >
                <CheckCircle2 className="h-12 w-12 text-[#22C55E] mx-auto mb-3" />
                <div className="text-4xl font-bold text-white font-mono mb-2">73%</div>
                <div className="text-slate-400">of users fixed critical errors</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass-panel rounded-xl p-6 text-center"
              >
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-3" />
                <div className="text-4xl font-bold text-white font-mono mb-2">+34%</div>
                <div className="text-slate-400">average ATS score improvement</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-panel rounded-xl p-6 text-center"
              >
                <AlertTriangle className="h-12 w-12 text-[#F59E0B] mx-auto mb-3" />
                <div className="text-4xl font-bold text-white font-mono mb-2">4.2</div>
                <div className="text-slate-400">avg. critical errors per resume</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-panel rounded-2xl p-12 border border-primary/30"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Stop Guessing. Start Debugging.
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                Upload your resume and see the exact parsing errors blocking your Google application.
              </p>
              <Button
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-primary to-secondary px-10 text-lg font-bold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all"
              >
                <Terminal className="mr-2 h-5 w-5" />
                Run Free Scan Now
              </Button>
              <p className="text-xs text-[#64748B] mt-4 font-mono">No credit card required</p>
            </motion.div>
          </div>
        </section>
      </main>

      <NewFooter />
    </div>
  );
}
