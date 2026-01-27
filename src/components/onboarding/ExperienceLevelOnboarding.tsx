import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { ExperienceLevel, ExperienceLevelSelector } from "@/components/ExperienceLevelSelector";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ExperienceLevelOnboardingProps {
  open: boolean;
  onComplete: () => void;
}

export function ExperienceLevelOnboarding({ open, onComplete }: ExperienceLevelOnboardingProps) {
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>();
  const [targetRole, setTargetRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateExperienceLevel = useMutation(api.users.updateExperienceLevel);

  const handleContinue = async () => {
    if (!experienceLevel) {
      toast.error("Please select your experience level");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateExperienceLevel({
        experienceLevel,
        targetRole: targetRole.trim() || undefined,
      });

      toast.success("Profile updated! Your CV will be evaluated appropriately.");
      onComplete();
    } catch (error) {
      console.error("Failed to update experience level:", error);
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <VisuallyHidden>
          <DialogTitle>Personalize Your Experience</DialogTitle>
        </VisuallyHidden>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 py-4"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-gradient-to-br from-primary to-secondary">
                <span className="material-symbols-outlined text-white text-4xl">
                  person_search
                </span>
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-900">
              Let's Personalize Your Experience
            </h2>
            <p className="text-slate-600 text-base max-w-2xl mx-auto">
              We'll evaluate your CV based on your career stage. An internship CV has different
              expectations than a senior position CV.
            </p>
          </div>

          {/* Experience Level Selector */}
          <ExperienceLevelSelector
            value={experienceLevel}
            onChange={setExperienceLevel}
            label="What's your experience level?"
            required
          />

          {/* Optional: Target Role */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">work</span>
              What role are you targeting? (Optional)
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Software Engineer, Product Manager, SDR..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-slate-400"
            />
            <p className="text-xs text-slate-500">
              This helps us give more targeted feedback for your specific career goals
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleSkip}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg border-2 border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Skip for now
            </button>
            <button
              onClick={handleContinue}
              disabled={!experienceLevel || isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">
                    progress_activity
                  </span>
                  Saving...
                </>
              ) : (
                <>
                  Continue
                  <span className="material-symbols-outlined text-base">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Why This Matters */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#64748B] text-xl mt-0.5">
                lightbulb
              </span>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">How Experience Level Affects Your Score</h4>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Internship/Entry:</strong> We focus on potential and education, not extensive track record</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">✓</span>
                    <span><strong>Mid-Level:</strong> We expect quantifiable results and proven skills</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">✓</span>
                    <span><strong>Senior/Executive:</strong> We look for leadership impact, business metrics, and strategic achievements</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
