import { motion } from "framer-motion";
import { Globe } from "lucide-react";

export type TargetMarket = "USA" | "UK" | "DACH" | "EU" | "LATAM" | "APAC";

interface RegionSelectorProps {
  selectedRegion: TargetMarket;
  onRegionChange: (region: TargetMarket) => void;
}

const REGIONS = [
  {
    value: "USA" as TargetMarket,
    label: "🇺🇸 USA",
    description: "Optimized for US ATS systems (Workday, Taleo)",
    keywords: ["Action verbs", "Quantified results", "Concise format"]
  },
  {
    value: "UK" as TargetMarket,
    label: "🇬🇧 UK",
    description: "British CV standards (Personal statement, A-levels)",
    keywords: ["Professional summary", "Education focus", "British spelling"]
  },
  {
    value: "DACH" as TargetMarket,
    label: "🇩🇪 DACH",
    description: "Germany, Austria, Switzerland (Photo, detailed)",
    keywords: ["Chronological", "Photo optional", "Detailed experience"]
  },
  {
    value: "EU" as TargetMarket,
    label: "🇪🇺 EU",
    description: "European standards (Europass compatible)",
    keywords: ["Europass format", "Language skills", "Mobility"]
  },
  {
    value: "LATAM" as TargetMarket,
    label: "🌎 LATAM",
    description: "Latin America (Spanish/Portuguese)",
    keywords: ["Photo included", "Personal details", "References"]
  },
  {
    value: "APAC" as TargetMarket,
    label: "🌏 APAC",
    description: "Asia-Pacific region standards",
    keywords: ["Photo common", "Detailed personal info", "References"]
  }
];

export function RegionSelector({ selectedRegion, onRegionChange }: RegionSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-5 w-5 text-[#475569]" />
        <h3 className="text-lg font-bold text-[#0F172A]">Target Market</h3>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
          Premium
        </span>
      </div>

      <p className="text-sm text-[#64748B] mb-4">
        Different markets have different ATS expectations. Select your target region for optimized analysis.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {REGIONS.map((region) => (
          <motion.button
            key={region.value}
            onClick={() => onRegionChange(region.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative text-left p-4 rounded-xl border-2 transition-all ${
              selectedRegion === region.value
                ? 'border-[#22C55E] bg-[#22C55E]/5 shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                : 'border-[#E2E8F0] bg-white hover:border-[#64748B]/50 hover:shadow-md'
            }`}
          >
            {selectedRegion === region.value && (
              <motion.div
                layoutId="selected-region"
                className="absolute inset-0 border-2 border-[#22C55E] rounded-xl"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{region.label.split(' ')[0]}</span>
                {selectedRegion === region.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-5 w-5 rounded-full bg-[#22C55E] flex items-center justify-center"
                  >
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </div>

              <h4 className="font-bold text-[#0F172A] mb-1 text-sm">
                {region.label.split(' ').slice(1).join(' ')}
              </h4>

              <p className="text-xs text-[#64748B] mb-2 line-clamp-2">
                {region.description}
              </p>

              <div className="flex flex-wrap gap-1 mt-2">
                {region.keywords.slice(0, 2).map((keyword) => (
                  <span
                    key={keyword}
                    className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <span className="font-bold">💡 Pro Tip:</span> DACH region expects more detailed work history and often includes a photo.
          USA resumes emphasize quantified achievements and action verbs.
        </p>
      </div>
    </div>
  );
}
