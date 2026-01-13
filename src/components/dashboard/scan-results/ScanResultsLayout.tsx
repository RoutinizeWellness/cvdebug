import { ScanResultsHeader } from "./ScanResultsHeader";
import { RobotTerminalView } from "./RobotTerminalView";
import { ATSScoreCard } from "./ATSScoreCard";
import { PaywalledKeywords } from "./PaywalledKeywords";
import { motion } from "framer-motion";

interface ScanResultsLayoutProps {
  scanId: string;
  jobTitle: string;
  scanDate: string;
  processingTime?: string;
  score: number;
  missingKeywordsCount: number;
  hasIssues: boolean;
  isPremium?: boolean;
  onUnlock?: () => void;
  onBack?: () => void;
  onShare?: () => void;
  onExportPDF?: () => void;
}

export function ScanResultsLayout({
  scanId,
  jobTitle,
  scanDate,
  processingTime,
  score,
  missingKeywordsCount,
  hasIssues,
  isPremium = false,
  onUnlock,
  onBack,
  onShare,
  onExportPDF,
}: ScanResultsLayoutProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <ScanResultsHeader
        scanId={scanId}
        jobTitle={jobTitle}
        scanDate={scanDate}
        processingTime={processingTime}
        hasIssues={hasIssues}
        onShare={onShare}
        onExportPDF={onExportPDF}
      />

      {/* Split View Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-[600px]">
        {/* Left Column: The Robot View (Terminal) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-7 flex flex-col gap-6"
        >
          <RobotTerminalView autoAnimate={true} />
        </motion.div>

        {/* Right Column: Match Score & Paywall */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-5 flex flex-col gap-6"
        >
          <ATSScoreCard score={score} showDetails={true} />

          {!isPremium && (
            <PaywalledKeywords
              missingCount={missingKeywordsCount}
              onUnlock={onUnlock}
              onBack={onBack}
            />
          )}

          {isPremium && (
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-accent">check_circle</span>
                Premium Features Unlocked
              </h3>
              <p className="text-slate-500 text-sm">
                You have access to all missing keywords, detailed format fixes, and AI-powered
                optimization suggestions.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
