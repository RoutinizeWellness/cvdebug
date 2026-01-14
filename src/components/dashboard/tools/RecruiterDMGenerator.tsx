import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, MessageSquare, Sparkles, Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

// Cast to any to avoid deep type instantiation errors
const apiAny = api as any;

interface RecruiterDMGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecruiterDMGenerator({ open, onOpenChange }: RecruiterDMGeneratorProps) {
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [recruiterName, setRecruiterName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDMs, setGeneratedDMs] = useState<any>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const jobHistory = useQuery(apiAny.jobTracker.getJobHistory);
  const applications = useQuery(apiAny.applications.getApplicationsByProject,
    selectedJobId ? { projectId: selectedJobId as any } : "skip"
  );
  const generateDMs = useAction(apiAny.ai.linkedinOptimizer.generateRecruiterDMs);
  const addTimelineEvent = useMutation(apiAny.applications.addTimelineEvent);

  const resumes = useQuery(apiAny.resumes.getResumes);
  const latestResume = resumes && resumes.length > 0 ? resumes[0] : null;

  const handleGenerate = async () => {
    if (!selectedJobId) {
      toast.error("Please select a job application");
      return;
    }
    if (!latestResume) {
      toast.error("No resume found. Please upload a resume first.");
      return;
    }

    const selectedJob = jobHistory?.find((j: any) => j._id === selectedJobId);
    if (!selectedJob) return;

    setIsGenerating(true);
    try {
      const profileText = (latestResume as any).ocrText || (latestResume as any).content || "Experienced professional";

      const result = await generateDMs({
        profileText: profileText,
        jobDescription: selectedJob.jobDescription || selectedJob.jobTitle,
        recruiterName: recruiterName,
        missingKeywords: selectedJob.missingKeywords,
        applicationId: selectedJobId as any,
      });

      setGeneratedDMs(result);

      const firstVariation = result.variations?.[0];
      const previewText = firstVariation ? `Subject: "${firstVariation.subject}"\n\n${firstVariation.content}` : "No content generated";

      // Add timeline event
      await addTimelineEvent({
        applicationId: selectedJobId as any,
        type: "dm_generated",
        title: "Recruiter DM Generated",
        description: previewText,
      });

      toast.success("DMs Generated!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to generate DMs");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast.success("Copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-[#0F172A]">
            <MessageSquare className="h-5 w-5 text-[#3B82F6]" />
            Recruiter DM Generator
          </DialogTitle>
          <DialogDescription className="text-[#64748B]">
            Generate high-conversion LinkedIn messages to get your application noticed.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="job" className="text-[#475569]">Target Application</Label>
            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
              <SelectTrigger className="bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A]">
                <SelectValue placeholder="Select a job..." />
              </SelectTrigger>
              <SelectContent className="bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A]">
                {jobHistory?.map((job: any) => (
                  <SelectItem key={job._id} value={job._id}>
                    {job.jobTitle} @ {job.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="recruiter" className="text-[#475569]">Recruiter Name (Optional)</Label>
            <Input
              id="recruiter"
              placeholder="e.g. Sarah Smith"
              value={recruiterName}
              onChange={(e) => setRecruiterName(e.target.value)}
              className="bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A]"
            />
          </div>
        </div>

        {generatedDMs ? (
          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-4 pb-4">
              {generatedDMs.variations?.map((dm: any, i: number) => (
                <Card key={i} className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] bg-[#FFFFFF] px-2 py-1 rounded border border-[#E2E8F0]">
                        {dm.tone}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-[#64748B] hover:text-[#0F172A]"
                      onClick={() => copyToClipboard(dm.subject + "\n\n" + dm.content, i)}
                    >
                      {copiedIndex === i ? <CheckCircle2 className="h-3 w-3 mr-1 text-[#22C55E]" /> : <Copy className="h-3 w-3 mr-1" />}
                      {copiedIndex === i ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2">
                      Subject: {dm.subject}
                    </div>
                    <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-wrap">
                      {dm.content}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center min-h-[200px] border-2 border-dashed border-[#E2E8F0] rounded-xl bg-[#F8FAFC]">
            <div className="text-center text-[#64748B]">
              <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Select a job to generate personalized DMs</p>
            </div>
          </div>
        )}

        <DialogFooter className="pt-4 border-t border-[#E2E8F0]">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !selectedJobId}
            className="w-full bg-[#3B82F6] hover:bg-blue-700 text-white font-bold"
          >
            {isGenerating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Strategies...</>
            ) : (
              <><Sparkles className="mr-2 h-4 w-4" /> Generate DMs</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
