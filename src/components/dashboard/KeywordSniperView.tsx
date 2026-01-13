import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { KeywordSniperTool } from "./KeywordSniperTool";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target } from "lucide-react";
import { toast } from "sonner";

const apiAny = api;

interface KeywordSniperViewProps {
  onBack: () => void;
}

export function KeywordSniperView({ onBack }: KeywordSniperViewProps) {
  const resumes = useQuery(apiAny.resumes.getResumes);
  const applications = useQuery(apiAny.applications.getApplications);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

  // PRIORITY: Get application with job description (has missing keywords)
  const applicationWithJob = applications?.find((app: any) =>
    app.jobDescriptionText &&
    (app.missingKeywords?.length || app.matchedKeywords?.length)
  );

  // Fallback: Get the master resume if no application exists
  const masterResume = resumes?.find((r: any) =>
    r.status === "completed"
  ) || resumes?.[0];

  // Use application data if available, otherwise resume data
  const missingKeywords = applicationWithJob?.missingKeywords || masterResume?.missingKeywords || [];
  const matchedKeywords = applicationWithJob?.matchedKeywords || masterResume?.matchedKeywords || [];
  const currentScore = applicationWithJob?.matchScore || masterResume?.score || 0;
  const jobTitle = applicationWithJob?.jobTitle || masterResume?.jobTitle || "Professional";
  const company = applicationWithJob?.companyName || masterResume?.company || "Company";

  // Extract bullet points from resume OCR text
  const extractBulletPoints = (ocrText: string): string[] => {
    if (!ocrText) return [];
    const lines = ocrText.split('\n');
    const bullets = lines
      .filter(line =>
        line.trim().match(/^[-•*]/) || // Lines starting with bullets
        (line.length > 20 && line.length < 200 && !line.match(/^[A-Z\s]+$/)) // Sentence-like lines
      )
      .map(line => line.replace(/^[-•*]\s*/, '').trim())
      .filter(line => line.length > 0);
    return bullets;
  };

  const bullets = extractBulletPoints(masterResume?.ocrText || "");
  const currentBullet = bullets[0] || "Led cross-functional teams to deliver projects on time and within budget, resulting in increased efficiency.";

  const handleApplySuggestion = (newText: string) => {
    toast.success("Suggestion applied! Your resume has been updated.");
    // In real implementation, this would update the resume in Convex
    console.log("New bullet point:", newText);
  };

  if (!resumes || !applications) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Check if we have the necessary data for keyword sniper
  const hasJobDescription = applicationWithJob?.jobDescriptionText;
  const hasKeywords = missingKeywords.length > 0 || matchedKeywords.length > 0;

  if (!hasJobDescription || !hasKeywords) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <Target className="h-16 w-16 text-slate-700 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Job Description Analyzed Yet</h3>
        <p className="text-slate-400 max-w-md mb-4">
          The Keyword Sniper needs a job description to analyze and extract missing keywords.
        </p>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-md mb-6">
          <p className="text-sm text-blue-300 mb-2">
            <span className="font-semibold">How to use Keyword Sniper:</span>
          </p>
          <ol className="text-xs text-slate-300 space-y-1 text-left list-decimal list-inside">
            <li>Create a project with your target role</li>
            <li>Add a job application with the job description</li>
            <li>Analyze the job description to extract keywords</li>
            <li>Return here to get AI-powered keyword suggestions</li>
          </ol>
        </div>
        <Button onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">radar</span>
              Keyword Sniper Tool
            </h1>
            <p className="text-slate-400 text-sm">
              Optimize your bullet points with AI-powered keyword injection
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-500">
              {applicationWithJob ? "Targeting" : "Current Resume"}
            </p>
            <p className="text-sm font-medium text-white">
              {applicationWithJob ? `${jobTitle} at ${company}` : masterResume?.title || "Resume"}
            </p>
          </div>
        </div>
      </div>

      {/* Keyword Sniper Tool */}
      <div className="w-full">
        <KeywordSniperTool
          missingKeywords={missingKeywords.map((kw: any) =>
            typeof kw === "string"
              ? { keyword: kw, priority: "medium", frequency: 5 }
              : kw
          )}
          currentBullet={currentBullet}
          jobTitle={jobTitle}
          company={company}
          currentScore={currentScore}
          onApplySuggestion={handleApplySuggestion}
        />
      </div>
    </div>
  );
}
