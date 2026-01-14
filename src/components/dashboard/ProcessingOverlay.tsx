import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ProcessingOverlayProps {
  isUploading?: boolean;
  isProcessing?: boolean;
  statusMessage?: string;
  progress?: number;
}

export function ProcessingOverlay({ isUploading, isProcessing, statusMessage, progress = 0 }: ProcessingOverlayProps) {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [logs, setLogs] = useState<Array<{ time: string; type: string; message: string; color: string }>>([]);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // Simulate progress if not provided
    if (progress === 0 && isProcessing) {
      const interval = setInterval(() => {
        setCurrentProgress((prev) => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 5;
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setCurrentProgress(progress);
    }
  }, [progress, isProcessing]);

  useEffect(() => {
    // Timer
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Add logs progressively
    const logMessages = [
      { type: "INIT", message: "Loading core modules...", color: "text-[#8B5CF6]" },
      { type: "SCAN", message: "Detecting document layout structure...", color: "text-[#3B82F6]" },
      { type: "INFO", message: "OCR confidence level: 98.2%", color: "text-[#22C55E]" },
      { type: "PROC", message: "Extracting experience keywords...", color: "text-[#3B82F6]" },
      { type: "ANAL", message: "Analyzing ATS compatibility...", color: "text-[#3B82F6]" },
      { type: "KEYW", message: "Identifying missing keywords...", color: "text-[#F59E0B]" },
      { type: "FORM", message: "Checking formatting issues...", color: "text-[#3B82F6]" },
      { type: "SCORE", message: "Calculating ATS score...", color: "text-[#22C55E]" },
    ];

    let currentIndex = 0;
    const logInterval = setInterval(() => {
      if (currentIndex < logMessages.length) {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        setLogs((prev) => [
          ...prev,
          {
            time: timeStr,
            type: logMessages[currentIndex].type,
            message: logMessages[currentIndex].message,
            color: logMessages[currentIndex].color,
          },
        ]);
        currentIndex++;
      }
    }, 2000);

    return () => clearInterval(logInterval);
  }, []);

  const eta = Math.max(0, 15 - elapsedTime);

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col overflow-hidden">
      {/* Background Grid Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10 bg-[size:40px_40px] bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] z-0"></div>

      {/* Top Nav Bar */}
      <header className="relative z-20 flex items-center justify-between border-b border-[#E2E8F0] px-8 py-4 bg-[#FFFFFF]/80 backdrop-blur-md shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[#0F172A] shadow-lg">
            <span className="material-symbols-outlined text-xl">view_in_ar</span>
          </div>
          <h2 className="text-[#0F172A] text-lg font-bold tracking-tight">
            CVDebug <span className="text-[#3B82F6] font-mono text-xs ml-2">v2.0 BETA</span>
          </h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3B82F6]"></span>
            </span>
            <span className="text-[#3B82F6] text-xs font-mono font-medium">ENGINE ONLINE</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 w-full max-w-7xl mx-auto">
        <div className="w-full max-w-4xl flex flex-col items-center gap-12">
          {/* Headline */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight">
              ANALYZING DOCUMENT
            </h1>
            <p className="text-[#475569] font-mono text-sm tracking-wide uppercase">
              Core Engine / Layer Extraction / Sequence 4A
            </p>
          </div>

          {/* Central 3D Scanning Visualization */}
          <div className="perspective-[1000px] relative w-full max-w-[320px] aspect-[1/1.4] md:max-w-[380px] group">
            {/* Glowing backdrop */}
            <div className="absolute inset-0 bg-blue-200/30 blur-[60px] rounded-full animate-pulse"></div>

            {/* The 3D Card */}
            <div className="relative w-full h-full bg-[#FFFFFF]/90 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-[#E2E8F0]"
                 style={{ transform: "rotateY(-15deg) rotateX(5deg)", transformStyle: "preserve-3d" }}>
              {/* Fake Resume Content (Skeleton) */}
              <div className="p-8 flex flex-col gap-6 h-full opacity-60">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-full bg-slate-200"></div>
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-4 w-3/4 bg-slate-300 rounded"></div>
                    <div className="h-3 w-1/2 bg-slate-200 rounded"></div>
                  </div>
                </div>
                <div className="space-y-3 mt-4">
                  <div className="h-2 w-full bg-slate-200 rounded"></div>
                  <div className="h-2 w-full bg-slate-200 rounded"></div>
                  <div className="h-2 w-5/6 bg-slate-200 rounded"></div>
                </div>
                <div className="flex gap-4 mt-2">
                  <div className="flex-1 space-y-3">
                    <div className="h-3 w-1/3 bg-slate-300 rounded mb-4"></div>
                    <div className="h-2 w-full bg-slate-200 rounded"></div>
                    <div className="h-2 w-full bg-slate-200 rounded"></div>
                    <div className="h-2 w-4/5 bg-slate-200 rounded"></div>
                  </div>
                  <div className="w-1/3 space-y-3">
                    <div className="h-3 w-1/2 bg-slate-300 rounded mb-4"></div>
                    <div className="h-2 w-full bg-slate-200 rounded"></div>
                    <div className="h-2 w-full bg-slate-200 rounded"></div>
                  </div>
                </div>
                {/* Highlight boxes for detected zones */}
                <div className="absolute top-[120px] left-[30px] w-[200px] h-[80px] border border-blue-300 bg-blue-50 rounded">
                  <div className="absolute -top-3 -right-3 bg-[#3B82F6] text-[#0F172A] text-[9px] font-mono px-1 rounded-sm">
                    EDUCATION
                  </div>
                </div>
              </div>

              {/* Scanning Beam */}
              <motion.div
                className="absolute left-[-10%] right-[-10%] h-[2px] bg-cyan-500 z-20 shadow-[0_0_15px_2px_rgba(6,182,212,0.6)]"
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="absolute left-0 right-0 top-0 bottom-0 bg-gradient-to-b from-transparent via-blue-100/20 to-transparent opacity-30 pointer-events-none"></div>
            </div>

            {/* Floating tech decorations */}
            <div className="absolute -left-12 top-1/4 hidden md:flex flex-col gap-2 opacity-60">
              <div className="h-[1px] w-8 bg-slate-400"></div>
              <span className="text-[10px] text-[#3B82F6] font-mono rotate-90 origin-left translate-x-3">Y-AXIS</span>
            </div>
            <div className="absolute -right-12 bottom-1/3 hidden md:flex flex-col gap-2 opacity-60 items-end">
              <div className="h-[1px] w-8 bg-slate-400"></div>
              <span className="text-[10px] text-[#8B5CF6] font-mono -rotate-90 origin-right -translate-x-3">Z-INDEX</span>
            </div>
          </div>

          {/* Progress & Logs Section */}
          <div className="w-full max-w-2xl flex flex-col gap-4">
            {/* Progress Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end px-1">
                <span className="text-[#3B82F6] font-mono text-xs tracking-wider">PROCESS_ID: #8X92-CV</span>
                <span className="text-[#0F172A] font-display text-2xl font-bold">{Math.round(currentProgress)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden border border-[#E2E8F0]">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary shadow-lg relative"
                  initial={{ width: "0%" }}
                  animate={{ width: `${currentProgress}%` }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute inset-0 bg-[#FFFFFF]/20 w-full -skew-x-12">
                    <motion.div
                      className="h-full w-full bg-[#FFFFFF]/20"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                </motion.div>
              </div>
              <div className="flex justify-between text-[#475569] text-xs font-mono mt-1">
                <span>ETA: {eta}s</span>
                <span>Memory: {Math.round(24 + currentProgress / 10)}MB</span>
              </div>
            </div>

            {/* Terminal Output */}
            <div className="bg-[#FFFFFF]/90 backdrop-blur-xl rounded-lg p-4 font-mono text-sm h-40 overflow-hidden flex flex-col relative group hover:border-blue-300 transition-colors border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
              <div className="absolute top-2 right-2 flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
              </div>
              <div className="text-xs text-[#475569] border-b border-[#E2E8F0] pb-2 mb-2 uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]">terminal</span>
                Live System Logs
              </div>
              <div className="flex flex-col gap-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 opacity-90">
                {logs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={index === logs.length - 1 ? "text-[#0F172A]" : "text-[#475569]"}
                  >
                    <span className="text-[#64748B] mr-2">{log.time}</span>
                    <span className={log.color}>[{log.type}]</span> {log.message}
                    {index === logs.length - 1 && (
                      <motion.span
                        className="inline-block w-2 h-4 bg-[#3B82F6] align-middle ml-1"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
              {/* Gradient fade at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Status */}
      <footer className="relative z-10 border-t border-[#E2E8F0] bg-[#FFFFFF]/80 backdrop-blur text-[#475569] text-xs py-3 px-6 flex justify-between items-center font-mono shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
            System Healthy
          </span>
          <span className="hidden md:inline text-[#475569]">|</span>
          <span className="hidden md:inline">Server: us-east-1a</span>
        </div>
        <div className="flex gap-4">
          <a className="hover:text-[#3B82F6] transition-colors" href="/blog">Documentation</a>
          <a className="hover:text-[#3B82F6] transition-colors" href="/contact">Support</a>
        </div>
      </footer>
    </div>
  );
}
