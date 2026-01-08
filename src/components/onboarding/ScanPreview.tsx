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
            <h3 className="text-lg font-semibold text-white">Global Scan</h3>
            <p className="text-sm text-slate-400">
              {isDisabled ? "Analysis pending upload..." : "Scanning your CV..."}
            </p>
          </div>
          <span
            className={`text-2xl font-bold font-mono ${
              isDisabled ? "text-slate-600" : "text-white"
            }`}
          >
            {progress}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <motion.div
            className={`h-2.5 rounded-full ${
              isDisabled
                ? "bg-gradient-to-r from-slate-700 to-slate-600"
                : "bg-gradient-to-r from-secondary to-primary"
            }`}
            initial={{ width: "5%" }}
            animate={{ width: isDisabled ? "5%" : `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={
              !isDisabled
                ? {
                    boxShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
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
              className="h-2 bg-slate-800 rounded"
              style={{ width: `${width * 4}px` }}
              animate={
                isDisabled
                  ? { opacity: [0.5, 1, 0.5] }
                  : { opacity: 1, backgroundColor: "rgb(100, 116, 139)" }
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
