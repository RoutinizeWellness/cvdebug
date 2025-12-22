import { Radar, Lock, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const scanLogs = [
  { time: "10:42:01", type: "success", message: "Connection established to Core Engine" },
  { time: "10:42:02", type: "success", message: "PDF Parsing completed (2 pages found)" },
  { time: "10:42:03", type: "info", message: 'Extracting keywords: "React", "TypeScript", "Node.js"' },
  { time: "10:42:04", type: "warning", message: 'Gap detected: "Cloud Architecture" missing in experience' },
  { time: "10:42:05", type: "info", message: "Calculating ATS match score..." },
  { time: "10:42:06", type: "active", message: "Generating optimization suggestions..." },
];

interface StepScanningProps {
  score?: number;
  criticalIssues?: number;
  onUnlock?: () => void;
}

export function StepScanning({ score = 45, criticalIssues = 3, onUnlock }: StepScanningProps) {
  const [showPaywall, setShowPaywall] = useState(false);

  // Simulate scan completion after 3 seconds
  useState(() => {
    const timer = setTimeout(() => setShowPaywall(true), 3000);
    return () => clearTimeout(timer);
  });

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel rounded-2xl overflow-hidden flex flex-col relative"
    >
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
      <div className="p-8 flex flex-col gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center size-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <Radar className="h-12 w-12 text-cyan-500" />
            </motion.div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Scanning your future...</h3>
            <p className="text-cyan-400 text-sm font-mono animate-pulse">
              &gt;&gt; Analysis in progress: {showPaywall ? "100%" : "67%"}
            </p>
          </div>
        </div>

        <div className="bg-[#0c121e] rounded-lg border border-slate-800 p-4 font-mono text-xs h-40 overflow-hidden relative shadow-inner">
          <motion.div
            className="absolute w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_#22d3ee] left-0"
            animate={{ top: showPaywall ? "100%" : ["0%", "100%"] }}
            transition={{ duration: 2, repeat: showPaywall ? 0 : Infinity, ease: "linear" }}
          />
          <div className="flex flex-col gap-1 h-full overflow-y-auto text-slate-300">
            {scanLogs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.3 }}
                className="flex gap-2"
              >
                <span className="text-slate-600">{log.time}</span>
                <span className={
                  log.type === "success" ? "text-green-500" :
                  log.type === "warning" ? "text-yellow-400" :
                  log.type === "active" ? "text-cyan-400" :
                  "text-blue-400"
                }>
                  {log.type === "success" ? "✓" : log.type === "warning" ? "⚠" : log.type === "active" ? ">" : "ℹ"}
                </span>
                <span className={log.type === "active" ? "text-white animate-pulse" : ""}>
                  {log.message}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Paywall Result */}
        {showPaywall && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border-2 border-red-500/30 p-6 space-y-4"
          >
            {/* Score Display */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-bold text-lg">Your ATS Score</h4>
                <p className="text-slate-400 text-sm">Initial analysis complete</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-red-400">{score}/100</div>
                <p className="text-xs text-red-300">Below rejection threshold</p>
              </div>
            </div>

            {/* Critical Issues Warning */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
              <div className="p-2 rounded-full bg-red-500/20 text-red-400 shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h5 className="text-white font-bold text-sm mb-1">
                  {criticalIssues} Critical Errors Detected
                </h5>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Your CV has <span className="text-red-400 font-bold">"Image Trap"</span> issues. 
                  ATS systems can't read your content properly. This will cause automatic rejection.
                </p>
              </div>
            </div>

            {/* Locked Details */}
            <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700 relative overflow-hidden">
              <div className="absolute inset-0 backdrop-blur-sm bg-slate-900/80 flex items-center justify-center z-10">
                <div className="text-center">
                  <Lock className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-300 text-sm font-medium">Detailed Report Locked</p>
                </div>
              </div>
              <div className="opacity-30 space-y-2">
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                <div className="h-4 bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-slate-700 rounded w-5/6"></div>
              </div>
            </div>

            {/* CTA */}
            <Button 
              onClick={onUnlock}
              className="w-full h-14 bg-gradient-to-r from-primary to-yellow-400 hover:from-primary/90 hover:to-yellow-400/90 text-black font-black text-lg shadow-lg shadow-primary/30"
            >
              <Zap className="h-5 w-5 mr-2" />
              Unlock Full Report & Fix Errors - €19.99
            </Button>
            <p className="text-center text-xs text-slate-400">
              7-Day Interview Sprint • Unlimited Scans • AI Fixes
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}