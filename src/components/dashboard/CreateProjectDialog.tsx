import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { X, Link as LinkIcon, Sparkles, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
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
      toast.success("Project created successfully!");
      onOpenChange(false);
      setFormData({ name: "", targetRole: "", jobDescriptionUrl: "", jobDescriptionText: "" });
    } catch (error) {
      toast.error("Failed to create project");
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
            className="w-full max-w-lg glass-panel bg-slate-900/60 rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white tracking-tight">
                  Create New Job Search Project
                </h3>
                <p className="text-slate-400 text-sm mt-0.5 font-light">
                  Configure your new tracking campaign.
                </p>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <div className="flex flex-col gap-6">
                  {/* Project Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 block">
                      Project Name
                    </label>
                    <input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all shadow-inner"
                      placeholder="e.g. Senior SWE Hunt at Google"
                      type="text"
                      required
                    />
                  </div>

                  {/* Target Role */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 block">
                      Target Role
                    </label>
                    <div className="relative">
                      <select
                        value={formData.targetRole}
                        onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all shadow-inner appearance-none cursor-pointer"
                        required
                      >
                        <option className="text-slate-500" disabled value="">
                          Select a role...
                        </option>
                        <option>Frontend Engineer</option>
                        <option>Backend Engineer</option>
                        <option>Full Stack Developer</option>
                        <option>DevOps Engineer</option>
                        <option>Engineering Manager</option>
                        <option>Data Scientist</option>
                        <option>Product Manager</option>
                        <option>Data Analyst</option>
                        <option>Finance Analyst</option>
                        <option>Registered Nurse</option>
                        <option>Marketing Manager</option>
                        <option>UI/UX Designer</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none h-5 w-5" />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      This helps the AI tune resume suggestions.
                    </p>
                  </div>

                  {/* Job Description Section */}
                  <div className="space-y-3 pt-2 border-t border-slate-800/50">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-300 block">
                        Job Description{" "}
                        <span className="text-slate-500 font-normal ml-1">(Optional)</span>
                      </label>
                      <div className="flex bg-slate-950/50 rounded-lg p-0.5 border border-slate-800">
                        <button
                          type="button"
                          onClick={() => setInputMode("url")}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                            inputMode === "url"
                              ? "bg-slate-700 text-white shadow-sm border border-slate-600"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Link URL
                        </button>
                        <button
                          type="button"
                          onClick={() => setInputMode("text")}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                            inputMode === "text"
                              ? "bg-slate-700 text-white shadow-sm border border-slate-600"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Paste Text
                        </button>
                      </div>
                    </div>

                    {inputMode === "url" ? (
                      <div className="relative group">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors h-5 w-5" />
                        <input
                          value={formData.jobDescriptionUrl}
                          onChange={(e) =>
                            setFormData({ ...formData, jobDescriptionUrl: e.target.value })
                          }
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all shadow-inner"
                          placeholder="https://linkedin.com/jobs/view/..."
                          type="url"
                        />
                      </div>
                    ) : (
                      <textarea
                        value={formData.jobDescriptionText}
                        onChange={(e) =>
                          setFormData({ ...formData, jobDescriptionText: e.target.value })
                        }
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all shadow-inner resize-none"
                        placeholder="Paste the full job description here..."
                        rows={4}
                      />
                    )}
                  </div>

                  {/* AI Info Box */}
                  <div className="p-3.5 rounded-lg bg-gradient-to-br from-indigo-500/10 to-blue-500/5 border border-indigo-500/20 flex gap-3 items-start">
                    <Sparkles className="text-indigo-400 mt-0.5 h-5 w-5" />
                    <div className="text-xs text-indigo-200">
                      <strong className="text-indigo-100 block mb-0.5 font-semibold">
                        AI Analysis Enabled
                      </strong>
                      We will automatically extract keywords from the provided JD to optimize your CV
                      and calculate match scores.
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-5 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-900/30 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-primary hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
