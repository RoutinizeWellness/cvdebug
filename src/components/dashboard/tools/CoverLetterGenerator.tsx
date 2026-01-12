import { useState, useEffect } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Copy, Check, FileText, Download, Lock, AlertCircle } from "lucide-react";
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
          <Alert className="bg-gradient-to-r from-primary/10 to-teal-500/10 border-primary/30">
            <Lock className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              <strong className="text-white">Interview Sprint Required</strong>
              <p className="text-slate-300 mt-1">
                Upgrade to Interview Sprint to generate unlimited AI-powered cover letters tailored to each job.
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

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generator Settings
              {!hasInterviewSprint && (
                <Lock className="h-4 w-4 text-slate-500 ml-auto" />
              )}
            </CardTitle>
            <CardDescription>
              Configure the AI to write a tailored cover letter.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resume-select">Select Resume (Context)</Label>
              <Select 
                value={selectedResumeId} 
                onValueChange={setSelectedResumeId}
                disabled={!hasInterviewSprint}
              >
                <SelectTrigger id="resume-select" className="bg-slate-950 border-slate-800">
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
                <Label htmlFor="company">Company Name</Label>
                <Input 
                  id="company" 
                  placeholder="e.g. Acme Corp" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-slate-950 border-slate-800"
                  disabled={!hasInterviewSprint}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Job Title</Label>
                <Input 
                  id="role" 
                  placeholder="e.g. Senior Developer" 
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="bg-slate-950 border-slate-800"
                  disabled={!hasInterviewSprint}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jd">Job Description</Label>
              <Textarea 
                id="jd" 
                placeholder="Paste the job description here..." 
                className="min-h-[200px] bg-slate-950 border-slate-800 font-mono text-sm"
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
        <Card className="h-full flex flex-col bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-white">Generated Letter</CardTitle>
              <CardDescription>
                Review and edit your cover letter below.
              </CardDescription>
            </div>
            {generatedLetter && (
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1 p-4 pt-0">
            {generatedLetter ? (
              <Textarea 
                value={generatedLetter}
                onChange={(e) => setGeneratedLetter(e.target.value)}
                className="h-full min-h-[500px] resize-none bg-slate-950 border-slate-800 font-serif text-base leading-relaxed p-6"
              />
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-lg bg-slate-950/50">
                <FileText className="h-12 w-12 mb-4 opacity-20" />
                <p>Your cover letter will appear here</p>
                {!hasInterviewSprint && (
                  <p className="text-xs text-slate-600 mt-2">Upgrade to Interview Sprint to unlock</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}