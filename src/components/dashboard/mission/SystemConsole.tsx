import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface Log {
  time: string;
  type: string;
  message: string;
}

interface SystemConsoleProps {
  logs: Log[];
}

export function SystemConsole({ logs }: SystemConsoleProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type: string) => {
    switch (type) {
      case "INFO": return "text-blue-400";
      case "WARN": return "text-yellow-500";
      case "AI": return "text-[#8B5CF6]";
      case "SUCCESS": return "text-emerald-400";
      case "ERROR": return "text-red-400";
      default: return "text-slate-400";
    }
  };

  return (
    <motion.div 
      className="flex-1 min-h-[250px] rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col shadow-inner shadow-black/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="bg-[#0b1120] px-4 py-2 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xs text-slate-500">terminal</span>
          <span className="text-xs font-mono font-bold text-slate-400">SYSTEM CONSOLE</span>
        </div>
        <div className="flex gap-1.5">
          <div className="size-2.5 rounded-full bg-slate-700"></div>
          <div className="size-2.5 rounded-full bg-slate-700"></div>
          <div className="size-2.5 rounded-full bg-slate-700"></div>
        </div>
      </div>
      <div ref={scrollRef} className="p-4 font-mono text-xs overflow-y-auto custom-scrollbar flex-1 bg-slate-950/80">
        <div className="flex flex-col gap-1.5">
          {logs.map((log, idx) => (
            <div key={idx} className="flex gap-2 text-slate-500">
              <span className="opacity-50">{log.time}</span>
              <span className={getLogColor(log.type)}>[{log.type}]</span>
              <span className={log.type === "WARN" ? "text-slate-300" : log.type === "SUCCESS" ? "text-emerald-200" : log.type === "AI" ? "text-white" : "text-slate-400"}>{log.message}</span>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <span className="text-primary animate-pulse">➜</span>
            <span className="text-slate-400">_</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
