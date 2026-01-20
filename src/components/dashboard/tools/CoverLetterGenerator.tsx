import { useState, useEffect } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Copy, Check, FileText, Download, Lock, AlertCircle, Diamond } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CoverLetterGeneratorProps {
  initialApplicationId?: string;
  onUpgrade?: () => void;
}

export function CoverLetterGenerator({ initialApplicationId, onUpgrade }: CoverLetterGeneratorProps) {
  const resumes = useQuery(api.resumes.getResumes) || [];
  const jobHistory = useQuery((api as any).jobTracker.getJobHistory);
  const currentUser = useQuery((api as any).users.currentUser);
  const generateCoverLetter = useAction(api.coverLetters.generate);

  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [copied, setCopied] = useState(false);

  // Check if user has Interview Sprint plan
  const hasInterviewSprint = currentUser?.subscriptionTier === "interview_sprint" &&
    (!currentUser?.sprintExpiresAt || currentUser.sprintExpiresAt > Date.now());

  useEffect(() => {
    if (initialApplicationId && jobHistory) {
      const job = jobHistory.find((j: any) => j._id === initialApplicationId);
      if (job) {
        setCompanyName(job.company || "");
        setJobTitle(job.jobTitle || "");
        setJobDescription(job.jobDescription || "");
      }
    }
  }, [initialApplicationId, jobHistory]);

  const handleGenerate = async () => {
    if (!hasInterviewSprint) {
      toast.error("Interview Sprint plan required", {
        description: "Upgrade to generate AI-powered cover letters"
      });
      onUpgrade?.();
      return;
    }

    if (!jobDescription) {
      toast.error("Please enter a job description");
      return;
    }

    setIsGenerating(true);
    try {
      const resumeId = (selectedResumeId === "none" || selectedResumeId === "") ? undefined : selectedResumeId;

      const result = await generateCoverLetter({
        resumeId: resumeId as any,
        jobDescription,
        companyName,
        jobTitle
      });

      setGeneratedLetter(result);
      toast.success("Cover letter generated successfully!");
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("PLAN_RESTRICTION")) {
        toast.error("Interview Sprint plan required", {
          description: "This feature is only available with an active Interview Sprint subscription"
        });
        onUpgrade?.();
      } else {
        toast.error("Failed to generate cover letter");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="space-y-6">
        {!hasInterviewSprint && (
          <Alert className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-primary/40 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 pointer-events-none" />

            <div className="relative">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0">
                  <Diamond className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#0F172A] font-bold text-base mb-1">Interview Sprint Required</h3>
                  <p className="text-[#475569] text-sm leading-relaxed">
                    Generate unlimited AI-powered cover letters that perfectly match each job description.
                  </p>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-[#475569]">
                  <span className="text-[#22C55E] font-bold">✓</span>
                  <span>Unlimited generations</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#475569]">
                  <span className="text-[#22C55E] font-bold">✓</span>
                  <span>Job-specific tailoring</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#475569]">
                  <span className="text-[#22C55E] font-bold">✓</span>
                  <span>ATS-optimized format</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#475569]">
                  <span className="text-[#22C55E] font-bold">✓</span>
                  <span>Resume integration</span>
                </div>
              </div>

              <Button
                onClick={onUpgrade}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#8B5CF6]/90 hover:to-[#6366F1]/90 w-full py-2.5 text-white font-bold border-0 flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>Upgrade to Interview Sprint</span>
              </Button>
            </div>
          </Alert>
        )}

        <Card className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
          <CardHeader>
            <CardTitle className="text-[#0F172A] flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generator Settings
              {!hasInterviewSprint && (
                <Lock className="h-4 w-4 text-[#64748B] ml-auto" />
              )}
            </CardTitle>
            <CardDescription className="text-[#64748B]">
              Configure the AI to write a tailored cover letter.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resume-select" className="text-[#475569]">Select Resume (Context)</Label>
              <Select
                value={selectedResumeId}
                onValueChange={setSelectedResumeId}
                disabled={!hasInterviewSprint}
              >
                <SelectTrigger id="resume-select" className="bg-[#FFFFFF] border border-[#E2E8F0]">
                  <SelectValue placeholder="Select a resume..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Generic Letter)</SelectItem>
                  {resumes.map((resume: any) => (
                    <SelectItem key={resume._id} value={resume._id}>
                      {resume.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-[#475569]">Company Name</Label>
                <Input
                  id="company"
                  placeholder="e.g. Acme Corp"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-[#FFFFFF] border border-[#E2E8F0]"
                  disabled={!hasInterviewSprint}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-[#475569]">Job Title</Label>
                <Input
                  id="role"
                  placeholder="e.g. Senior Developer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="bg-[#FFFFFF] border border-[#E2E8F0]"
                  disabled={!hasInterviewSprint}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jd" className="text-[#475569]">Job Description</Label>
              <Textarea
                id="jd"
                placeholder="Paste the job description here..."
                className="min-h-[200px] bg-[#FFFFFF] border border-[#E2E8F0] font-mono text-sm text-[#0F172A]"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={!hasInterviewSprint}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !jobDescription || !hasInterviewSprint}
              className="w-full font-bold"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Writing Letter...
                </>
              ) : !hasInterviewSprint ? (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Upgrade to Generate
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Cover Letter
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="h-full">
        <Card className="h-full flex flex-col bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-[#0F172A]">Generated Letter</CardTitle>
              <CardDescription className="text-[#64748B]">
                Review and edit your cover letter below.
              </CardDescription>
            </div>
            {generatedLetter && (
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={copyToClipboard} className="border-[#E2E8F0]">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" className="border-[#E2E8F0]">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1 p-4 pt-0 relative">
            {generatedLetter ? (
              <Textarea
                value={generatedLetter}
                onChange={(e) => setGeneratedLetter(e.target.value)}
                className="h-full min-h-[500px] resize-none bg-[#FFFFFF] border border-[#E2E8F0] font-serif text-base leading-relaxed p-6 text-[#0F172A]"
              />
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-[#E2E8F0] rounded-lg bg-[#F8FAFC] relative">
                {!hasInterviewSprint && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center rounded-lg">
                    <div className="text-center p-8">
                      <Lock className="h-12 w-12 text-[#8B5CF6] mx-auto mb-3" />
                      <p className="text-sm text-[#475569] font-medium">Upgrade to Interview Sprint to unlock</p>
                    </div>
                  </div>
                )}
                <FileText className="h-12 w-12 mb-4 text-[#E2E8F0]" />
                <p className="text-[#64748B]">Your cover letter will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
