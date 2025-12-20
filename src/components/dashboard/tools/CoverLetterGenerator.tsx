import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Mail, Sparkles, FileText, Loader2, Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Cast to any to avoid deep type instantiation errors
const apiAny = api as any;

export function CoverLetterGenerator() {
  const projects = useQuery(apiAny.projects.getProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  
  const applications = useQuery(apiAny.applications.getApplicationsByProject, 
    selectedProjectId ? { projectId: selectedProjectId as any } : "skip"
  );
  
  const generateCoverLetter = useMutation(apiAny.coverLetters.generateCoverLetter);
  
  const [selectedApplication, setSelectedApplication] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState<string | null>(null);

  const coverLetters = useQuery(apiAny.coverLetters.getCoverLettersByApplication,
    selectedApplication ? { applicationId: selectedApplication as any } : "skip"
  );

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

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black tracking-tight flex items-center gap-3 text-foreground">
          <Mail className="h-8 w-8 text-primary" /> AI Cover Letter Generator
        </h2>
        <p className="text-lg text-muted-foreground">
          Generate tailored cover letters that bridge your keyword gaps for each application.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Generate Cover Letter</CardTitle>
          <CardDescription>Select a project and application to generate a personalized cover letter.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Select Project</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger>
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
            <div className="space-y-2">
              <Label>Select Application</Label>
              <Select value={selectedApplication} onValueChange={setSelectedApplication} disabled={!selectedProjectId}>
                <SelectTrigger>
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
          </div>

          {!projects || projects.length === 0 ? (
            <div className="bg-muted/50 border border-border rounded-lg p-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Create a project and add applications first to generate cover letters.
              </p>
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="justify-between bg-muted/30 p-6 border-t border-border">
          <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
            <Sparkles className="h-3 w-3" /> Uses AI to bridge your keyword gaps
          </p>
          <Button 
            size="lg" 
            className="font-bold shadow-lg shadow-primary/20 relative overflow-hidden group"
            onClick={handleGenerate}
            disabled={isGenerating || !selectedApplication}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            {isGenerating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="mr-2 h-4 w-4" /> Generate Letter</>
            )}
          </Button>
        </CardFooter>
      </Card>

      {coverLetters && coverLetters.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold">Generated Cover Letters</h3>
          {coverLetters.map((letter: any) => (
            <Card key={letter._id} className="border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Version {letter.version}</CardTitle>
                    <CardDescription className="text-xs">
                      Generated {new Date(letter.generatedAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(letter.content, letter._id)}
                      className="gap-2"
                    >
                      {copiedLetter === letter._id ? (
                        <><CheckCircle2 className="h-4 w-4 text-green-500" /> Copied!</>
                      ) : (
                        <><Copy className="h-4 w-4" /> Copy</>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {letter.content}
                  </p>
                </div>
                {letter.keywordsBridged && letter.keywordsBridged.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-bold text-muted-foreground mb-2">Keywords Bridged:</p>
                    <div className="flex flex-wrap gap-2">
                      {letter.keywordsBridged.map((kw: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
