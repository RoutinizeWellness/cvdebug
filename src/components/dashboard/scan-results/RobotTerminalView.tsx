import { Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LogEntry {
  line: number;
  type: "info" | "ok" | "warn" | "critical" | "fail" | "command";
  message: string;
}

interface RobotTerminalViewProps {
  logs?: LogEntry[];
  autoAnimate?: boolean;
}

export function RobotTerminalView({
  logs,
  autoAnimate = true,
}: RobotTerminalViewProps) {
  const [displayedLogs, setDisplayedLogs] = useState<LogEntry[]>([]);

  const defaultLogs: LogEntry[] = [
    {
      line: 1,
      type: "command",
      message: "./scan --target=resume.pdf --deep-analyze",
    },
    { line: 2, type: "info", message: "[INIT] Initializing parser engine v4.2.0..." },
    { line: 3, type: "ok", message: "[OK] PDF structure valid. Text layer extracted." },
    { line: 4, type: "info", message: "[INFO] Detected Role: Senior Frontend Engineer" },
    { line: 5, type: "info", message: "[INFO] Checking ATS readability..." },
    {
      line: 6,
      type: "warn",
      message: '[WARN] Font "Comic Sans" detected in footer. Not recommended.',
    },
    { line: 7, type: "info", message: "[INFO] Analyzing keyword density..." },
    {
      line: 8,
      type: "critical",
      message: "[CRITICAL] Missing core technical stack requirements.",
    },
    {
      line: 9,
      type: "info",
      message: '       > Expected: "React", "TypeScript", "Node.js"',
    },
    { line: 10, type: "info", message: '       > Found: "jQuery", "Java"' },
    {
      line: 11,
      type: "warn",
      message: "[WARN] Experience section lacks quantitative metrics.",
    },
    { line: 12, type: "info", message: "[INFO] Scanning for soft skills..." },
    { line: 13, type: "ok", message: '[OK] "Leadership" detected 3 times.' },
    {
      line: 14,
      type: "fail",
      message: '[FAIL] 12 Critical signals missing for "Senior" tier.',
    },
    { line: 15, type: "info", message: "..." },
  ];

  const logData = logs || defaultLogs;

  useEffect(() => {
    if (!autoAnimate) {
      setDisplayedLogs(logData);
      return;
    }

    // Animate logs appearing one by one
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < logData.length) {
        setDisplayedLogs((prev) => [...prev, logData[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [autoAnimate, logData]);

  const getLogColor = (type: string) => {
    switch (type) {
      case "ok":
        return "text-[#22C55E]";
      case "warn":
        return "text-[#F59E0B]";
      case "critical":
      case "fail":
        return "text-[#EF4444]";
      case "command":
        return "text-primary";
      default:
        return "text-[#64748B]";
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#0a0e1a] via-[#0c1220] to-[#0a0e1a] border-2 border-[#3B82F6]/30 rounded-2xl overflow-hidden shadow-[0_20px_80px_-20px_rgba(59,130,246,0.5)] flex flex-col h-full min-h-[500px] sm:min-h-[400px] relative">
      {/* Animated glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/10 via-transparent to-[#8B5CF6]/10 opacity-50 pointer-events-none animate-pulse"></div>

      {/* Terminal Header */}
      <div className="relative z-10 bg-gradient-to-r from-[#1e293b] to-[#1e3a52] px-4 py-3 flex items-center justify-between border-b-2 border-[#3B82F6]/40 backdrop-blur-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex gap-1.5">
            <motion.div
              className="w-3 h-3 rounded-full bg-[#EF4444]"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            ></motion.div>
            <motion.div
              className="w-3 h-3 rounded-full bg-[#F59E0B]"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            ></motion.div>
            <motion.div
              className="w-3 h-3 rounded-full bg-[#22C55E]"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            ></motion.div>
          </div>
          <div className="ml-2 sm:ml-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg text-xs font-mono text-[#3B82F6] border border-[#3B82F6]/40 backdrop-blur-sm shadow-lg">
            <Terminal className="h-3.5 w-3.5 animate-pulse" />
            <span className="hidden sm:inline">ats_robot_scan.log</span>
            <span className="sm:hidden">robot.log</span>
          </div>
          <motion.div
            className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-[#22C55E]/10 rounded border border-[#22C55E]/30 text-[10px] text-[#22C55E] font-bold"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
            LIVE SCAN
          </motion.div>
        </div>
        <span className="hidden sm:inline text-[10px] text-[#64748B] font-mono bg-black/30 px-2 py-1 rounded">zsh • 80x24</span>
      </div>

      {/* Terminal Body */}
      <div className="relative z-10 p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-y-auto custom-scrollbar flex-1">
        {/* Enhanced matrix-like background effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#3B82F6]/5 via-transparent to-[#8B5CF6]/5"></div>
        </div>

        {/* Scan line effect */}
        {autoAnimate && displayedLogs.length < logData.length && (
          <motion.div
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent shadow-[0_0_10px_2px_rgba(59,130,246,0.5)]"
            animate={{
              top: ["0%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}

        <div className="text-[#94a3b8] space-y-1 relative z-10">
          {displayedLogs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-2 sm:gap-3 group hover:bg-white/5 px-2 py-1 rounded transition-colors"
            >
              <span className="text-[#475569] select-none text-xs shrink-0 font-bold">
                {String(log.line).padStart(2, "0")}
              </span>
              {log.type === "command" ? (
                <div className="flex-1 break-words">
                  <span className="text-[#3B82F6] font-bold">root@ats-robot</span>
                  <span className="text-[#64748B]">:</span>
                  <span className="text-[#8B5CF6] font-bold">~</span>
                  <span className="text-[#22C55E]">$</span>
                  <span className="text-white ml-2">{log.message}</span>
                </div>
              ) : (
                <span className={`${getLogColor(log.type)} flex-1 break-words font-medium`}>
                  {log.message}
                </span>
              )}
            </motion.div>
          ))}
          {autoAnimate && displayedLogs.length === logData.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 sm:gap-3 px-2 py-1"
            >
              <span className="text-[#475569] select-none text-xs font-bold">
                {String(logData.length + 1).padStart(2, "0")}
              </span>
              <span className="text-[#3B82F6] font-bold">root@ats-robot</span>
              <span className="text-[#64748B]">:</span>
              <span className="text-[#8B5CF6] font-bold">~</span>
              <span className="text-[#22C55E]">$</span>
              <motion.span
                className="inline-block w-2.5 h-4 bg-[#3B82F6] align-middle ml-2 shadow-[0_0_10px_2px_rgba(59,130,246,0.8)]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
              ></motion.span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="relative z-10 bg-gradient-to-r from-[#1e293b] to-[#1e3a52] px-4 py-2 border-t-2 border-[#3B82F6]/40 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <motion.div
            className="flex items-center gap-1.5 text-[#22C55E]"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_2px_rgba(34,197,94,0.6)]"></span>
            <span className="font-mono font-bold hidden sm:inline">ANALYZING</span>
          </motion.div>
          <span className="text-[#64748B] font-mono hidden md:inline">|</span>
          <span className="text-[#64748B] font-mono hidden md:inline">Lines: {displayedLogs.length}/{logData.length}</span>
        </div>
        <span className="text-[#64748B] font-mono hidden sm:inline">ATS Robot Vision v4.2.0</span>
      </div>
    </div>
  );
}
