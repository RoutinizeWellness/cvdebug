import { Bug, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Error {
  type: "CRIT" | "WARN" | "INFO";
  message: string;
  details: string;
}

export function TopErrors() {
  const errors: Error[] = [
    {
      type: "CRIT",
      message: "Date format inconsistency found",
      details: "at Experience.block (Line 42)",
    },
    {
      type: "WARN",
      message: "Missing keyword 'TypeScript'",
      details: "match_score impact: -5%",
    },
    {
      type: "WARN",
      message: "Broken hyperlink detected",
      details: "at Projects.Link (Line 89)",
    },
  ];

  const getErrorColor = (type: string) => {
    switch (type) {
      case "CRIT":
        return "text-rose-500";
      case "WARN":
        return "text-amber-500";
      default:
        return "text-blue-500";
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-slate-900 text-lg font-bold flex items-center gap-2">
          <Bug className="h-5 w-5 text-rose-500" />
          Top Errors
        </h3>
        <span className="text-xs text-slate-500 font-mono">Master_CV_v4.pdf</span>
      </div>

      <div className="glass-panel rounded-xl flex flex-col h-full bg-[#0d1117] border-slate-200 overflow-hidden shadow-sm shadow-black/50">
        {/* Terminal Header */}
        <div className="bg-[#161b22] px-4 py-2 flex items-center gap-2 border-b border-slate-200">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          </div>
          <span className="ml-2 text-[10px] text-slate-500 font-mono">console — bash</span>
        </div>

        {/* Terminal Body */}
        <div className="p-4 font-mono text-xs flex flex-col gap-3 overflow-y-auto flex-1">
          {errors.map((error, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex gap-3 group cursor-pointer"
            >
              <span className={`${getErrorColor(error.type)} font-bold shrink-0`}>
                [{error.type}]
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-slate-600 group-hover:text-slate-900 transition-colors">
                  {error.message}
                </span>
                <span className="text-slate-600">{error.details}</span>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-2 items-center mt-2 animate-pulse"
          >
            <span className="text-emerald-500">➜</span>
            <span className="w-2 h-4 bg-slate-500 block"></span>
          </motion.div>
        </div>

        {/* Action Button */}
        <div className="p-3 border-t border-slate-200 bg-[#161b22]">
          <Button className="w-full flex items-center justify-center gap-2 rounded-md h-8 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-bold border border-rose-500/20 hover:border-rose-500/40 transition-all">
            <Wrench className="h-4 w-4" />
            DEBUG MASTER CV
          </Button>
        </div>
      </div>
    </section>
  );
}
