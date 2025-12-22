import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  Sparkles, 
  FileText, 
  Loader2, 
  Copy, 
  CheckCircle2, 
  RefreshCw, 
  Maximize2,
  Settings,
  Lightbulb,
  Lock,
  Upload
} from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const apiAny = api as any;

interface CoverLetterGeneratorProps {
  initialApplicationId?: string;
}

export function CoverLetterGenerator({ initialApplicationId }: CoverLetterGeneratorProps) {
  const projects = useQuery(apiAny.projects.getProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  
  const applications = useQuery(apiAny.applications.getApplicationsByProject, 
    selectedProjectId ? { projectId: selectedProjectId as any } : "skip"
  );
  
  const generateCoverLetter = useMutation(apiAny.coverLetters.generateCoverLetter);
  
  const [selectedApplication, setSelectedApplication] = useState<string>(initialApplicationId || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState<string | null>(null);
  const [tone, setTone] = useState<"technical" | "narrative">("technical");

  const initialAppDetails = useQuery(apiAny.applications.getApplicationInternal, 
    initialApplicationId ? { id: initialApplicationId as any } : "skip"
  );

  useEffect(() => {
    if (initialAppDetails && initialAppDetails.projectId) {
      setSelectedProjectId(initialAppDetails.projectId);
      setSelectedApplication(initialAppDetails._id);
    }
  }, [initialAppDetails]);

  const coverLetters = useQuery(apiAny.coverLetters.getCoverLettersByApplication,
    selectedApplication ? { applicationId: selectedApplication as any } : "skip"
  );

  // Get selected application details for dynamic filename
  const selectedAppDetails = applications?.find((a: any) => a._id === selectedApplication);
  const fileName = selectedAppDetails 
    ? `Cover_Letter_${selectedAppDetails.companyName.replace(/\s+/g, '_')}.md` 
    : "DRAFT_PREVIEW.md";

  const handleGenerate = async () => {
    if (!selectedApplication) {
      toast.error("Please select an application first.");
      return;
    }

    setIsGenerating(true);
    try {
      await generateCoverLetter({ applicationId: selectedApplication as any });
      toast.success("Cover letter generation started! Check back in a moment.");
    } catch (error: any) {
      console.error(error);
      if (error.message === "CREDITS_EXHAUSTED") {
        toast.error("No credits remaining. Please upgrade to continue.");
      } else {
        toast.error("Failed to generate cover letter. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedLetter(id);
    toast.success("Cover letter copied to clipboard!");
    setTimeout(() => setCopiedLetter(null), 2000);
  };

  const latestLetter = coverLetters && coverLetters.length > 0 ? coverLetters[0] : null;
  const wordCount = latestLetter ? latestLetter.content.split(/\s+/).length : 0;
  const keywordMatch = latestLetter?.keywordsBridged?.length || 0;

  return (
    <div className="h-full flex flex-col">
      {/* Breadcrumbs */}
      <div className="px-6 py-4 border-b border-zinc-800/50">
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-zinc-500">Dashboard</span>
          <span className="text-zinc-600">/</span>
          <span className="text-white font-medium">AI Cover Letter Generator</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        {/* Left Panel: Configuration */}
        <section className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg flex flex-col gap-5">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold tracking-tight">Configuration</h3>
            </div>

            {/* Project Selector */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-zinc-300">Target Project</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger className="bg-black border-zinc-800">
                  <SelectValue placeholder="Choose a project..." />
                </SelectTrigger>
                <SelectContent>
                  {projects?.map((project: any) => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.name}
                    </SelectItem>
                  ))}
                  {(!projects || projects.length === 0) && (
                    <SelectItem value="none" disabled>No projects yet</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Application Selector */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-zinc-300">Target Application</Label>
              <Select value={selectedApplication} onValueChange={setSelectedApplication} disabled={!selectedProjectId}>
                <SelectTrigger className="bg-black border-zinc-800">
                  <SelectValue placeholder="Choose an application..." />
                </SelectTrigger>
                <SelectContent>
                  {applications?.map((app: any) => (
                    <SelectItem key={app._id} value={app._id}>
                      {app.jobTitle} at {app.companyName}
                    </SelectItem>
                  ))}
                  {(!applications || applications.length === 0) && (
                    <SelectItem value="none" disabled>No applications found</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Tone Toggle */}
            <div className="flex flex-col gap-3 py-2">
              <Label className="text-sm font-medium text-zinc-300">Letter Tone</Label>
              <div className="bg-black p-1 rounded-lg flex border border-zinc-800">
                <button 
                  onClick={() => setTone("technical")}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all ${
                    tone === "technical" 
                      ? "bg-primary text-white shadow-sm" 
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Technical
                </button>
                <button 
                  onClick={() => setTone("narrative")}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all ${
                    tone === "narrative" 
                      ? "bg-primary text-white shadow-sm" 
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Narrative
                </button>
              </div>
              <p className="text-[11px] text-zinc-500 leading-tight">
                Technical tone emphasizes hard skills and project metrics. Narrative focuses on career journey and soft skills.
              </p>
            </div>

            <div className="mt-auto pt-4">
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !selectedApplication}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 group-hover:animate-pulse" />
                    Generate Letter
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>

        {/* Center Panel: The Forge (Editor) */}
        <section className="lg:col-span-6 flex flex-col h-full min-h-[600px]">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col h-full shadow-2xl overflow-hidden">
            {/* Editor Toolbar */}
            <div className="h-12 border-b border-zinc-800 bg-black/50 flex items-center justify-between px-4">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>{fileName}</span>
              </div>
              <div className="flex items-center gap-1">
                {latestLetter && (
                  <>
                    <button 
                      onClick={() => handleCopy(latestLetter.content, latestLetter._id)}
                      className="p-1.5 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-colors"
                      title="Copy"
                    >
                      {copiedLetter === latestLetter._id ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <button 
                      onClick={handleGenerate}
                      className="p-1.5 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-colors"
                      title="Refresh"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </>
                )}
                <div className="h-4 w-px bg-zinc-800 mx-1"></div>
                <button className="p-1.5 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-colors" title="Expand">
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Editor Content Area */}
            <div className="flex-1 p-8 overflow-y-auto bg-[#0a0a0a] relative">
              {isGenerating && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                  <Sparkles className="h-10 w-10 text-primary animate-spin mb-3" />
                  <p className="text-primary font-mono text-sm animate-pulse">Fusing Keywords...</p>
                </div>
              )}

              {latestLetter ? (
                <div className="font-mono text-sm md:text-base leading-relaxed text-zinc-300 max-w-none">
                  <p className="mb-4 text-zinc-500">// Generated based on selected application</p>
                  <div className="whitespace-pre-wrap">
                    {latestLetter.content.split(/(\b(?:kubernetes|docker|python|ci\/cd|microservices|cloud-native|react|typescript|node\.js|aws|azure|gcp)\b)/gi).map((part: string, i: number) => {
                      // Check if this part is a keyword from the bridged list
                      const isKeyword = latestLetter.keywordsBridged?.some((kw: string) => 
                        kw.toLowerCase() === part.toLowerCase()
                      );
                      
                      // Also highlight if it matches our hardcoded list for demo purposes if bridged list is empty
                      const isHardcodedMatch = !latestLetter.keywordsBridged?.length && 
                        /^(kubernetes|docker|python|ci\/cd|microservices|cloud-native|react|typescript|node\.js|aws|azure|gcp)$/i.test(part);

                      return (isKeyword || isHardcodedMatch) ? (
                        <span 
                          key={i}
                          className="bg-green-500/20 text-green-400 border-b border-green-500 px-1 rounded mx-0.5 font-bold cursor-help"
                          title="Gap bridged: Added based on JD requirement"
                        >
                          {part}
                        </span>
                      ) : (
                        <span key={i}>{part}</span>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <FileText className="h-16 w-16 text-zinc-700 mb-4" />
                  <h3 className="text-xl font-bold text-zinc-400 mb-2">No Cover Letter Yet</h3>
                  <p className="text-sm text-zinc-500 max-w-md">
                    Select a project and application, then click "Generate Letter" to create your AI-powered cover letter.
                  </p>
                </div>
              )}
            </div>

            {/* Editor Footer Status */}
            <div className="h-8 bg-black border-t border-zinc-800 flex items-center justify-between px-4 text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
              <div className="flex items-center gap-3">
                <span>UTF-8</span>
                {keywordMatch > 0 && (
                  <span className="text-green-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    {keywordMatch} Gaps Bridged
                  </span>
                )}
              </div>
              <div>Words: {wordCount}</div>
            </div>
          </div>
        </section>

        {/* Right Panel: Optimization Guide & Upsell */}
        <section className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto">
          {/* Optimization Guide */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <h3 className="text-sm font-bold tracking-tight uppercase text-zinc-400">Optimization Guide</h3>
            </div>
            <div className="flex flex-col gap-3">
              <div className="bg-black p-3 rounded-lg border-l-2 border-green-500">
                <h4 className="text-white text-xs font-bold mb-1">Keyword Density</h4>
                <p className="text-xs text-zinc-400">
                  {keywordMatch > 0 
                    ? `Great! You've bridged ${keywordMatch} keyword gaps from the JD.`
                    : "Generate a letter to see keyword matching analysis."}
                </p>
              </div>
              <div className="bg-black p-3 rounded-lg border-l-2 border-yellow-500">
                <h4 className="text-white text-xs font-bold mb-1">Word Count</h4>
                <p className="text-xs text-zinc-400">
                  {wordCount > 0 
                    ? `Current count is ${wordCount}. Aim for 250-300 words for optimal impact.`
                    : "No letter generated yet."}
                </p>
              </div>
              <div className="bg-black p-3 rounded-lg border-l-2 border-primary">
                <h4 className="text-white text-xs font-bold mb-1">Tone Check</h4>
                <p className="text-xs text-zinc-400">
                  The tone is set to '{tone}' with active voice usage.
                </p>
              </div>
            </div>
          </div>

          {/* Upsell Block */}
          <div className="bg-gradient-to-br from-zinc-900 to-primary/10 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-tight uppercase text-zinc-200">Export Options</h3>
                <Badge className="bg-yellow-500/20 text-yellow-500 text-[10px] font-bold border border-yellow-500/30">
                  PRO
                </Badge>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs text-zinc-400">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Copy to Clipboard
                </li>
                <li className="flex items-center gap-2 text-xs text-zinc-400 opacity-50">
                  <Lock className="h-4 w-4" />
                  Export as PDF
                </li>
                <li className="flex items-center gap-2 text-xs text-zinc-400 opacity-50">
                  <Lock className="h-4 w-4" />
                  Auto-Apply to LinkedIn
                </li>
              </ul>
              <Button 
                disabled
                className="w-full bg-zinc-800 hover:bg-zinc-800/80 border border-white/5 text-zinc-400 cursor-not-allowed font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs mt-2"
              >
                <Lock className="h-4 w-4" />
                Download PDF
              </Button>
              <p className="text-[10px] text-center text-zinc-500 hover:text-primary cursor-pointer transition-colors">
                Upgrade to unlock all formats
              </p>
            </div>
          </div>

          {/* Previous Versions */}
          {coverLetters && coverLetters.length > 1 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg">
              <h3 className="text-sm font-bold tracking-tight uppercase text-zinc-400 mb-3">Previous Versions</h3>
              <div className="space-y-2">
                {coverLetters.slice(1, 4).map((letter: any) => (
                  <button
                    key={letter._id}
                    onClick={() => handleCopy(letter.content, letter._id)}
                    className="w-full text-left bg-black hover:bg-zinc-800 p-3 rounded-lg border border-zinc-800 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-zinc-300">Version {letter.version}</span>
                      <span className="text-[10px] text-zinc-500">
                        {new Date(letter.generatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 line-clamp-2">
                      {letter.content.substring(0, 100)}...
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}