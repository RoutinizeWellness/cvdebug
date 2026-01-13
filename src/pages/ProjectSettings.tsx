import { useState } from "react";
import { Sidebar } from "@/components/dashboard/mission-control/Sidebar";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { AISuggestionsDialog } from "@/components/ui/AISuggestionsDialog";
import { UpgradePrompt } from "@/components/ui/UpgradePrompt";
import { NotificationPopup, useNotifications } from "@/components/ui/NotificationPopup";
import { Bell, Plus, ChevronRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ProjectSettings() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAISuggestionsOpen, setIsAISuggestionsOpen] = useState(false);
  const [isUpgradePromptOpen, setIsUpgradePromptOpen] = useState(false);
  const { notifications, addNotification, removeNotification } = useNotifications();

  const handleDeleteProject = () => {
    console.log("Project deleted");
    setIsDeleteDialogOpen(false);
    // Add your delete logic here
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar userName="John Doe" />

      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#0F172A]">
        {/* Background Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]"></div>
        </div>

        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#1E293B]/30 backdrop-blur-sm z-10">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Projects</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">cv-debug-v1</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <Button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Session
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 relative z-0">
          <div className="max-w-6xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-end justify-between"
            >
              <div>
                <h2 className="text-3xl font-bold text-white">Project Settings</h2>
                <p className="text-slate-400 mt-1">
                  Manage configuration and danger zones for this project.
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-6">
              {/* Demo Dialogs Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass-panel rounded-xl p-6 shadow-glass border border-cyan-500/20"
              >
                <h3 className="text-lg font-semibold text-white mb-2">UI Components Demo</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Test dialog components and interactive UI elements.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setIsAISuggestionsOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    AI Suggestions
                  </button>
                  <button
                    onClick={() => setIsUpgradePromptOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-primary to-[#2b3bee] hover:brightness-110 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    Upgrade Prompt
                  </button>
                  <button
                    onClick={() =>
                      addNotification({
                        type: "success",
                        title: "CV Uploaded Successfully!",
                        message: "System has finished parsing",
                        fileName: "alex_resume_v4.pdf",
                      })
                    }
                    className="px-4 py-2 bg-[#22C55E] hover:bg-[#22C55E] text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
                  >
                    <Bell className="h-4 w-4" />
                    Show Notification
                  </button>
                </div>
              </motion.div>

              {/* General Configuration Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="glass-panel rounded-xl p-6 shadow-glass"
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  General Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">
                      Project Name
                    </label>
                    <input
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      type="text"
                      defaultValue="cv-debug-v1"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">
                      Environment
                    </label>
                    <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                      <option>Production</option>
                      <option>Staging</option>
                      <option>Development</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Danger Zone Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-panel rounded-xl p-6 shadow-glass border border-red-900/30 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-[#EF4444]"></div>
                <h3 className="text-lg font-semibold text-white mb-2">Danger Zone</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Irreversible actions for this project.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-[#EF4444]/5 border border-red-500/20 gap-4">
                  <div>
                    <h4 className="text-white font-medium">Delete Project</h4>
                    <p className="text-slate-400 text-sm mt-1">
                      Once you delete a project, there is no going back. Please be certain.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="px-4 py-2 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] text-sm font-bold rounded-lg border border-red-500/50 transition-colors whitespace-nowrap"
                  >
                    Delete Project
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        description="Are you sure you want to delete the project"
        itemName="cv-debug-v1"
        confirmText="Delete Project"
        requiresTyping={true}
        confirmationWord="DELETE"
        isDangerous={true}
      />

      {/* AI Suggestions Dialog */}
      <AISuggestionsDialog
        isOpen={isAISuggestionsOpen}
        onClose={() => setIsAISuggestionsOpen(false)}
        keyword="Project Management"
        onInsert={(suggestion) => console.log("Inserted:", suggestion)}
        onRegenerate={() => console.log("Regenerating suggestions...")}
      />

      {/* Upgrade Prompt */}
      <UpgradePrompt
        isOpen={isUpgradePromptOpen}
        onClose={() => setIsUpgradePromptOpen(false)}
        onUpgrade={() => {
          console.log("Upgrade clicked");
          setIsUpgradePromptOpen(false);
          // Navigate to pricing or checkout
        }}
      />

      {/* Notification Popups */}
      <NotificationPopup
        notifications={notifications}
        onDismiss={removeNotification}
        position="top-right"
      />
    </div>
  );
}
