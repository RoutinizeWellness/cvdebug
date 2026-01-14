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
      case "INFO": return "text-[#3B82F6]";
      case "WARN": return "text-[#F59E0B]";
      case "AI": return "text-[#8B5CF6]";
      case "SUCCESS": return "text-[#22C55E]";
      case "ERROR": return "text-[#EF4444]";
      default: return "text-[#64748B]";
    }
  };

  return (
    <motion.div
      className="flex-1 min-h-[250px] rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] overflow-hidden flex flex-col shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="bg-[#F8FAFC] px-4 py-2 border-b border-[#E2E8F0] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xs text-[#64748B]">terminal</span>
          <span className="text-xs font-mono font-bold text-[#64748B]">SYSTEM CONSOLE</span>
        </div>
        <div className="flex gap-1.5">
          <div className="size-2.5 rounded-full bg-[#E2E8F0]"></div>
          <div className="size-2.5 rounded-full bg-[#E2E8F0]"></div>
          <div className="size-2.5 rounded-full bg-[#E2E8F0]"></div>
        </div>
      </div>
      <div ref={scrollRef} className="p-4 font-mono text-xs overflow-y-auto custom-scrollbar flex-1 bg-[#FFFFFF]">
        <div className="flex flex-col gap-1.5">
          {logs.map((log, idx) => (
            <div key={idx} className="flex gap-2 text-[#64748B]">
              <span className="opacity-50">{log.time}</span>
              <span className={getLogColor(log.type)}>[{log.type}]</span>
              <span className={log.type === "WARN" ? "text-[#475569]" : log.type === "SUCCESS" ? "text-[#22C55E]" : log.type === "AI" ? "text-[#8B5CF6]" : "text-[#64748B]"}>{log.message}</span>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <span className="text-primary animate-pulse">➜</span>
            <span className="text-[#64748B]">_</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
