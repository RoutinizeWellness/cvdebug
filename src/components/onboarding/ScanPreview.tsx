import { motion } from "framer-motion";

interface ScanPreviewProps {
  isActive: boolean;
  progress: number;
}

export default function ScanPreview({ isActive, progress }: ScanPreviewProps) {
  const isDisabled = !isActive || progress === 0;

  return (
    <motion.div
      className={`glass-panel rounded-xl p-6 transition-all ${
        isDisabled ? "opacity-80 pointer-events-none grayscale-[0.5]" : "opacity-100"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDisabled ? 0.8 : 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-lg font-semibold text-[#0F172A]">Global Scan</h3>
            <p className="text-sm text-[#64748B]">
              {isDisabled ? "Analysis pending upload..." : "Scanning your CV..."}
            </p>
          </div>
          <span
            className={`text-2xl font-bold font-mono ${
              isDisabled ? "text-slate-500" : "text-[#0F172A]"
            }`}
          >
            {progress}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden border border-slate-300">
          <motion.div
            className={`h-2.5 rounded-full ${
              isDisabled
                ? "bg-gradient-to-r from-slate-300 to-slate-400"
                : "bg-gradient-to-r from-[#22C55E] to-[#10B981]"
            }`}
            initial={{ width: "5%" }}
            animate={{ width: isDisabled ? "5%" : `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={
              !isDisabled
                ? {
                    boxShadow: "0 0 10px rgba(34, 197, 94, 0.5)",
                  }
                : {}
            }
          />
        </div>

        {/* Placeholder Bars */}
        <div className="flex gap-4 mt-2">
          {[16, 24, 12].map((width, index) => (
            <motion.div
              key={index}
              className="h-2 bg-slate-300 rounded"
              style={{ width: `${width * 4}px` }}
              animate={
                isDisabled
                  ? { opacity: [0.5, 1, 0.5] }
                  : { opacity: 1, backgroundColor: "rgb(34, 197, 94)" }
              }
              transition={
                isDisabled
                  ? {
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.15,
                    }
                  : {}
              }
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
