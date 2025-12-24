import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface CreateApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: Id<"projects">;
}

export function CreateApplicationDialog({ open, onOpenChange, projectId }: CreateApplicationDialogProps) {
  const createApplication = useMutation(api.applications.createApplication);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    jobUrl: "",
    jobDescriptionText: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (error) {
      console.error(error);
      toast.error("Failed to add application");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#0A0A0A] border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Add New Application</DialogTitle>
        </DialogHeader>
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
            />
            <p className="text-xs text-slate-500">
              We'll analyze this against your project's resume to calculate a match score and find missing keywords.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary text-black hover:bg-primary/90">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}