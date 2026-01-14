import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ScanLog {
  status: "INFO" | "WARN" | "SCAN" | "DEBUG" | "PROC";
  message: string;
  timestamp: string;
}

interface ChecklistItem {
  title: string;
  status: "completed" | "active" | "pending";
  subtitle: string;
}

interface CinematicScanningProps {
  isScanning: boolean;
  progress: number;
  fileName?: string;
}

export function CinematicScanning({ isScanning, progress, fileName }: CinematicScanningProps) {
  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { title: "File Validation", status: "completed", subtitle: "PDF structure is valid." },
    { title: "Layout Integrity", status: "pending", subtitle: "Checking margins & text-flow." },
    { title: "Keyword Match", status: "pending", subtitle: "PENDING" },
    { title: "Experience Timeline", status: "pending", subtitle: "PENDING" },
    { title: "Scoring & Report", status: "pending", subtitle: "PENDING" },
  ]);

  const scanningPhases = [
    { status: "INFO" as const, message: "Initializing scan protocols v4.2.0...", delay: 300, checklistIndex: 0 },
    { status: "INFO" as const, message: "Decoding PDF streams (Layer 1/3)...", delay: 800, checklistIndex: 1 },
    { status: "WARN" as const, message: "2 hidden text layers detected. Potential parsing conflict.", delay: 1400, checklistIndex: 1 },
    { status: "SCAN" as const, message: "Cross-referencing 42 industry keywords...", delay: 2000, checklistIndex: 2 },
    { status: "DEBUG" as const, message: "Verifying contact info formatting...", delay: 2600, checklistIndex: 2 },
    { status: "PROC" as const, message: "Parsing work history dates...", delay: 3200, checklistIndex: 3 },
    { status: "INFO" as const, message: "Analyzing experience timeline gaps...", delay: 3800, checklistIndex: 3 },
    { status: "SCAN" as const, message: "Calculating ATS compatibility score...", delay: 4400, checklistIndex: 4 },
    { status: "INFO" as const, message: "Generating comprehensive report...", delay: 5000, checklistIndex: 4 },
  ];

  useEffect(() => {
    if (!isScanning) {
      setLogs([]);
      setCurrentPhase(0);
      setChecklist([
        { title: "File Validation", status: "completed", subtitle: "PDF structure is valid." },
        { title: "Layout Integrity", status: "pending", subtitle: "Checking margins & text-flow." },
        { title: "Keyword Match", status: "pending", subtitle: "PENDING" },
        { title: "Experience Timeline", status: "pending", subtitle: "PENDING" },
        { title: "Scoring & Report", status: "pending", subtitle: "PENDING" },
      ]);
      return;
    }

    if (currentPhase < scanningPhases.length) {
      const phase = scanningPhases[currentPhase];
      const timer = setTimeout(() => {
        const now = new Date();
        const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        setLogs(prev => [...prev, {
          status: phase.status,
          message: phase.message,
          timestamp
        }]);

        // Update checklist
        setChecklist(prev => prev.map((item, idx) => {
          if (idx < phase.checklistIndex) {
            return { ...item, status: "completed" };
          } else if (idx === phase.checklistIndex) {
            return { ...item, status: "active" };
          }
          return item;
        }));

        setCurrentPhase(prev => prev + 1);
      }, phase.delay);

      return () => clearTimeout(timer);
    }
  }, [isScanning, currentPhase]);

  if (!isScanning) return null;

  const statusColors = {
    INFO: "text-[#3B82F6]",
    WARN: "text-[#F59E0B]",
    SCAN: "text-[#8B5CF6]",
    DEBUG: "text-[#22C55E]",
    PROC: "text-[#3B82F6]"
  };

  const completedCount = checklist.filter(item => item.status === "completed").length;

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] overflow-y-auto">
      {/* Main Content */}
      <main className="flex flex-col justify-center py-10 px-4 md:px-8 max-w-7xl mx-auto w-full gap-8 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-[#0F172A] tracking-tight">
              Analyzing Resume Integrity
              <span className="animate-pulse text-[#3B82F6]">...</span>
            </h1>
            <p className="text-[#64748B] text-lg font-light flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#8B5CF6]">settings_suggest</span>
              Simulating ATS parsing engines
            </p>
          </div>
          <div className="bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-full px-4 py-2 flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#3B82F6]"></span>
            </div>
            <span className="text-[#3B82F6] font-mono text-xs font-bold uppercase tracking-wider">Engine Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Visualizer & Terminal */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Central Visualizer Card */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-xl p-8 relative overflow-hidden min-h-[320px] flex items-center justify-center">
              {/* Background Grid */}
              <div
                className="absolute inset-0 z-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              ></div>

              {/* Resume Ghost Outline */}
              <div className="relative z-10 w-[240px] h-[340px] border-2 border-[#E2E8F0] bg-[#FFFFFF] rounded-lg p-6 flex flex-col gap-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] backdrop-blur-sm">
                {/* Header skeleton */}
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#E2E8F0]"></div>
                  <div className="flex-1 flex flex-col gap-2 justify-center">
                    <div className="h-3 w-3/4 bg-[#64748B]/30 rounded"></div>
                    <div className="h-2 w-1/2 bg-[#E2E8F0] rounded"></div>
                  </div>
                </div>
                {/* Body skeleton */}
                <div className="h-2 w-full bg-[#E2E8F0] rounded"></div>
                <div className="h-2 w-5/6 bg-[#E2E8F0] rounded"></div>
                <div className="h-2 w-full bg-[#E2E8F0] rounded"></div>
                <div className="mt-4 h-2 w-1/3 bg-[#3B82F6]/20 rounded"></div>
                <div className="h-2 w-full bg-[#E2E8F0] rounded"></div>
                <div className="h-2 w-full bg-[#E2E8F0] rounded"></div>

                {/* Scanning Laser Line */}
                <motion.div
                  className="absolute left-[-10%] right-[-10%] h-[2px] bg-[#8B5CF6]/80"
                  style={{
                    boxShadow: '0 0 15px #8B5CF6, 0 0 30px #3B82F6'
                  }}
                  animate={{
                    top: ['0%', '100%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                ></motion.div>
              </div>

              {/* Floating Status Indicators */}
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-[#FFFFFF]/90 px-3 py-1 rounded-md border border-[#E2E8F0] text-xs font-mono text-[#475569] shadow-sm">
                <span className="material-symbols-outlined text-sm text-[#8B5CF6]">visibility</span>
                <span>OCR Layer: Detected</span>
              </div>
              <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-[#FFFFFF]/90 px-3 py-1 rounded-md border border-[#E2E8F0] text-xs font-mono text-[#475569] shadow-sm">
                <span className="material-symbols-outlined text-sm text-[#3B82F6]">memory</span>
                <span>Memory: 45MB</span>
              </div>
            </div>

            {/* Main Progress Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end px-1">
                <span className="text-[#0F172A] text-sm font-medium tracking-wide">System Scan In Progress</span>
                <span className="text-[#3B82F6] text-lg font-mono font-bold">{progress}%</span>
              </div>
              <div className="h-3 bg-[#F8FAFC] rounded-full overflow-hidden relative border border-[#E2E8F0]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-[#3B82F6] via-[#3B82F6]/80 to-[#8B5CF6] rounded-full"
                  style={{
                    boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                  }}
                >
                  <div className="absolute inset-0 bg-[#FFFFFF]/20 w-full h-full animate-pulse skew-x-12"></div>
                </motion.div>
              </div>
              <div className="flex justify-between text-xs text-[#64748B] font-mono mt-1">
                <span>Threads: 4 active</span>
                <span>Est. time remaining: {Math.max(5, Math.round((100 - progress) / 8))}s</span>
              </div>
            </div>

            {/* Terminal Widget */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-xl overflow-hidden flex flex-col h-64">
              <div className="bg-[#F8FAFC] px-4 py-2 border-b border-[#E2E8F0] flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#22C55E]"></div>
                </div>
                <div className="text-xs text-[#64748B] font-mono">user@cvdebug-core:~</div>
              </div>
              <div className="flex-1 bg-[#0F172A] p-4 font-mono text-sm overflow-y-auto terminal-scroll">
                <div className="flex flex-col gap-2">
                  <AnimatePresence>
                    {logs.map((log, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex gap-3 text-[#64748B] ${log.status === 'WARN' ? 'bg-[#F59E0B]/10 p-1 rounded -mx-1' : ''}`}
                      >
                        <span className="text-[#64748B]">[{log.timestamp}]</span>
                        <span className={`${statusColors[log.status]} font-bold`}>{log.status}</span>
                        <span className={log.status === 'WARN' ? 'text-[#64748B]' : 'text-[#64748B]'}>{log.message}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {logs.length > 0 && (
                    <motion.div
                      className="flex gap-3 text-[#64748B] animate-pulse"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <span className="text-[#64748B]">[{new Date().toTimeString().split(' ')[0]}]</span>
                      <span className="text-[#3B82F6] font-bold">PROC</span>
                      <span>Processing...</span>
                      <span className="w-2 h-4 bg-[#64748B] block animate-pulse"></span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Checklist Sidebar */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-xl p-6 flex flex-col gap-6">
              <h3 className="text-[#0F172A] font-display text-lg font-bold border-b border-[#E2E8F0] pb-4 flex justify-between items-center">
                Analysis Queue
                <span className="bg-[#3B82F6]/20 text-[#3B82F6] text-xs px-2 py-1 rounded font-mono">
                  {completedCount}/{checklist.length}
                </span>
              </h3>
              <div className="flex flex-col gap-6 relative">
                {/* Connecting Line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-[#E2E8F0] -z-10"></div>

                {checklist.map((item, idx) => (
                  <div key={idx} className={`flex gap-4 items-start ${item.status === 'pending' ? 'opacity-60' : ''}`}>
                    <div className={`relative z-10 flex-shrink-0 size-10 rounded-full flex items-center justify-center ${
                      item.status === 'completed'
                        ? 'bg-[#FFFFFF] border border-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                        : item.status === 'active'
                        ? 'bg-[#FFFFFF] border border-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                        : 'bg-[#F8FAFC] border border-[#E2E8F0]'
                    }`}>
                      {item.status === 'completed' && (
                        <span className="material-symbols-outlined text-[#22C55E] text-xl">check</span>
                      )}
                      {item.status === 'active' && (
                        <span className="material-symbols-outlined text-[#3B82F6] text-xl animate-spin">sync</span>
                      )}
                      {item.status === 'pending' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#E2E8F0]"></div>
                      )}
                    </div>
                    <div className="flex flex-col pt-1">
                      <h4 className={`font-medium text-base ${item.status === 'pending' ? 'text-[#64748B]' : 'text-[#0F172A]'}`}>
                        {item.title}
                      </h4>
                      {item.status === 'completed' && (
                        <p className="text-[#22C55E] text-xs font-mono mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[10px]">verified</span>
                          COMPLETED
                        </p>
                      )}
                      {item.status === 'active' && (
                        <p className="text-[#3B82F6] text-xs font-mono mt-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse"></span>
                          ANALYZING
                        </p>
                      )}
                      {item.status === 'pending' && (
                        <p className="text-[#64748B] text-xs font-mono mt-1">PENDING</p>
                      )}
                      <p className="text-[#64748B] text-xs mt-1">{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
