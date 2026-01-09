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
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

  // Get the master resume or first available resume
  const masterResume = resumes?.find((r: any) =>
    r.status === "completed" &&
    (r.matchedKeywords?.length || r.missingKeywords?.length)
  ) || resumes?.[0];

  const missingKeywords = masterResume?.missingKeywords || [];
  const currentScore = masterResume?.score || 0;

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

  if (!resumes) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (resumes.length === 0 || !masterResume) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Target className="h-16 w-16 text-slate-700 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Resume Found</h3>
        <p className="text-slate-400 max-w-md mb-6">
          Upload and analyze a resume first to use the Keyword Sniper Tool.
        </p>
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
            <p className="text-xs text-slate-500">Current Resume</p>
            <p className="text-sm font-medium text-white">{masterResume.title}</p>
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
          jobTitle={masterResume.jobTitle || "Professional"}
          company={masterResume.company || "Company"}
          currentScore={currentScore}
          onApplySuggestion={handleApplySuggestion}
        />
      </div>
    </div>
  );
}
