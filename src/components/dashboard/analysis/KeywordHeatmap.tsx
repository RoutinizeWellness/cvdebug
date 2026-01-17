import { Badge } from "@/components/ui/badge";
import { Lock, Check, AlertTriangle, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Keyword {
  name: string;
  present: boolean;
  impact?: string;
}

interface KeywordHeatmapProps {
  matchedKeywords: string[];
  missingKeywords: string[];
  onUnlock?: () => void;
  isPremium?: boolean;
}

export function KeywordHeatmap({ matchedKeywords, missingKeywords, onUnlock, isPremium = false }: KeywordHeatmapProps) {
  const totalKeywords = matchedKeywords.length + missingKeywords.length;
  const matchRate = totalKeywords > 0 ? Math.round((matchedKeywords.length / totalKeywords) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative glass-panel p-4 md:p-6 rounded-lg md:rounded-xl border-2 border-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 bg-gradient-to-br from-[#FFFFFF] via-[#F8FAFC] to-[#F1F5F9] h-full flex flex-col shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      {/* Efecto de brillo animado en el fondo */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse pointer-events-none"></div>

      {/* Icono decorativo flotante */}
      <motion.div
        className="absolute top-2 right-2 md:top-4 md:right-4 opacity-10"
        animate={{
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Zap className="h-16 w-16 md:h-24 md:w-24 text-purple-500" />
      </motion.div>

      {/* Badge "HEATMAP" destacado */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-0 left-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-3 md:px-4 py-1 rounded-br-lg rounded-tl-lg font-bold text-[10px] md:text-xs tracking-wider shadow-lg flex items-center gap-1"
      >
        <TrendingUp className="h-3 w-3" />
        <span className="hidden sm:inline">KEYWORD HEATMAP</span>
        <span className="sm:hidden">HEATMAP</span>
      </motion.div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6 mt-8 md:mt-6 relative z-10">
        <div className="flex-1 min-w-0">
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2"
          >
            <Zap className="h-4 w-4 md:h-5 md:w-5 text-purple-600 animate-pulse" />
            Keyword DNA
          </motion.h3>
          <p className="text-xs md:text-sm text-[#64748B] mt-1">
            ATS Match Rate:
            <motion.span
              key={matchRate}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className={`ml-1 font-bold ${matchRate > 70 ? "text-green-500" : matchRate > 40 ? "text-orange-500" : "text-red-500"}`}
            >
              {matchRate}%
            </motion.span>
          </p>
        </div>
        {matchRate < 50 && totalKeywords > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Badge variant="outline" className="border-orange-500/50 text-orange-600 bg-orange-500/10 text-xs self-start sm:self-auto animate-pulse">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Low Match
            </Badge>
          </motion.div>
        )}
      </div>

      <div className="space-y-4 md:space-y-6 flex-1 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <h4 className="text-[10px] md:text-xs font-semibold text-[#64748B] uppercase tracking-wider">Matched Skills</h4>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 md:gap-2 min-h-[60px]">
            {matchedKeywords.length > 0 ? (
              matchedKeywords.map((kw, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Badge className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-600 border border-green-500/30 hover:bg-green-500/20 hover:scale-105 transition-all duration-200 h-fit text-[10px] md:text-xs px-2 md:px-2.5 py-0.5 md:py-1 shadow-sm">
                    <Check className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1 animate-pulse" />
                    {kw}
                  </Badge>
                </motion.div>
              ))
            ) : (
              <div className="flex items-center justify-center w-full py-3 md:py-4">
                <p className="text-xs md:text-sm text-[#64748B] italic text-center">No keywords matched yet. Upload a resume to see matches.</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2 md:mb-3">
            <div className="flex items-center gap-2">
              <h4 className="text-[10px] md:text-xs font-semibold text-[#64748B] uppercase tracking-wider">Missing Critical Skills</h4>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="w-2 h-2 rounded-full bg-red-500"
              />
            </div>
            {!isPremium && (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-[10px] md:text-xs text-teal-500 flex items-center gap-1 font-semibold"
              >
                <Lock className="h-2.5 w-2.5 md:h-3 md:w-3 animate-pulse" />
                Premium Insight
              </motion.span>
            )}
          </div>

          <div className="relative">
            <div className={`flex flex-wrap gap-1.5 md:gap-2 ${!isPremium ? "blur-sm select-none" : ""}`}>
              {missingKeywords.slice(0, isPremium ? undefined : 5).map((kw, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Badge variant="outline" className="border-red-500/40 text-red-600 bg-gradient-to-r from-red-500/5 to-orange-500/5 hover:bg-red-500/10 hover:scale-105 transition-all duration-200 text-[10px] md:text-xs px-2 md:px-2.5 py-0.5 md:py-1 shadow-sm">
                    {typeof kw === 'string' ? kw : (kw as any).keyword || 'Keyword'}
                  </Badge>
                </motion.div>
              ))}
              {!isPremium && (
                <>
                  <Badge variant="outline" className="border-red-500/40 text-red-600 bg-gradient-to-r from-red-500/5 to-orange-500/5 text-[10px] md:text-xs px-2 md:px-2.5 py-0.5 md:py-1">Java......</Badge>
                  <Badge variant="outline" className="border-red-500/40 text-red-600 bg-gradient-to-r from-red-500/5 to-orange-500/5 text-[10px] md:text-xs px-2 md:px-2.5 py-0.5 md:py-1">System Des...</Badge>
                  <Badge variant="outline" className="border-red-500/40 text-red-600 bg-gradient-to-r from-red-500/5 to-orange-500/5 text-[10px] md:text-xs px-2 md:px-2.5 py-0.5 md:py-1">Microser...</Badge>
                </>
              )}
            </div>

            {!isPremium && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={onUnlock}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0 text-xs md:text-sm h-9 md:h-10 px-3 md:px-4 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Lock className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2 animate-pulse" />
                    <span className="hidden sm:inline">Unlock Missing Keywords</span>
                    <span className="sm:hidden">Unlock</span>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}