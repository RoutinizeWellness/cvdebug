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
import { useI18n } from "@/contexts/I18nContext";

// Cast to any to avoid deep type instantiation errors
const apiAny = api as any;

interface RecruiterDMGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPaidUser?: boolean;
  onUpgrade?: () => void;
}

export function RecruiterDMGenerator({ open, onOpenChange, isPaidUser = false, onUpgrade }: RecruiterDMGeneratorProps) {
  const { t } = useI18n();
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
            <MessageSquare className="h-5 w-5 text-[#64748B]" />
            Recruiter DM Generator
          </DialogTitle>
          <DialogDescription className="text-[#64748B]">
            Generate high-conversion LinkedIn messages to get your application noticed.
          </DialogDescription>
        </DialogHeader>

        {!isPaidUser ? (
          <div className="relative flex-1 min-h-[400px]">
            {/* Blurred Preview */}
            <div className="absolute inset-0 blur-sm select-none pointer-events-none opacity-30">
              <div className="p-4">
                <div className="space-y-4">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>

            {/* Lock Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white/50 via-white/80 to-white/95 backdrop-blur-sm">
              <div className="text-center px-6 max-w-md">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#64748B] to-[#1E293B] flex items-center justify-center mb-4 mx-auto shadow-xl shadow-[#64748B]/30">
                  <span className="material-symbols-outlined text-3xl text-white">lock</span>
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                  {t.recruiterDM.locked}
                </h3>
                <p className="text-sm text-[#64748B] mb-4 leading-relaxed">
                  {t.recruiterDM.description}
                </p>

                {/* Benefits List */}
                <div className="bg-white/80 rounded-xl p-3 mb-4 text-left border border-[#E2E8F0] shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[#475569]">
                      <span className="text-[#22C55E]">✓</span>
                      <span>{t.recruiterDM.personalizedMessages}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#475569]">
                      <span className="text-[#22C55E]">✓</span>
                      <span>{t.recruiterDM.multipleVariations}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#475569]">
                      <span className="text-[#22C55E]">✓</span>
                      <span>{t.recruiterDM.keywordOptimized}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onUpgrade?.();
                    onOpenChange(false);
                  }}
                  className="w-full bg-gradient-to-r from-[#64748B] to-[#1E293B] hover:opacity-90 text-white font-bold py-2 px-4 rounded-xl transition-all shadow-lg shadow-[#64748B]/30 text-sm flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">workspace_premium</span>
                  {t.recruiterDM.unlockRecruiter}
                </button>
                <p className="text-xs text-[#94A3B8] mt-2">
                  {t.keywordAnalysis.sevenDayPlan}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
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
                className="w-full bg-[#64748B] hover:bg-[#0F172A] text-white font-bold"
              >
                {isGenerating ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Strategies...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Generate DMs</>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
