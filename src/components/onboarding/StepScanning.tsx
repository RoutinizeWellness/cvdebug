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
      className="bg-white rounded-2xl overflow-hidden flex flex-col relative border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
    >
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-overlay"></div>
      <div className="p-8 flex flex-col gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center size-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <Radar className="h-12 w-12 text-[#64748B]" />
            </motion.div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0F172A]">Scanning your future...</h3>
            <p className="text-[#64748B] text-sm font-mono animate-pulse">
              &gt;&gt; Analysis in progress: {showPaywall ? "100%" : "67%"}
            </p>
          </div>
        </div>

        <div className="bg-[#0c121e] rounded-lg border border-[#1e293b] p-4 font-mono text-xs h-40 overflow-hidden relative shadow-inner">
          <motion.div
            className="absolute w-full h-0.5 bg-[#64748B] shadow-[0_0_10px_#64748B] left-0"
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
                  log.type === "success" ? "text-[#22C55E]" :
                    log.type === "warning" ? "text-[#F59E0B]" :
                      log.type === "active" ? "text-[#64748B]" :
                        "text-[#64748B]"
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
            className="bg-gradient-to-br from-[#FEF2F2] to-[#FEE2E2] rounded-xl border-2 border-[#EF4444]/30 p-6 space-y-4"
          >
            {/* Score Display */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[#0F172A] font-bold text-lg">Your ATS Score</h4>
                <p className="text-[#64748B] text-sm">Initial analysis complete</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-[#EF4444]">{score}/100</div>
                <p className="text-xs text-[#DC2626]">Below rejection threshold</p>
              </div>
            </div>

            {/* Critical Issues Warning */}
            <div className="bg-[#FEE2E2] border border-[#EF4444]/40 rounded-lg p-4 flex items-start gap-3">
              <div className="p-2 rounded-full bg-[#EF4444]/20 text-[#EF4444] shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h5 className="text-[#0F172A] font-bold text-sm mb-1">
                  {criticalIssues} Critical Errors Detected
                </h5>
                <p className="text-[#475569] text-xs leading-relaxed">
                  Your CV has <span className="text-[#EF4444] font-bold">"Image Trap"</span> issues.
                  ATS systems can't read your content properly. This will cause automatic rejection.
                </p>
              </div>
            </div>

            {/* Locked Details */}
            <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0] relative overflow-hidden">
              <div className="absolute inset-0 backdrop-blur-sm bg-white/80 flex items-center justify-center z-10">
                <div className="text-center">
                  <Lock className="h-8 w-8 text-[#64748B] mx-auto mb-2" />
                  <p className="text-[#475569] text-sm font-medium">Detailed Report Locked</p>
                </div>
              </div>
              <div className="opacity-30 space-y-2">
                <div className="h-4 bg-[#E2E8F0] rounded w-3/4"></div>
                <div className="h-4 bg-[#E2E8F0] rounded w-full"></div>
                <div className="h-4 bg-[#E2E8F0] rounded w-5/6"></div>
              </div>
            </div>

            {/* CTA */}
            <Button
              onClick={onUnlock}
              className="w-full h-14 bg-gradient-to-r from-[#64748B] to-[#F59E0B] hover:from-[#64748B]/90 hover:to-[#F59E0B]/90 text-white font-black text-lg shadow-lg shadow-[#64748B]/30"
            >
              <Zap className="h-5 w-5 mr-2" />
              Unlock Full Report & Fix Errors - €24.99
            </Button>
            <p className="text-center text-xs text-[#64748B]">
              7-Day Career Sprint • Unlimited Scans • AI Fixes
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
