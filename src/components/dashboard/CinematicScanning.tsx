import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ScanLog {
  status: "OK" | "WARN" | "INFO" | "CRIT";
  message: string;
  timestamp: string;
}

interface CinematicScanningProps {
  isScanning: boolean;
  progress: number;
  fileName?: string;
}

export function CinematicScanning({ isScanning, progress, fileName }: CinematicScanningProps) {
  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [currentPhase, setCurrentPhase] = useState(0);

  const scanningPhases = [
    { status: "INFO" as const, message: "Initializing AI Parser v2.1.0...", delay: 300 },
    { status: "OK" as const, message: "PDF structure validated", delay: 600 },
    { status: "INFO" as const, message: "Extracting text layers (OCR + Native)", delay: 900 },
    { status: "OK" as const, message: "Text extraction complete: 847 words", delay: 1200 },
    { status: "INFO" as const, message: "Detecting hierarchical structure...", delay: 1500 },
    { status: "OK" as const, message: "Estructura jerárquica detectada", delay: 1800 },
    { status: "WARN" as const, message: "3 secciones ilegibles para ATS antiguos", delay: 2100 },
    { status: "INFO" as const, message: "Extrayendo Keywords de alto impacto...", delay: 2400 },
    { status: "INFO" as const, message: "Running semantic analysis (Gemini 2.0 Flash)", delay: 2700 },
    { status: "OK" as const, message: "42 keywords matched with database", delay: 3000 },
    { status: "INFO" as const, message: "Analyzing ATS compatibility score...", delay: 3300 },
    { status: "WARN" as const, message: "Date format inconsistency detected", delay: 3600 },
    { status: "INFO" as const, message: "Calculating visibility metrics...", delay: 3900 },
    { status: "OK" as const, message: "Analysis complete - Generating report", delay: 4200 },
  ];

  useEffect(() => {
    if (!isScanning) {
      setLogs([]);
      setCurrentPhase(0);
      return;
    }

    if (currentPhase < scanningPhases.length) {
      const phase = scanningPhases[currentPhase];
      const timer = setTimeout(() => {
        const now = new Date();
        const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;

        setLogs(prev => [...prev, {
          status: phase.status,
          message: phase.message,
          timestamp
        }]);
        setCurrentPhase(prev => prev + 1);
      }, phase.delay);

      return () => clearTimeout(timer);
    }
  }, [isScanning, currentPhase]);

  if (!isScanning) return null;

  const statusColors = {
    OK: "text-emerald-500",
    WARN: "text-amber-500",
    INFO: "text-blue-400",
    CRIT: "text-rose-500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md"
    >
      <div className="w-full max-w-3xl mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-t-2xl p-6 border-t-2 border-x-2 border-primary/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
              <div>
                <h2 className="text-white text-xl font-bold">Analyzing your resume...</h2>
                <p className="text-slate-400 text-sm font-mono">{fileName || "Resume.pdf"}</p>
              </div>
            </div>
            <span className="text-primary text-2xl font-bold font-mono">{progress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            />
          </div>
        </div>

        {/* Terminal Body */}
        <div className="bg-[#0d1117] rounded-b-2xl border-2 border-t-0 border-slate-700 p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
          <div className="space-y-2 font-mono text-sm">
            <AnimatePresence>
              {logs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-3 items-start"
                >
                  <span className="text-slate-600 text-xs shrink-0 font-mono">
                    {log.timestamp}
                  </span>
                  <span className={`${statusColors[log.status]} font-bold shrink-0`}>
                    [{log.status}]
                  </span>
                  <span className="text-slate-300">{log.message}</span>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Blinking Cursor */}
            <motion.div
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="flex gap-3 items-center"
            >
              <span className="text-primary">➜</span>
              <span className="w-2 h-4 bg-slate-500 block"></span>
            </motion.div>
          </div>
        </div>

        {/* Footer Tip */}
        <div className="mt-4 text-center">
          <p className="text-slate-400 text-sm">
            💡 <span className="text-slate-300">Tip:</span> Nuestro AI escanea más de 40 señales que los ATS reales buscan
          </p>
        </div>
      </div>
    </motion.div>
  );
}
