import { Home, FileText, Sparkles, User, Upload } from "lucide-react";
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
    { id: "resumes", label: "Scans", icon: FileText },
    { id: "tools", label: "AI Tools", icon: Sparkles },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Glassmorphism Background */}
      <div className="relative bg-slate-950/80 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-around px-2 py-3 relative">
          {tabs.map((tab, index) => {
            const isActive = currentView === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className="relative flex flex-col items-center gap-1 px-4 py-2 transition-all"
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    color: isActive ? "#A37FBC" : "#94a3b8",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
                
                <span
                  className={`text-[10px] font-bold transition-colors ${
                    isActive ? "text-primary" : "text-slate-500"
                  }`}
                >
                  {tab.label}
                </span>
                
                {/* Active Indicator Dot */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
          
          {/* FAB - Quick Upload Button */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 -top-8"
            whileTap={{ scale: 0.9 }}
          >
            <Button
              onClick={onUpload}
              className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-[0_0_30px_rgba(59,130,246,0.5)] border-4 border-slate-950"
            >
              <Upload className="h-6 w-6 text-slate-900" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
