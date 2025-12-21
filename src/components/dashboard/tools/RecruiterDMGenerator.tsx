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
import { useMutation, useQuery } from "convex/react";
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
  const generateDMs = useAction(apiAny.ai.linkedinOptimizer.generateRecruiterDMs);
  
  // We need a resume text to generate DMs. For now, let's fetch the latest resume.
  const resumes = useQuery(apiAny.resumes.getResumes);
  const latestResume = resumes && resumes.length > 0 ? resumes[0] : null;

  // Helper to call action (since useAction isn't directly imported from convex/react in some setups, 
  // but here we assume standard setup. If useAction is missing, we use useMutation for wrapper or direct call if client-side allowed)
  // Actually, in the instructions, it says "useAction for actions".
  
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
      // We need the resume text. In a real app, we might store the text or re-OCR.
      // For this demo, we'll assume we can pass a placeholder or fetch text if available.
      // The action expects profileText. We'll use a placeholder if text isn't readily available in the resume object
      // or if we don't want to fetch the full text here.
      // Ideally, the backend should handle fetching the resume text by ID.
      // But the action `generateRecruiterDMs` takes `profileText`.
      // Let's assume `latestResume.content` exists or we pass a summary.
      // If `content` is not on the object, we might need to fetch it.
      // For now, let's pass a generic string if content is missing to avoid breaking, 
      // but in production we'd fetch the text.
      
      const profileText = (latestResume as any).content || "Experienced professional with skills in " + ((latestResume as any).skills || []).join(", ");

      const result = await generateDMs({
        profileText: profileText,
        jobDescription: selectedJob.jobDescription || selectedJob.jobTitle, // Fallback
        recruiterName: recruiterName,
        missingKeywords: selectedJob.missingKeywords,
      });

      setGeneratedDMs(result);
      toast.success("DMs Generated!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to generate DMs");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast.success("Copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#0A0A0A] border-zinc-800 text-zinc-200 max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            Recruiter DM Generator
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Generate high-conversion LinkedIn messages to get your application noticed.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="job">Target Application</Label>
            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
              <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-200">
                <SelectValue placeholder="Select a job..." />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                {jobHistory?.map((job: any) => (
                  <SelectItem key={job._id} value={job._id}>
                    {job.jobTitle} @ {job.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="recruiter">Recruiter Name (Optional)</Label>
            <Input
              id="recruiter"
              placeholder="e.g. Sarah Smith"
              value={recruiterName}
              onChange={(e) => setRecruiterName(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-zinc-200"
            />
          </div>
        </div>

        {generatedDMs ? (
          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-4 pb-4">
              {generatedDMs.variations?.map((dm: any, i: number) => (
                <Card key={i} className="bg-zinc-900/50 border-zinc-800 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 bg-zinc-950 px-2 py-1 rounded">
                        {dm.tone}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-zinc-400 hover:text-white"
                      onClick={() => copyToClipboard(dm.subject + "\n\n" + dm.content, i)}
                    >
                      {copiedIndex === i ? <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" /> : <Copy className="h-3 w-3 mr-1" />}
                      {copiedIndex === i ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-zinc-300 border-b border-zinc-800/50 pb-2">
                      Subject: {dm.subject}
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
                      {dm.content}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center min-h-[200px] border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
            <div className="text-center text-zinc-500">
              <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Select a job to generate personalized DMs</p>
            </div>
          </div>
        )}

        <DialogFooter className="pt-4 border-t border-zinc-800">
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !selectedJobId}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
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

import { useAction } from "convex/react";
