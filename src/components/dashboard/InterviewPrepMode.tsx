import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Target, MessageSquare, Lightbulb, CheckCircle2 } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface InterviewPrepModeProps {
  resumeText: string;
  jobDescription?: string;
  jobTitle?: string;
  company?: string;
}

export function InterviewPrepMode({
  resumeText,
  jobDescription,
  jobTitle,
  company
}: InterviewPrepModeProps) {
  const [activeTab, setActiveTab] = useState("questions");
  const [isGenerating, setIsGenerating] = useState(false);
  const [prepGuide, setPrepGuide] = useState<{
    questions: Array<{ question: string; tip: string }>;
    storyPrompts: string[];
    weaknessFraming: string[];
    closingQuestions: string[];
  } | null>(null);

  const generateInterviewPrep = useAction(api.ai.generateInterviewPrep);

  const handleGenerate = async () => {
    if (!jobDescription || !jobTitle) {
      toast.error("Please provide job description and title");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateInterviewPrep({
        resumeText,
        jobDescription,
        jobTitle,
        company: company || "the company"
      });
      setPrepGuide(result);
      toast.success("Interview prep guide generated!");
    } catch (error) {
      toast.error("Failed to generate prep guide");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/20 border-blue-500/20">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Interview Prep Mode</h3>
              <p className="text-xs text-slate-400">AI-powered interview preparation</p>
            </div>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !jobDescription}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            <Brain className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating..." : "Generate Prep Guide"}
          </Button>
        </div>

        {!prepGuide && !isGenerating && (
          <div className="p-8 text-center border-2 border-dashed border-slate-700 rounded-lg">
            <Brain className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 mb-2">No prep guide generated yet</p>
            <p className="text-xs text-slate-500">
              Add a job description to generate personalized interview questions
            </p>
          </div>
        )}

        {isGenerating && (
          <div className="p-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="size-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"
            />
            <p className="text-slate-400">Analyzing your resume and generating questions...</p>
          </div>
        )}

        {prepGuide && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="stories">STAR Stories</TabsTrigger>
              <TabsTrigger value="weaknesses">Weaknesses</TabsTrigger>
              <TabsTrigger value="closing">Closing</TabsTrigger>
            </TabsList>

            <TabsContent value="questions" className="space-y-3 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4 text-blue-400" />
                <h4 className="text-sm font-bold text-white">Expected Questions</h4>
                <Badge variant="outline" className="ml-auto">
                  {prepGuide.questions.length} questions
                </Badge>
              </div>
              {prepGuide.questions.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="size-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-400">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white mb-2">{item.question}</p>
                      <div className="flex items-start gap-2 p-2 rounded bg-blue-500/10 border border-blue-500/20">
                        <Lightbulb className="h-3 w-3 text-blue-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-blue-300">{item.tip}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="stories" className="space-y-3 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">STAR Story Prompts</h4>
              </div>
              {prepGuide.storyPrompts.map((prompt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-800/50 border border-slate-700"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-300">{prompt}</p>
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="weaknesses" className="space-y-3 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-purple-400" />
                <h4 className="text-sm font-bold text-white">Weakness Framing</h4>
              </div>
              {prepGuide.weaknessFraming.map((frame, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-800/50 border border-slate-700"
                >
                  <p className="text-sm text-slate-300">{frame}</p>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="closing" className="space-y-3 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Questions to Ask</h4>
              </div>
              {prepGuide.closingQuestions.map((question, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-800/50 border border-slate-700"
                >
                  <div className="flex items-start gap-3">
                    <div className="size-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-emerald-400">{index + 1}</span>
                    </div>
                    <p className="text-sm text-slate-300">{question}</p>
                  </div>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Card>
  );
}
