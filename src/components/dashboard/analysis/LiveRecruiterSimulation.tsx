import { motion, AnimatePresence } from "framer-motion";
import { User, MessageSquare, Brain, Eye, ThumbsUp, ThumbsDown } from "lucide-react";
import { useState, useEffect } from "react";

interface SimulationStep {
    thought: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    impact: string;
}

interface LiveRecruiterSimulationProps {
    category?: string;
    seniority?: string;
    score?: number;
    missingKeywords?: string[];
    hasMetrics?: boolean;
}

export function LiveRecruiterSimulation({
    category = "Software Engineer",
    seniority = "Senior",
    score = 75,
    missingKeywords = [],
    hasMetrics = false,
}: LiveRecruiterSimulationProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState<SimulationStep[]>([]);

    useEffect(() => {
        // Generate simulation steps based on real data
        const newSteps: SimulationStep[] = [
            {
                thought: `Opening file... High-level check for ${seniority} ${category} role.`,
                sentiment: 'neutral',
                impact: "Initial Scan"
            },
            {
                thought: score > 80
                    ? "Layout looks professional. Content density is optimal."
                    : "Layout is a bit cluttered, but let's see the content.",
                sentiment: score > 80 ? 'positive' : 'neutral',
                impact: "Visual First Impression"
            }
        ];

        if (!hasMetrics) {
            newSteps.push({
                thought: "I'm looking for numbers... where is the impact? Too much 'responsible for', not enough 'achieved'.",
                sentiment: 'negative',
                impact: "Achievement Depth"
            });
        } else {
            newSteps.push({
                thought: "Good use of metrics. I can clearly see the business value here.",
                sentiment: 'positive',
                impact: "Achievement Depth"
            });
        }

        if (missingKeywords.length > 3) {
            newSteps.push({
                thought: `Wait, I don't see ${missingKeywords[0]} or ${missingKeywords[1]}. These are mandatory for this level.`,
                sentiment: 'negative',
                impact: "Skill Matching"
            });
        }

        newSteps.push({
            thought: score > 70
                ? "This candidate has potential. I'll move them to the 'Maybe' pile for internal review."
                : "Probably a pass. Experience doesn't quite match the required signals.",
            sentiment: score > 70 ? 'positive' : 'negative',
            impact: "Final Decision Simulation"
        });

        setSteps(newSteps);
        setCurrentStep(0);
    }, [category, seniority, score, missingKeywords, hasMetrics]);

    useEffect(() => {
        if (currentStep < steps.length - 1) {
            const timer = setTimeout(() => setCurrentStep(prev => prev + 1), 3000);
            return () => clearTimeout(timer);
        }
    }, [currentStep, steps]);

    return (
        <div className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-2xl p-6 shadow-xl relative overflow-hidden">
            {/* Simulation Header */}
            <div className="flex items-center justify-between mb-8 border-b border-[#E2E8F0] pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1E293B] to-[#334155] flex items-center justify-center text-white shadow-lg">
                        <Brain className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-black text-[#0F172A] text-lg uppercase tracking-tight">Recruiter_AI Sim v1.0</h3>
                        <p className="text-xs text-[#64748B] font-mono">Neural Simulation of 10,000+ Human Reviews</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-200">
                    <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                    <span className="text-[10px] font-bold text-[#22C55E]">SIM_ACTIVE</span>
                </div>
            </div>

            {/* Thought Stream */}
            <div className="space-y-6 relative">
                {/* Connection Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#E2E8F0] z-0" />

                <AnimatePresence mode="popLayout">
                    {steps.slice(0, currentStep + 1).map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative z-10 flex gap-6"
                        >
                            <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center shadow-md ${idx === currentStep ? 'bg-[#1E293B] text-white' : 'bg-white border-2 border-[#E2E8F0] text-[#64748B]'
                                }`}>
                                {step.sentiment === 'positive' ? <ThumbsUp className="h-5 w-5" /> :
                                    step.sentiment === 'negative' ? <ThumbsDown className="h-5 w-5" /> :
                                        <Eye className="h-5 w-5" />}
                            </div>

                            <div className={`flex-1 p-4 rounded-2xl border-2 transition-all ${idx === currentStep
                                    ? 'bg-white border-[#1E293B] shadow-lg scale-[1.02]'
                                    : 'bg-[#F8FAFC] border-[#E2E8F0] opacity-60'
                                }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#64748B]">
                                        {step.impact}
                                    </span>
                                    {idx === currentStep && (
                                        <motion.span
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="text-[10px] font-bold text-[#1E293B]"
                                        >
                                            THINKING...
                                        </motion.span>
                                    )}
                                </div>
                                <p className={`text-sm font-medium leading-relaxed ${idx === currentStep ? 'text-[#0F172A]' : 'text-[#64748B]'
                                    }`}>
                                    "{step.thought}"
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Progress Footer */}
            <div className="mt-8 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
                    Step {currentStep + 1} of {steps.length}
                </div>
                {currentStep === steps.length - 1 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 text-[#22C55E] font-bold text-sm"
                    >
                        <ThumbsUp className="h-4 w-4" />
                        Simulation Complete
                    </motion.div>
                )}
            </div>
        </div>
    );
}
