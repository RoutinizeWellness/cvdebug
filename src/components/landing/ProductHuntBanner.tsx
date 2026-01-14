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
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 justify-center">
            <Rocket className="h-5 w-5 animate-bounce" />
            <div className="flex flex-col sm:flex-row items-center gap-2 text-sm font-semibold">
              <span>🎉 We're LIVE on Product Hunt!</span>
              <span className="hidden sm:inline">|</span>
              <span>
                Use code <span className="px-2 py-0.5 bg-[#FFFFFF]/20 rounded font-mono font-bold">PH50</span> for 50% OFF
              </span>
              <span className="hidden sm:inline">|</span>
              <span className="text-xs opacity-90">⏰ 48 hours only</span>
            </div>
            <a
              href="https://www.producthunt.com/posts/cvdebug"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFFFFF] text-[#F59E0B] font-bold rounded-lg hover:bg-[#FFFFFF]/90 transition-all duration-300 hover:scale-105 text-sm"
            >
              Upvote us →
            </a>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-[#FFFFFF]/20 rounded transition-colors"
            aria-label="Close banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
