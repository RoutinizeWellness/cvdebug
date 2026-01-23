import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, AlertTriangle, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionStep {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'important' | 'recommended';
  completed: boolean;
  estimatedImpact: string; // e.g., "+5-10%"
}

interface ActionPlanProps {
  steps: ActionStep[];
  onStepClick?: (stepId: string) => void;
  onCompleteStep?: (stepId: string) => void;
}

export function ActionPlan({ steps, onStepClick, onCompleteStep }: ActionPlanProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const criticalSteps = steps.filter(s => s.priority === 'critical' && !s.completed);
  const importantSteps = steps.filter(s => s.priority === 'important' && !s.completed);
  const recommendedSteps = steps.filter(s => s.priority === 'recommended' && !s.completed);
  const completedSteps = steps.filter(s => s.completed);

  const progress = steps.length > 0
    ? Math.round((completedSteps.length / steps.length) * 100)
    : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'important':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'recommended':
        return 'border-[#334155] bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'border-slate-300 bg-slate-50 dark:bg-slate-800';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-[10px] font-bold uppercase tracking-wider rounded-full border border-red-300 dark:border-red-700">
            Critical
          </span>
        );
      case 'important':
        return (
          <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-[10px] font-bold uppercase tracking-wider rounded-full border border-orange-300 dark:border-orange-700">
            Important
          </span>
        );
      case 'recommended':
        return (
          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider rounded-full border border-blue-300 dark:border-blue-700">
            Recommended
          </span>
        );
      default:
        return null;
    }
  };

  const renderStep = (step: ActionStep, index: number) => {
    const isExpanded = expandedStep === step.id;

    return (
      <motion.div
        key={step.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`border-l-4 ${getPriorityColor(step.priority)} rounded-lg p-4 cursor-pointer hover:shadow-md transition-all`}
        onClick={() => setExpandedStep(isExpanded ? null : step.id)}
      >
        <div className="flex items-start gap-3">
          {/* Number/Checkmark */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
            step.completed
              ? 'bg-green-500 text-white'
              : step.priority === 'critical'
              ? 'bg-red-500 text-white'
              : step.priority === 'important'
              ? 'bg-orange-500 text-white'
              : 'bg-[#334155] text-white'
          }`}>
            {step.completed ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              index + 1
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className={`font-bold text-base ${
                step.completed ? 'text-[#64748B] line-through' : 'text-[#0F172A] dark:text-white'
              }`}>
                {step.title}
              </h4>
              {getPriorityBadge(step.priority)}
              {!step.completed && (
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-[10px] font-bold rounded-full border border-green-300 dark:border-green-700">
                  {step.estimatedImpact}
                </span>
              )}
            </div>

            <p className={`text-sm ${
              step.completed ? 'text-[#94A3B8]' : 'text-[#64748B] dark:text-slate-400'
            }`}>
              {step.description}
            </p>

            {/* Expanded actions */}
            <AnimatePresence>
              {isExpanded && !step.completed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700"
                >
                  <div className="flex gap-2">
                    {onStepClick && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStepClick(step.id);
                        }}
                        className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white font-semibold"
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        Fix Now
                      </Button>
                    )}
                    {onCompleteStep && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCompleteStep(step.id);
                        }}
                        className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/20"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chevron */}
          <ChevronRight
            className={`h-5 w-5 text-[#64748B] transition-transform flex-shrink-0 ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-[#E2E8F0] dark:border-slate-700 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black text-white">Action Plan</h2>
          <div className="text-right">
            <div className="text-3xl font-black text-white">{progress}%</div>
            <div className="text-xs text-white/80">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <p className="text-white/90 text-sm mt-3">
          {completedSteps.length} of {steps.length} steps completed
        </p>
      </div>

      {/* Steps */}
      <div className="p-6 space-y-4">
        {/* Critical Steps */}
        {criticalSteps.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h3 className="font-bold text-[#0F172A] dark:text-white">Critical (Fix First)</h3>
            </div>
            {criticalSteps.map((step, idx) => renderStep(step, idx))}
          </div>
        )}

        {/* Important Steps */}
        {importantSteps.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <h3 className="font-bold text-[#0F172A] dark:text-white">Important (High Impact)</h3>
            </div>
            {importantSteps.map((step, idx) => renderStep(step, criticalSteps.length + idx))}
          </div>
        )}

        {/* Recommended Steps */}
        {recommendedSteps.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Circle className="h-5 w-5 text-[#334155]" />
              <h3 className="font-bold text-[#0F172A] dark:text-white">Recommended (Polish)</h3>
            </div>
            {recommendedSteps.map((step, idx) =>
              renderStep(step, criticalSteps.length + importantSteps.length + idx)
            )}
          </div>
        )}

        {/* Completed Steps (collapsed) */}
        {completedSteps.length > 0 && (
          <div className="pt-4 border-t-2 border-[#E2E8F0] dark:border-slate-700">
            <details className="group">
              <summary className="flex items-center gap-2 cursor-pointer text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white transition-colors">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-semibold">Completed ({completedSteps.length})</span>
                <ChevronRight className="h-4 w-4 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="mt-3 space-y-2">
                {completedSteps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-[#64748B] dark:text-slate-400 line-through flex-1">
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}

        {/* Empty state */}
        {steps.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#0F172A] dark:text-white mb-2">
              Perfect! No issues found
            </h3>
            <p className="text-[#64748B] dark:text-slate-400">
              Your resume looks great. Keep iterating to maintain a high score.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
