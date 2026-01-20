import { X, Lock, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/contexts/I18nContext";

interface CreateApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: Id<"projects">;
  onUpgrade?: () => void;
}

export function CreateApplicationDialog({ open, onOpenChange, projectId, onUpgrade }: CreateApplicationDialogProps) {
  const { t } = useI18n();
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
      toast.error(t.createApplication.planRequired, {
        description: t.createApplication.planRequiredDesc
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
      toast.success(t.createApplication.successMessage);
      onOpenChange(false);
      setFormData({ companyName: "", jobTitle: "", jobUrl: "", jobDescriptionText: "" });
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("PLAN_RESTRICTION")) {
        toast.error(t.createApplication.planRequired, {
          description: t.createApplication.featureRestricted
        });
        onUpgrade?.();
      } else {
        toast.error(t.createApplication.errorMessage);
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
            className="w-full max-w-lg glass-panel bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-[#0F172A] tracking-tight">
                  {t.createApplication.title}
                </h3>
                {!hasInterviewSprint && (
                  <Lock className="h-4 w-4 text-[#64748B]" />
                )}
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="text-[#64748B] hover:text-[#0F172A] transition-colors p-2 hover:bg-[#F8FAFC] rounded-lg"
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
                    <p className="text-sm font-bold text-[#0F172A]">{t.createApplication.sprintRequired}</p>
                    <p className="text-xs text-[#475569] mt-1">
                      {t.createApplication.upgradeDesc}
                    </p>
                    <button
                      onClick={onUpgrade}
                      className="mt-3 bg-primary hover:bg-primary/90 text-black font-bold text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Sparkles className="h-4 w-4" />
                      {t.createApplication.upgradeNow}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#475569] block">
                        {t.createApplication.companyName}
                      </label>
                      <input
                        placeholder={t.createApplication.companyPlaceholder}
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        required
                        disabled={!hasInterviewSprint}
                        className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[#0F172A] placeholder:text-[#64748B] focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#475569] block">
                        {t.createApplication.jobTitle}
                      </label>
                      <input
                        placeholder={t.createApplication.jobTitlePlaceholder}
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        required
                        disabled={!hasInterviewSprint}
                        className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[#0F172A] placeholder:text-[#64748B] focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#475569] block">
                      {t.createApplication.jobUrl} <span className="text-[#64748B] font-normal">{t.createApplication.optional}</span>
                    </label>
                    <input
                      type="url"
                      placeholder={t.createApplication.urlPlaceholder}
                      value={formData.jobUrl}
                      onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                      disabled={!hasInterviewSprint}
                      className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[#0F172A] placeholder:text-[#64748B] focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#475569] block">
                      {t.createApplication.jobDescription}
                      <span className="text-primary text-xs ml-2 font-normal">{t.createApplication.recommendedAI}</span>
                    </label>
                    <textarea
                      placeholder={t.createApplication.descriptionPlaceholder}
                      value={formData.jobDescriptionText}
                      onChange={(e) => setFormData({ ...formData, jobDescriptionText: e.target.value })}
                      rows={6}
                      disabled={!hasInterviewSprint}
                      className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[#0F172A] placeholder:text-[#64748B] focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] resize-none disabled:opacity-50"
                    />
                    <p className="text-xs text-[#64748B]">
                      Add the job description to get instant keyword gap analysis
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 sm:px-6 py-4 border-t border-[#E2E8F0] flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="w-full sm:w-auto px-6 py-2.5 text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-lg transition-colors font-medium text-center"
                >
                  {t.createApplication.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !hasInterviewSprint}
                  className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:bg-slate-200 disabled:text-[#64748B] text-[#0F172A] font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isLoading ? t.createApplication.adding : t.createApplication.addApplication}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
