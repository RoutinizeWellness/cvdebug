import { Home, FileText, Sparkles, User, Upload, Target } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface MobileTabBarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onUpload: () => void;
}

export function MobileTabBar({ currentView, setCurrentView, onUpload }: MobileTabBarProps) {
  const tabs = [
    { id: "mission", label: "Home", icon: Home },
    { id: "match", label: "Match", icon: Target },
    { id: "tools", label: "AI", icon: Sparkles },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* Light Theme Background */}
      <div className="relative bg-[#FFFFFF]/95 backdrop-blur-xl border-t border-[#E2E8F0] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around px-2 py-2 relative">
          {tabs.map((tab, index) => {
            const isActive = currentView === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className="relative flex flex-col items-center gap-1 px-3 py-2 transition-all min-w-[48px] min-h-[48px] justify-center"
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    color: isActive ? "#8B5CF6" : "#64748B",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Icon className="h-6 w-6" />
                </motion.div>

                <span
                  className={`text-[10px] font-bold transition-colors ${
                    isActive ? "text-[#8B5CF6]" : "text-[#64748B]"
                  }`}
                >
                  {tab.label}
                </span>

                {/* Active Indicator Dot */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#8B5CF6]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}

          {/* FAB - Quick Upload Button */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 -top-6"
            whileTap={{ scale: 0.9 }}
          >
            <Button
              onClick={onUpload}
              className="h-14 w-14 rounded-full bg-gradient-to-br from-[#64748B] to-[#8B5CF6] hover:from-[#64748B]/90 hover:to-[#8B5CF6]/90 shadow-[0_0_30px_rgba(139,92,246,0.5)] border-4 border-[#FFFFFF]"
              aria-label="Upload Resume"
            >
              <Upload className="h-6 w-6 text-white" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
