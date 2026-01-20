import { motion } from "framer-motion";
import { MapPin, Sparkles, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { getRegionalPrice, getCurrentRegion } from "@/lib/locale";

export function RegionalPricingBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [pricing, setPricing] = useState<{
    formatted: string;
    discount?: number;
    countryName: string;
  } | null>(null);

  useEffect(() => {
    const region = getCurrentRegion();
    const regionalPrice = getRegionalPrice(24.99); // Base price $24.99/month

    // Only show banner if user gets a discount (emerging markets)
    if (regionalPrice.discount) {
      setPricing({
        formatted: regionalPrice.formatted,
        discount: regionalPrice.discount,
        countryName: region.countryName,
      });
      setShowBanner(true);
    }
  }, []);

  if (!showBanner || !pricing) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 text-white shadow-lg"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3 text-sm md:text-base flex-wrap">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="font-semibold">{pricing.countryName}</span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-white/30"></div>

          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 flex-shrink-0" />
            <span className="font-bold">{pricing.discount}% OFF</span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-white/30"></div>

          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 flex-shrink-0 animate-pulse" />
            <span>
              Special pricing: <strong>{pricing.formatted}/month</strong>
            </span>
          </div>

          <button
            onClick={() => setShowBanner(false)}
            className="ml-auto text-white/80 hover:text-white transition-colors"
            aria-label="Close banner"
          >
            ✕
          </button>
        </div>
      </div>
    </motion.div>
  );
}
