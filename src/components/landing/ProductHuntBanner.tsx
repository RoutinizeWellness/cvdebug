import { motion } from "framer-motion";
import { Rocket, X } from "lucide-react";
import { useState } from "react";

/**
 * Product Hunt Launch Banner
 * Highlights launch and PH50 coupon code
 */
export function ProductHuntBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#F59E0B] via-[#F59E0B] to-[#F59E0B] text-white shadow-lg"
    >
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-center min-w-0">
            <Rocket className="h-4 w-4 sm:h-5 sm:w-5 animate-bounce flex-shrink-0" />
            <div className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 text-xs sm:text-sm font-semibold min-w-0">
              <span className="truncate">🎉 LIVE on Product Hunt!</span>
              <span className="hidden md:inline">|</span>
              <span className="text-center text-[11px] sm:text-xs flex items-center gap-1 flex-wrap justify-center">
                <span>Code</span>
                <span className="px-1.5 py-0.5 bg-[#FFFFFF]/20 rounded font-mono font-bold">PH50</span>
                <span>50% OFF</span>
              </span>
              <span className="hidden md:inline">|</span>
              <span className="text-[11px] sm:text-xs opacity-90 whitespace-nowrap">⏰ 48h</span>
            </div>
            <a
              href="https://www.producthunt.com/posts/cvdebug"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFFFFF] text-[#F59E0B] font-bold rounded-lg hover:bg-[#FFFFFF]/90 transition-all duration-300 hover:scale-105 text-sm whitespace-nowrap"
            >
              Upvote →
            </a>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-[#FFFFFF]/20 rounded transition-colors flex-shrink-0"
            aria-label="Close banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
