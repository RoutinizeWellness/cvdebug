import { Sidebar } from "./Sidebar";
import { MetricsGrid } from "./MetricsGrid";
import { KanbanBoard } from "./KanbanBoard";
import { TopErrors } from "./TopErrors";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface MissionControlLayoutProps {
  userName?: string;
  onNewApplication?: () => void;
  onLogout?: () => void;
}

export function MissionControlLayout({
  userName = "User",
  onNewApplication,
  onLogout,
}: MissionControlLayoutProps) {
  return (
    <div className="flex h-screen w-full">
      <Sidebar userName={userName} onLogout={onLogout} />

      <main className="flex-1 overflow-y-auto bg-[#F8FAFC] relative">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#1E293B] to-[#0F172A] opacity-50 pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
          {/* Page Heading */}
          <header className="flex flex-wrap justify-between items-end gap-4 border-b border-[#E2E8F0] pb-6">
            <div className="flex flex-col gap-2">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[#0F172A] text-3xl font-bold tracking-tight"
              >
                Mission Control
              </motion.h2>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
                </span>
                <p className="text-[#64748B] text-sm font-mono">
                  System Status: Operational // Welcome back, {userName}.
                </p>
              </div>
            </div>
            <Button
              onClick={onNewApplication}
              className="flex items-center gap-2 rounded-lg h-10 pl-3 pr-4 bg-gradient-to-r from-primary to-secondary shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] text-[#0F172A] text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-5 w-5" />
              <span>New Application</span>
            </Button>
          </header>

          {/* Metrics Grid */}
          <MetricsGrid />

          {/* Kanban + Errors */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[400px]">
            <KanbanBoard />
            <TopErrors />
          </div>
        </div>
      </main>
    </div>
  );
}
