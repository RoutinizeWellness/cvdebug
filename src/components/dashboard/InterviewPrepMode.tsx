import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BrainCircuit, 
  Loader2, 
  Target, 
  MessageSquare, 
  AlertTriangle, 
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Sword
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const apiAny = api as any;

interface InterviewPrepModeProps {
  applicationId: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  resumeText: string;
  missingKeywords?: string[];
}

export function InterviewPrepMode({ 
  applicationId, 
  jobTitle, 
  company, 
  jobDescription, 
  resumeText,
  missingKeywords = []
}: InterviewPrepModeProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prepData, setPrepData] = useState<any>(null);
  const generatePrep = useAction(apiAny.ai.interviewPrep.generateInterviewPrep);

  const handleGenerate = async () => {
    // Validation
    if (!jobDescription || jobDescription.trim().length < 10) {
      toast.error("Please provide a valid job description to generate interview prep.");
      return;
    }

    if (!resumeText || resumeText.trim().length < 50) {
      toast.error("Resume text is too short. Please upload a valid resume first.");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generatePrep({
        resumeText,
        jobDescription,
        jobTitle,
        company,
        missingKeywords,
      });
      setPrepData(result);
      toast.success("Battle Plan Generated!");
    } catch (error: any) {
      console.error("[InterviewPrep Error]:", error);

      // Better error messages
      if (error.message?.includes("OPENROUTER_API_KEY")) {
        toast.error("API key not configured. Please contact support at cvdebug@outlook.com");
      } else if (error.message?.includes("Server Error")) {
        toast.error("Failed to generate prep. This feature requires an active subscription with AI credits.");
      } else {
        toast.error(error.message || "Failed to generate prep. Please try again or contact cvdebug@outlook.com");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = jobDescription && jobDescription.trim().length >= 10 &&
                      resumeText && resumeText.trim().length >= 50;

  if (!prepData) {
    return (
      <Card className="bg-[#0A0A0A] border-zinc-800">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex items-center justify-center mb-4 border border-teal-500/30">
            <BrainCircuit className="h-8 w-8 text-teal-400" />
          </div>
          <h3 className="text-xl font-bold text-[#0F172A] mb-2">Interview Battle Plan</h3>
          <p className="text-sm text-zinc-400 text-center max-w-md mb-6">
            Generate personalized interview prep with expected questions, STAR stories, and strategic talking points.
          </p>

          {!canGenerate && (
            <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg max-w-md">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-400">
                  {!jobDescription || jobDescription.trim().length < 10
                    ? "Missing job description. Please add one in the Overview tab first."
                    : "Resume text is missing or invalid. Please upload a valid resume."}
                </p>
              </div>
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !canGenerate}
            className="bg-teal-600 hover:bg-teal-700 text-[#0F172A] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Battle Plan...</>
            ) : (
              <><Sparkles className="mr-2 h-4 w-4" /> Generate Battle Plan</>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#0A0A0A] border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#0F172A]">
          <BrainCircuit className="h-5 w-5 text-teal-400" />
          Interview Battle Plan
          <Badge className="ml-auto bg-teal-500/10 text-teal-400 border-teal-500/30">
            {jobTitle} @ {company}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-zinc-900">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="stories">STAR Stories</TabsTrigger>
            <TabsTrigger value="weaknesses">Weaknesses</TabsTrigger>
            <TabsTrigger value="closing">Your Questions</TabsTrigger>
            <TabsTrigger value="interrogation" className="text-red-400 data-[state=active]:text-red-400 data-[state=active]:bg-[#EF4444]/10">
              <Sword className="h-3 w-3 mr-2" />
              Interrogation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="mt-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {prepData.questions && prepData.questions.length > 0 ? (
                  prepData.questions.map((q: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="bg-zinc-900/50 border-zinc-800">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0">
                            <HelpCircle className="h-4 w-4 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-[#0F172A] text-sm leading-relaxed">
                              {q.question}
                            </p>
                          </div>
                        </div>
                        <div className="pl-11 space-y-2">
                          <div className="flex items-start gap-2">
                            <Target className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-zinc-400 leading-relaxed">{q.tip}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-zinc-500">
                    <HelpCircle className="h-8 w-8 mb-2 opacity-20" />
                    <p>No questions generated.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="stories" className="mt-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {prepData.storyPrompts && prepData.storyPrompts.length > 0 ? (
                  prepData.storyPrompts.map((prompt: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="bg-zinc-900/50 border-zinc-800">
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="h-4 w-4 text-yellow-400" />
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed">{prompt}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-zinc-500">
                    <MessageSquare className="h-8 w-8 mb-2 opacity-20" />
                    <p>No story prompts generated.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="weaknesses" className="mt-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {prepData.weaknessFraming && prepData.weaknessFraming.length > 0 ? (
                  prepData.weaknessFraming.map((frame: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="bg-zinc-900/50 border-zinc-800">
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="h-4 w-4 text-orange-400" />
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed">{frame}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-zinc-500">
                    <AlertTriangle className="h-8 w-8 mb-2 opacity-20" />
                    <p>No weakness framing generated.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="closing" className="mt-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {prepData.closingQuestions && prepData.closingQuestions.length > 0 ? (
                  prepData.closingQuestions.map((question: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="bg-zinc-900/50 border-zinc-800">
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#22C55E]/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed">{question}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-zinc-500">
                    <CheckCircle2 className="h-8 w-8 mb-2 opacity-20" />
                    <p>No closing questions generated.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="interrogation" className="mt-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-[#EF4444]/10 border border-red-500/20 mb-4">
                  <h4 className="text-sm font-bold text-red-400 flex items-center gap-2 mb-1">
                    <Sword className="h-4 w-4" />
                    Pressure Test Mode
                  </h4>
                  <p className="text-xs text-red-300/80">
                    The AI has analyzed your missing keywords ({missingKeywords.length}) and identified potential weak spots. Be ready to answer these tough questions.
                  </p>
                </div>
                {prepData.interrogation && prepData.interrogation.length > 0 ? (
                  prepData.interrogation.map((item: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="bg-zinc-900/50 border-red-900/30">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#EF4444]/10 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-[#0F172A] text-sm leading-relaxed">
                              "{item.question}"
                            </p>
                          </div>
                        </div>
                        <div className="pl-11 space-y-2">
                          <div className="flex items-start gap-2">
                            <Target className="h-3 w-3 text-zinc-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-zinc-400 leading-relaxed italic">
                              Context: {item.context}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-zinc-500">
                    <Sword className="h-8 w-8 mb-2 opacity-20" />
                    <p>No interrogation questions generated.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-4 border-t border-zinc-800">
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            variant="outline"
            className="w-full border-zinc-800 text-zinc-400 hover:text-[#0F172A]"
          >
            {isGenerating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Regenerating...</>
            ) : (
              <><Sparkles className="mr-2 h-4 w-4" /> Regenerate Battle Plan</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}