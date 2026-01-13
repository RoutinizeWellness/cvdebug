import { X, Lock, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";

interface CreateApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: Id<"projects">;
  onUpgrade?: () => void;
}

export function CreateApplicationDialog({ open, onOpenChange, projectId, onUpgrade }: CreateApplicationDialogProps) {
  const createApplication = useMutation(api.applications.createApplication);
  const currentUser = useQuery((api as any).users.currentUser);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    jobUrl: "",
    jobDescriptionText: "",
  });

  // Check if user has Interview Sprint plan
  const hasInterviewSprint = currentUser?.subscriptionTier === "interview_sprint" &&
    (!currentUser?.sprintExpiresAt || currentUser.sprintExpiresAt > Date.now());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasInterviewSprint) {
      toast.error("Interview Sprint plan required", {
        description: "Upgrade to track applications and get AI-powered insights"
      });
      onUpgrade?.();
      return;
    }

    setIsLoading(true);
    try {
      await createApplication({
        projectId,
        companyName: formData.companyName,
        jobTitle: formData.jobTitle,
        jobUrl: formData.jobUrl || undefined,
        jobDescriptionText: formData.jobDescriptionText || undefined,
      });
      toast.success("Application added successfully");
      onOpenChange(false);
      setFormData({ companyName: "", jobTitle: "", jobUrl: "", jobDescriptionText: "" });
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("PLAN_RESTRICTION")) {
        toast.error("Interview Sprint plan required", {
          description: "This feature is only available with an active Interview Sprint subscription"
        });
        onUpgrade?.();
      } else {
        toast.error("Failed to add application");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] bg-midnight/70 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-300">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg glass-panel bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
                  Add New Application
                </h3>
                {!hasInterviewSprint && (
                  <Lock className="h-4 w-4 text-slate-500" />
                )}
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="text-slate-500 hover:text-slate-900 transition-colors p-2 hover:bg-slate-50 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Upgrade Alert */}
            {!hasInterviewSprint && (
              <div className="mx-6 mt-6 bg-gradient-to-r from-primary/10 to-teal-500/10 border border-primary/30 rounded-xl p-4">
                <div className="flex gap-3">
                  <Lock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">Interview Sprint Required</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Upgrade to track applications, get keyword analysis, and receive ghosting alerts.
                    </p>
                    <button
                      onClick={onUpgrade}
                      className="mt-3 bg-primary hover:bg-primary/90 text-black font-bold text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Sparkles className="h-4 w-4" />
                      Upgrade Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 block">
                        Company Name
                      </label>
                      <input
                        placeholder="e.g., Acme Corp"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        required
                        disabled={!hasInterviewSprint}
                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-500 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all shadow-sm disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 block">
                        Job Title
                      </label>
                      <input
                        placeholder="e.g., Senior Engineer"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        required
                        disabled={!hasInterviewSprint}
                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-500 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all shadow-sm disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 block">
                      Job Posting URL <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.jobUrl}
                      onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                      disabled={!hasInterviewSprint}
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-500 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all shadow-sm disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 block">
                      Job Description
                      <span className="text-primary text-xs ml-2 font-normal">(Recommended for AI Analysis)</span>
                    </label>
                    <textarea
                      placeholder="Paste the job description here for AI-powered keyword matching..."
                      value={formData.jobDescriptionText}
                      onChange={(e) => setFormData({ ...formData, jobDescriptionText: e.target.value })}
                      rows={6}
                      disabled={!hasInterviewSprint}
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-500 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all shadow-sm resize-none disabled:opacity-50"
                    />
                    <p className="text-xs text-slate-500">
                      Add the job description to get instant keyword gap analysis
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-200 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="px-6 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !hasInterviewSprint}
                  className="px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:bg-slate-200 disabled:text-slate-500 text-slate-900 font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isLoading ? "Adding..." : "Add Application"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
