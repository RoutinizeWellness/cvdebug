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
  CheckCircle2
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
}

export function InterviewPrepMode({ 
  applicationId, 
  jobTitle, 
  company, 
  jobDescription, 
  resumeText 
}: InterviewPrepModeProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prepData, setPrepData] = useState<any>(null);
  const generatePrep = useAction(apiAny.ai.interviewPrep.generateInterviewPrep);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generatePrep({
        resumeText,
        jobDescription,
        jobTitle,
        company,
      });
      setPrepData(result);
      toast.success("Battle Plan Generated!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to generate prep");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!prepData) {
    return (
      <Card className="bg-[#0A0A0A] border-zinc-800">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4 border border-purple-500/30">
            <BrainCircuit className="h-8 w-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Interview Battle Plan</h3>
          <p className="text-sm text-zinc-400 text-center max-w-md mb-6">
            Generate personalized interview prep with expected questions, STAR stories, and strategic talking points.
          </p>
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
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
        <CardTitle className="flex items-center gap-2 text-white">
          <BrainCircuit className="h-5 w-5 text-purple-400" />
          Interview Battle Plan
          <Badge className="ml-auto bg-purple-500/10 text-purple-400 border-purple-500/30">
            {jobTitle} @ {company}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-zinc-900">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="stories">STAR Stories</TabsTrigger>
            <TabsTrigger value="weaknesses">Weaknesses</TabsTrigger>
            <TabsTrigger value="closing">Your Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="mt-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {prepData.questions?.map((q: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="bg-zinc-900/50 border-zinc-800">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                            <HelpCircle className="h-4 w-4 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-white text-sm leading-relaxed">
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
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="stories" className="mt-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {prepData.storyPrompts?.map((prompt: string, i: number) => (
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
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="weaknesses" className="mt-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {prepData.weaknessFraming?.map((frame: string, i: number) => (
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
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="closing" className="mt-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {prepData.closingQuestions?.map((question: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="bg-zinc-900/50 border-zinc-800">
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed">{question}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-4 border-t border-zinc-800">
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            variant="outline"
            className="w-full border-zinc-800 text-zinc-400 hover:text-white"
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