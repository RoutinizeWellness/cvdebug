import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useI18n } from "@/contexts/I18nContext";

// Cast to any to avoid type instantiation issues
const apiAny = api as any;

interface Question {
  id: string;
  type: "Technical" | "Behavioral" | "System Design";
  question: string;
  relevance?: "High Relevance" | "Medium" | "Low";
  color: string;
}

interface STARStory {
  situation: string;
  task: string;
  action: string;
  result: string;
}

interface SignalItem {
  checked: boolean;
  title: string;
  description: string;
}

interface StrengthItem {
  icon: string;
  label: string;
  title: string;
  description: string;
  color: string;
}

interface InterviewBattlePlanProps {
  targetRole?: string;
  companyName?: string;
  resumeText?: string;
  isPaidUser?: boolean;
  onUpgrade?: () => void;
}

export function InterviewBattlePlan({
  targetRole = "Lead Data Scientist",
  companyName = "TechCorp",
  resumeText = "",
  isPaidUser = false,
  onUpgrade
}: InterviewBattlePlanProps) {
  const { t } = useI18n();
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [isRegeneratingQuestions, setIsRegeneratingQuestions] = useState(false);
  const [isEnhancingAction, setIsEnhancingAction] = useState(false);
  const [starStory, setStarStory] = useState<STARStory>({
    situation: "The legacy customer support chatbot was failing to understand 40% of user queries, leading to high transfer rates to human agents.",
    task: "My objective was to reduce the fallback rate by implementing a more robust NLP model capable of handling context and intent recognition.",
    action: "I spearheaded the migration from a rule-based system to a Transformer-based architecture using BERT. I fine-tuned the model on 50k internal chat logs. To optimize for latency, I used model distillation techniques and implemented caching for common queries.",
    result: "Decreased fallback rate to 12% and improved customer satisfaction scores by 15 points within the first quarter."
  });

  const [signals, setSignals] = useState<SignalItem[]>([
    { checked: true, title: "Metric Impact", description: "Mention the 15% CSAT increase explicitly." },
    { checked: false, title: "Tech Stack", description: "Name drop BERT and Distillation." },
    { checked: false, title: "Ownership", description: 'Use "I drove" or "I initiated".' }
  ]);

  // ML-generated questions state
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "q1",
      type: "Technical",
      question: "Can you explain how you optimized the NLP pipeline using Transformers mentioned in your resume?",
      relevance: "High Relevance",
      color: "violet"
    },
    {
      id: "q2",
      type: "Behavioral",
      question: "Describe a time you had to explain complex model outputs to non-technical stakeholders.",
      color: "primary"
    },
    {
      id: "q3",
      type: "Technical",
      question: "Why did you choose PyTorch over TensorFlow for the image recognition project?",
      color: "violet"
    },
    {
      id: "q4",
      type: "System Design",
      question: "How would you architect a real-time recommendation system for high-volume traffic?",
      color: "amber"
    }
  ]);
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);

  const generateInterviewQuestions = useAction(apiAny.ml.interviewQuestions.generateInterviewQuestions);

  // Generate initial questions on mount if we have resume text
  useEffect(() => {
    if (resumeText && resumeText.length > 50) {
      handleRegenerateQuestions(true); // true = initial load
    }
  }, []); // Only run once on mount

  const strengths: StrengthItem[] = [
    {
      icon: "rocket_launch",
      label: "Strength #1",
      title: "End-to-End ML Deployment",
      description: 'You don\'t just build models; you ship them to production. This aligns with their "Full Cycle" value.',
      color: "blue"
    },
    {
      icon: "groups",
      label: "Strength #2",
      title: "Cross-Functional Leadership",
      description: "Highlight your experience mentoring junior engineers as noted in your resume.",
      color: "violet"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { border: string; text: string; bg: string }> = {
      violet: {
        border: "border-l-violet-500",
        text: "text-violet-600",
        bg: "bg-violet-50 border-violet-100"
      },
      primary: {
        border: "border-l-blue-500",
        text: "text-[#3B82F6]",
        bg: "bg-blue-50 border-blue-100"
      },
      amber: {
        border: "border-l-amber-500",
        text: "text-[#F59E0B]",
        bg: "bg-amber-50 border-amber-100"
      },
      blue: {
        border: "border-l-blue-500",
        text: "text-blue-700",
        bg: "bg-blue-50 border-blue-100"
      }
    };
    return colorMap[color] || colorMap.primary;
  };

  const toggleSignal = (index: number) => {
    setSignals(prev => prev.map((s, i) => i === index ? { ...s, checked: !s.checked } : s));
    toast.success(`Signal "${signals[index].title}" ${!signals[index].checked ? 'added' : 'removed'}`);
  };

  const handleRegenerateQuestions = async (isInitial = false) => {
    if (!resumeText || resumeText.length < 50) {
      if (!isInitial) {
        toast.error("Not enough resume text to generate questions");
      }
      return;
    }

    setIsRegeneratingQuestions(true);
    if (!isInitial) {
      toast.loading("Regenerating questions with ML algorithms...", { id: "regen-questions" });
    }

    try {
      const newQuestions = await generateInterviewQuestions({
        resumeText,
        targetRole,
        companyName,
        previousQuestions,
        count: 6,
      });

      if (newQuestions && newQuestions.length > 0) {
        // Map ML questions to component format, filtering out any undefined/null entries
        const formattedQuestions: Question[] = newQuestions
          .filter((q: any) => q && q.type && q.question)
          .map((q: any) => ({
            id: q.id,
            type: q.type,
            question: q.question,
            relevance: q.relevance,
            color: q.color,
          }));

        setQuestions(formattedQuestions);

        // Track these questions as "previous" to avoid repeats next time
        const newQuestionTexts = formattedQuestions.map((q) => q.question);
        setPreviousQuestions((prev) => [...prev, ...newQuestionTexts]);

        if (!isInitial) {
          toast.success("Questions regenerated with ML! Fresh questions based on your resume.", { id: "regen-questions" });
        }
      } else {
        throw new Error("No questions generated");
      }
    } catch (error) {
      console.error("Failed to generate interview questions:", error);
      if (!isInitial) {
        toast.error("Failed to generate questions. Using fallback questions.", { id: "regen-questions" });
      }
    } finally {
      setIsRegeneratingQuestions(false);
    }
  };

  const handleEnhanceAction = async () => {
    setIsEnhancingAction(true);
    toast.loading("Enhancing your answer with AI...", { duration: 2000 });

    setTimeout(() => {
      const enhanced = starStory.action + " Additionally, I implemented comprehensive monitoring dashboards using Grafana to track model performance in real-time, ensuring proactive issue detection.";
      setStarStory({ ...starStory, action: enhanced });
      setIsEnhancingAction(false);
      toast.success("Answer enhanced with AI suggestions!");
    }, 2000);
  };

  const handleChangeQuestion = () => {
    const nextQuestion = (selectedQuestion + 1) % questions.length;
    setSelectedQuestion(nextQuestion);
    toast.success(`Switched to: ${questions[nextQuestion].type} question`);
  };

  if (!isPaidUser) {
    return (
      <div className="relative w-full min-h-[600px]">
        {/* Blurred Preview */}
        <div className="absolute inset-0 blur-sm select-none pointer-events-none opacity-30">
          <div className="w-full">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                Interview Battle Plan
              </h2>
              <p className="text-[#64748B] mt-2">AI-generated strategy</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4">
                <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="lg:col-span-8">
                <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lock Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white/50 via-white/80 to-white/95 backdrop-blur-sm">
          <div className="text-center px-6 max-w-lg">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center mb-6 mx-auto shadow-2xl shadow-[#3B82F6]/30">
              <span className="material-symbols-outlined text-4xl text-white">lock</span>
            </div>
            <h3 className="text-2xl font-bold text-[#0F172A] mb-3">
              {t.interviewPrep.locked}
            </h3>
            <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
              {t.interviewPrep.description}
            </p>

            {/* Benefits List */}
            <div className="bg-white/80 rounded-xl p-4 mb-6 text-left border border-[#E2E8F0] shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#475569]">
                  <span className="text-[#22C55E]">✓</span>
                  <span>{t.interviewPrep.expectedQuestions}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#475569]">
                  <span className="text-[#22C55E]">✓</span>
                  <span>{t.interviewPrep.starStories}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#475569]">
                  <span className="text-[#22C55E]">✓</span>
                  <span>{t.interviewPrep.talkingPoints}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-xl shadow-[#3B82F6]/30 hover:shadow-2xl hover:shadow-[#3B82F6]/40 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">workspace_premium</span>
              {t.interviewPrep.unlockInterview}
            </button>
            <p className="text-xs text-[#94A3B8] mt-3">
              {t.keywordAnalysis.sevenDayPlan}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Interview Battle Plan
          </h2>
          <p className="text-[#64748B] mt-2 flex items-center gap-2 flex-wrap text-sm md:text-base">
            <span className="material-symbols-outlined text-sm">psychology</span>
            AI-generated strategy for{" "}
            <span className="text-[#3B82F6] font-mono text-xs md:text-sm bg-blue-50 px-2 py-0.5 rounded">
              {targetRole} @ {companyName}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded border border-green-200 text-xs md:text-sm">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span className="font-medium">Ready for Interview</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Left Column - Expected Questions */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#FFFFFF] backdrop-blur-sm rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]/50 flex justify-between items-center">
              <h3 className="font-semibold text-[#0F172A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3B82F6]">quiz</span>
                Expected Questions
              </h3>
              <span className="text-xs bg-slate-200 text-[#475569] px-2 py-0.5 rounded-full">
                {questions.length} Generated
              </span>
            </div>

            {/* Questions List */}
            <div className="p-3 md:p-4 flex-1 overflow-y-auto space-y-2 md:space-y-3 max-h-[400px] md:max-h-[600px]">
              {questions.map((q, index) => {
                const colors = getColorClasses(q.color);
                return (
                  <div
                    key={q.id}
                    onClick={() => {
                      setSelectedQuestion(index);
                      toast.success(`Selected: ${q.type} question`);
                    }}
                    className={`group p-3 rounded-lg border border-l-4 hover:border-[#3B82F6] ${colors.border} bg-[#FFFFFF] transition-all cursor-pointer ${
                      selectedQuestion === index ? 'ring-2 ring-blue-500/20 bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-xs font-mono ${colors.text} uppercase tracking-wider`}>
                        {q.type}
                      </span>
                      <span className="material-symbols-outlined text-[#64748B] text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        chevron_right
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[#0F172A] leading-snug">
                      {q.question}
                    </p>
                    {q.relevance && (
                      <div className="mt-2 text-xs text-[#64748B]">
                        Match: <span className="text-[#22C55E]">{q.relevance}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
              <button
                onClick={() => handleRegenerateQuestions(false)}
                disabled={isRegeneratingQuestions}
                className="w-full py-2 text-sm font-medium text-[#3B82F6] hover:bg-blue-50 rounded border border-transparent hover:border-blue-200 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-lg ${isRegeneratingQuestions ? 'animate-spin' : ''}`}>
                  autorenew
                </span>
                {isRegeneratingQuestions ? 'Regenerating...' : 'Regenerate Questions'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Middle Column - STAR Story Forge */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#FFFFFF] backdrop-blur-sm rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col h-full relative overflow-hidden"
          >
            {/* Top gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500"></div>

            {/* Header */}
            <div className="p-4 md:p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#0F172A] text-base md:text-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-violet-500 text-lg md:text-xl">auto_awesome</span>
                  STAR Story Forge
                </h3>
                <p className="text-xs text-[#64748B] mt-1 truncate">
                  Refining: "{questions[selectedQuestion]?.question.substring(0, 40)}..."
                </p>
              </div>
              <button
                onClick={handleChangeQuestion}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-[#475569] px-3 py-1.5 rounded border border-[#E2E8F0] transition-colors whitespace-nowrap"
              >
                Change Question
              </button>
            </div>

            {/* STAR Content */}
            <div className="p-4 md:p-5 flex-1 flex flex-col gap-3 md:gap-4 overflow-y-auto">
              {/* Situation */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-[#64748B] uppercase">
                  S - Situation
                </label>
                <div className="p-3 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#475569]">
                  {starStory.situation}
                </div>
              </div>

              {/* Task */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-[#64748B] uppercase">
                  T - Task
                </label>
                <div className="p-3 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#475569]">
                  {starStory.task}
                </div>
              </div>

              {/* Action (Editable) */}
              <div className="space-y-1 relative">
                <div className="flex justify-between items-end mb-1">
                  <label className="text-xs font-mono font-semibold text-[#3B82F6] uppercase">
                    A - Action (Editable)
                  </label>
                  <span className="text-[10px] text-[#3B82F6] animate-pulse">
                    AI Enhancement Available
                  </span>
                </div>
                <textarea
                  value={starStory.action}
                  onChange={(e) => setStarStory({ ...starStory, action: e.target.value })}
                  className="w-full h-32 p-3 rounded bg-[#FFFFFF] border border-[#3B82F6] ring-1 ring-blue-500/20 text-sm text-[#0F172A] focus:outline-none focus:ring-2 resize-none font-sans leading-relaxed"
                  placeholder="Describe the actions you took..."
                />
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button
                    onClick={handleEnhanceAction}
                    disabled={isEnhancingAction}
                    className="p-1 rounded bg-blue-100 text-[#3B82F6] hover:bg-blue-200 transition-colors disabled:opacity-50"
                    title="Enhance with AI"
                  >
                    <span className={`material-symbols-outlined text-sm ${isEnhancingAction ? 'animate-pulse' : ''}`}>
                      magic_button
                    </span>
                  </button>
                </div>
              </div>

              {/* Result */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-[#64748B] uppercase">
                  R - Result
                </label>
                <div className="p-3 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#475569]">
                  {starStory.result}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Signals & Strategy */}
        <div className="lg:col-span-3 flex flex-col gap-4 md:gap-6">
          {/* Hit These Signals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#FFFFFF] backdrop-blur-sm rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
          >
            <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]/50">
              <h3 className="font-semibold text-[#0F172A] flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-[#F59E0B] text-lg">target</span>
                Hit These Signals
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {signals.map((signal, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    onClick={() => toggleSignal(index)}
                    className="mt-0.5 w-4 h-4 rounded border border-[#E2E8F0] bg-[#FFFFFF] flex items-center justify-center shrink-0 cursor-pointer hover:border-[#3B82F6] transition-colors"
                  >
                    {signal.checked && <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#475569]">{signal.title}</p>
                    <p className="text-xs text-[#64748B]">{signal.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Strategic Talking Points */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#FFFFFF] backdrop-blur-sm rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] flex-1 flex flex-col"
          >
            <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]/50">
              <h3 className="font-semibold text-[#0F172A] flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-[#3B82F6] text-lg">strategy</span>
                Strategic Talking Points
              </h3>
            </div>
            <div className="p-4 space-y-4 flex-1">
              {strengths.map((strength, index) => {
                const colors = getColorClasses(strength.color);
                return (
                  <div key={index} className={`p-3 rounded ${colors.bg} border`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`material-symbols-outlined ${colors.text} text-sm`}>
                        {strength.icon}
                      </span>
                      <span className={`text-xs font-bold ${colors.text} uppercase tracking-wide`}>
                        {strength.label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#0F172A]">{strength.title}</p>
                    <p className="text-xs text-[#475569] mt-1">{strength.description}</p>
                  </div>
                );
              })}
            </div>
            <div className="p-3 border-t border-[#E2E8F0]">
              <button
                onClick={() => {
                  toast.success("Downloading strategy document...");
                  const doc = `
INTERVIEW BATTLE PLAN
${targetRole} @ ${companyName}

STRATEGIC TALKING POINTS:
${strengths.map((s, i) => `${i + 1}. ${s.title}\n   ${s.description}`).join('\n\n')}

EXPECTED QUESTIONS:
${questions.filter(q => q && q.type && q.question).map((q, i) => `${i + 1}. [${q.type}] ${q.question}`).join('\n\n')}

STAR STORY:
Situation: ${starStory.situation}
Task: ${starStory.task}
Action: ${starStory.action}
Result: ${starStory.result}
                  `;

                  const blob = new Blob([doc], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `interview-strategy-${companyName.replace(/\s+/g, '-')}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full py-1.5 text-xs font-medium text-[#64748B] hover:text-[#475569] hover:bg-slate-50 rounded transition-colors flex justify-center items-center gap-1"
              >
                View Full Strategy Document{" "}
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
