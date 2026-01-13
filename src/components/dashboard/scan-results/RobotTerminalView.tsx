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
        return "text-green-500";
      case "warn":
        return "text-yellow-500";
      case "critical":
      case "fail":
        return "text-red-500";
      case "command":
        return "text-primary";
      default:
        return "text-slate-500";
    }
  };

  return (
    <div className="bg-[#0c1220] border border-slate-200 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full min-h-[500px]">
      {/* Terminal Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="ml-4 flex items-center gap-2 px-3 py-1 bg-black/30 rounded text-xs font-mono text-slate-500 border border-slate-200/50">
            <Terminal className="h-3.5 w-3.5" />
            system_scan_logs.log
          </div>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">zsh • 80x24</span>
      </div>

      {/* Terminal Body */}
      <div className="p-6 font-mono text-sm leading-relaxed overflow-y-auto custom-scrollbar flex-1 relative">
        {/* Matrix-like background effect */}
        <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>

        <div className="text-slate-600 space-y-1 relative z-10">
          {displayedLogs.map((log, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-slate-500 select-none mr-3">
                {String(log.line).padStart(2, "0")}
              </span>
              {log.type === "command" ? (
                <>
                  <span className="text-primary">root@cvdebug</span>:
                  <span className="text-accent">~</span>$ {log.message}
                </>
              ) : (
                <span className={getLogColor(log.type)}>{log.message}</span>
              )}
            </motion.p>
          ))}
          {autoAnimate && displayedLogs.length === logData.length && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-slate-500 select-none mr-3">
                {String(logData.length + 1).padStart(2, "0")}
              </span>
              <span className="text-primary">root@cvdebug</span>:
              <span className="text-accent">~</span>${" "}
              <span className="inline-block w-2.5 h-4 bg-accent align-middle animate-pulse"></span>
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
