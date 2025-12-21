import { Radar } from "lucide-react";
import { motion } from "framer-motion";

const scanLogs = [
  { time: "10:42:01", type: "success", message: "Connection established to Core Engine" },
  { time: "10:42:02", type: "success", message: "PDF Parsing completed (2 pages found)" },
  { time: "10:42:03", type: "info", message: 'Extracting keywords: "React", "TypeScript", "Node.js"' },
  { time: "10:42:04", type: "warning", message: 'Gap detected: "Cloud Architecture" missing in experience' },
  { time: "10:42:05", type: "info", message: "Calculating ATS match score..." },
  { time: "10:42:06", type: "active", message: "Generating optimization suggestions..." },
];

export function StepScanning() {
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
              &gt;&gt; Analysis in progress: 67%
            </p>
          </div>
        </div>

        <div className="bg-[#0c121e] rounded-lg border border-slate-800 p-4 font-mono text-xs h-40 overflow-hidden relative shadow-inner">
          <motion.div
            className="absolute w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_#22d3ee] left-0"
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
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
      </div>
    </motion.div>
  );
}
