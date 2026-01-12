import { MessageSquare, Copy, Sparkles, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";

interface DMGeneratorProps {
  profileText: string;
  jobDescription: string;
  missingKeywords?: string[];
}

export function DMGenerator({ profileText, jobDescription, missingKeywords }: DMGeneratorProps) {
  const generateDMs = useAction((api as any).ai.linkedinOptimizer.generateRecruiterDMs);
  const previousDMs = useQuery((api as any).linkedinProfile.getRecruiterDMs);
  
  const [recruiterType, setRecruiterType] = useState("Internal HR");
  const [recruiterName, setRecruiterName] = useState("");
  const [tone, setTone] = useState("Professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDMs, setGeneratedDMs] = useState<any[]>([]);
  const [selectedVariation, setSelectedVariation] = useState(0);

  // Load previous DMs if available and no current DMs
  useEffect(() => {
    if (previousDMs && previousDMs.length > 0 && generatedDMs.length === 0 && !isGenerating) {
      setGeneratedDMs(previousDMs[0].variations);
    }
  }, [previousDMs, generatedDMs.length, isGenerating]);

  const handleGenerate = async () => {
    if (!profileText) {
      toast.error("Profile text is missing. Please analyze your profile first.");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateDMs({
        profileText,
        jobDescription: jobDescription || "General Role",
        recruiterName: recruiterName || "Hiring Manager",
        missingKeywords: missingKeywords || [],
      });

      if (result?.variations) {
        setGeneratedDMs(result.variations);
        toast.success("DMs generated successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate DMs. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentDM = generatedDMs[selectedVariation]?.content || "Hi [Name], I saw you're hiring for [Role] and wanted to connect. My background in React and Node seems like a great fit for your tech stack.";

  const handleCopy = () => {
    navigator.clipboard.writeText(currentDM);
    toast.success("DM copied to clipboard!");
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-xl p-6 flex flex-col shadow-lg shadow-black/20">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h3 className="text-white font-semibold text-lg flex items-center gap-2 mb-1">
            <MessageSquare className="h-5 w-5 text-cyan-400" />
            DM Generator
          </h3>
          <p className="text-slate-400 text-sm">Draft ice-breakers for recruiters</p>
        </div>
        {generatedDMs.length > 0 && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="h-8 w-8 text-slate-400 hover:text-white"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>

      <div className="space-y-4 flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
             <label className="block text-xs text-slate-400 mb-1">Recruiter Name (Optional)</label>
             <Input 
               value={recruiterName}
               onChange={(e) => setRecruiterName(e.target.value)}
               placeholder="e.g. Sarah Smith"
               className="h-9 bg-slate-950 border-slate-700 text-white text-sm"
             />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Recruiter Type</label>
            <div className="relative">
              <select 
                value={recruiterType}
                onChange={(e) => setRecruiterType(e.target.value)}
                className="w-full appearance-none bg-slate-950 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option>Internal HR</option>
                <option>Agency Recruiter</option>
                <option>Hiring Manager</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-2.5 text-slate-400 pointer-events-none text-sm">
                expand_more
              </span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Tone</label>
            <div className="relative">
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full appearance-none bg-slate-950 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option>Professional</option>
                <option>Casual</option>
                <option>Direct</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-2.5 text-slate-400 pointer-events-none text-sm">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {generatedDMs.length > 0 && (
          <div className="flex gap-2 mb-2">
            {generatedDMs.map((dm, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedVariation(idx)}
                className={`text-xs px-2 py-1 rounded border transition-colors ${
                  selectedVariation === idx 
                    ? "bg-primary/20 border-primary text-primary" 
                    : "bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-300"
                }`}
              >
                Option {idx + 1}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 bg-slate-950/50 border border-slate-800 rounded-lg p-4 relative flex flex-col min-h-[120px]">
          {isGenerating ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-lg z-10">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          ) : null}
          
          <div className="flex gap-3 mb-2">
            <div className="size-8 rounded-full bg-slate-700 flex-shrink-0 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-300">
              You
            </div>
            <div className="bg-primary/10 text-blue-100 p-3 rounded-2xl rounded-tl-none text-sm font-mono leading-relaxed border border-primary/20 w-full">
              {currentDM}
            </div>
          </div>
        </div>

        {generatedDMs.length === 0 ? (
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border border-cyan-500/20 text-white font-medium shadow-lg shadow-cyan-900/20"
          >
            {isGenerating ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-2" /> Generate Drafts</>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleCopy}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-medium"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy to Clipboard
          </Button>
        )}
      </div>
    </div>
  );
}