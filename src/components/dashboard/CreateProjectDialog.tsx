import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { X, Link as LinkIcon, Sparkles, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/contexts/I18nContext";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const { t } = useI18n();
  const createProject = useMutation(api.projects.createProject);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMode, setInputMode] = useState<"url" | "text">("url");
  const [formData, setFormData] = useState({
    name: "",
    targetRole: "",
    jobDescriptionUrl: "",
    jobDescriptionText: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createProject({
        name: formData.name,
        targetRole: formData.targetRole,
        description: inputMode === "url" ? formData.jobDescriptionUrl : formData.jobDescriptionText,
      });
      toast.success(t.createProject.successMessage);
      onOpenChange(false);
      setFormData({ name: "", targetRole: "", jobDescriptionUrl: "", jobDescriptionText: "" });
    } catch (error) {
      toast.error(t.createProject.errorMessage);
      console.error(error);
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
            className="w-full max-w-lg glass-panel bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[#E2E8F0] flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-[#0F172A] tracking-tight">
                  {t.createProject.title}
                </h3>
                <p className="text-[#64748B] text-xs sm:text-sm mt-0.5 font-light">
                  {t.createProject.subtitle}
                </p>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="text-[#64748B] hover:text-[#0F172A] transition-colors p-2 hover:bg-[#F8FAFC] rounded-lg flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
                <div className="flex flex-col gap-4 sm:gap-6">
                  {/* Project Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#475569] block">
                      {t.createProject.projectName}
                    </label>
                    <input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[#0F172A] placeholder:text-[#64748B] focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
                      placeholder={t.createProject.projectNamePlaceholder}
                      type="text"
                      required
                    />
                  </div>

                  {/* Target Role */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#475569] block">
                      {t.createProject.targetRole}
                    </label>
                    <div className="relative">
                      <input
                        list="role-suggestions"
                        value={formData.targetRole}
                        onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                        className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[#0F172A] placeholder:text-[#64748B] focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
                        placeholder={t.createProject.targetRolePlaceholder}
                        type="text"
                        required
                      />
                      <datalist id="role-suggestions">
                        <option value="Software Engineer" />
                        <option value="Senior Software Engineer" />
                        <option value="Frontend Engineer" />
                        <option value="Backend Engineer" />
                        <option value="Full Stack Developer" />
                        <option value="DevOps Engineer" />
                        <option value="Engineering Manager" />
                        <option value="Data Scientist" />
                        <option value="Product Manager" />
                        <option value="Data Analyst" />
                        <option value="Finance Analyst" />
                        <option value="Registered Nurse" />
                        <option value="Marketing Manager" />
                        <option value="UI/UX Designer" />
                        <option value="QA Engineer" />
                        <option value="Solutions Architect" />
                        <option value="Business Analyst" />
                        <option value="Project Manager" />
                      </datalist>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none h-4 w-4 opacity-50" />
                    </div>
                    <p className="text-xs text-[#64748B] mt-1">
                      {t.createProject.targetRoleHint}
                    </p>
                  </div>

                  {/* Job Description Section */}
                  <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-[#475569] block">
                        {t.createProject.jobDescription}{" "}
                        <span className="text-[#64748B] font-normal ml-1">{t.createProject.optional}</span>
                      </label>
                      <div className="flex bg-[#F8FAFC] rounded-lg p-0.5 border border-[#E2E8F0]">
                        <button
                          type="button"
                          onClick={() => setInputMode("url")}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                            inputMode === "url"
                              ? "bg-[#FFFFFF] text-[#0F172A] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border border-[#E2E8F0]"
                              : "text-[#64748B] hover:text-[#0F172A]"
                          }`}
                        >
                          {t.createProject.linkUrl}
                        </button>
                        <button
                          type="button"
                          onClick={() => setInputMode("text")}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                            inputMode === "text"
                              ? "bg-[#FFFFFF] text-[#0F172A] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border border-[#E2E8F0]"
                              : "text-[#64748B] hover:text-[#0F172A]"
                          }`}
                        >
                          {t.createProject.pasteText}
                        </button>
                      </div>
                    </div>

                    {inputMode === "url" ? (
                      <div className="relative group">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] group-focus-within:text-primary transition-colors h-5 w-5" />
                        <input
                          value={formData.jobDescriptionUrl}
                          onChange={(e) =>
                            setFormData({ ...formData, jobDescriptionUrl: e.target.value })
                          }
                          className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg pl-10 pr-4 py-2.5 text-[#0F172A] placeholder:text-[#64748B] focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
                          placeholder={t.createProject.urlPlaceholder}
                          type="url"
                        />
                      </div>
                    ) : (
                      <textarea
                        value={formData.jobDescriptionText}
                        onChange={(e) =>
                          setFormData({ ...formData, jobDescriptionText: e.target.value })
                        }
                        className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[#0F172A] placeholder:text-[#64748B] focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] resize-none"
                        placeholder={t.createProject.textPlaceholder}
                        rows={4}
                      />
                    )}
                  </div>

                  {/* AI Info Box */}
                  <div className="p-3 sm:p-3.5 rounded-lg bg-gradient-to-br from-slate-50 to-[#F1F5F9] border border-[#E2E8F0] flex gap-2 sm:gap-3 items-start">
                    <Sparkles className="text-[#475569] mt-0.5 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <div className="text-xs text-[#0F172A] min-w-0">
                      <strong className="text-[#0F172A] block mb-0.5 font-semibold">
                        {t.createProject.aiAnalysisTitle}
                      </strong>
                      <span className="break-words">
                        {t.createProject.aiAnalysisDesc}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 bg-[#F8FAFC] rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="order-2 sm:order-1 px-5 py-2.5 rounded-lg text-sm font-medium text-[#475569] border border-[#E2E8F0] hover:bg-slate-100 hover:text-[#0F172A] hover:border-[#E2E8F0] transition-all"
                >
                  {t.createProject.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="order-1 sm:order-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#334155] to-primary hover:from-slate-500 hover:to-[#475569] shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? t.createProject.creating : t.createProject.createButton}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
