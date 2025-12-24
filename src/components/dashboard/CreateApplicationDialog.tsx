import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Loader2, Lock, Sparkles } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#0A0A0A] border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Add New Application
            {!hasInterviewSprint && (
              <Lock className="h-4 w-4 text-slate-500" />
            )}
          </DialogTitle>
        </DialogHeader>

        {!hasInterviewSprint && (
          <Alert className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/30">
            <Lock className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              <strong className="text-white">Interview Sprint Required</strong>
              <p className="text-slate-300 mt-1">
                Upgrade to track applications, get keyword analysis, and receive ghosting alerts.
              </p>
              <Button 
                onClick={onUpgrade}
                size="sm" 
                className="mt-3 bg-primary hover:bg-primary/90 text-black font-bold"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="e.g., Acme Corp"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
                className="bg-zinc-900 border-zinc-700"
                disabled={!hasInterviewSprint}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                placeholder="e.g., Senior Engineer"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                required
                className="bg-zinc-900 border-zinc-700"
                disabled={!hasInterviewSprint}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobUrl">Job Posting URL (Optional)</Label>
            <Input
              id="jobUrl"
              placeholder="https://..."
              value={formData.jobUrl}
              onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
              className="bg-zinc-900 border-zinc-700"
              disabled={!hasInterviewSprint}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description <span className="text-primary text-xs ml-2 font-normal">(Recommended for AI Analysis)</span></Label>
            <Textarea
              id="jobDescription"
              placeholder="Paste the full job description here. AI will instantly analyze it against your resume to find keyword gaps..."
              value={formData.jobDescriptionText}
              onChange={(e) => setFormData({ ...formData, jobDescriptionText: e.target.value })}
              className="bg-zinc-900 border-zinc-700 min-h-[150px]"
              disabled={!hasInterviewSprint}
            />
            <p className="text-xs text-slate-500">
              We'll analyze this against your project's resume to calculate a match score and find missing keywords.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !hasInterviewSprint} 
              className="bg-primary text-black hover:bg-primary/90"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : !hasInterviewSprint ? (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Upgrade to Add
                </>
              ) : (
                "Add Application"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}