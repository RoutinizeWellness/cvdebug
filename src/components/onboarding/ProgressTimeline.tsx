import { Check } from "lucide-react";

interface ProgressTimelineProps {
  currentStep: number;
}

export function ProgressTimeline({ currentStep }: ProgressTimelineProps) {
  const steps = [
    { number: 1, title: "Upload Master CV", status: "Completed" },
    { number: 2, title: "Target Definition", status: "Completed" },
    { number: 3, title: "System Analysis", status: "Pending" },
  ];

  return (
    <div className="hidden lg:flex flex-col gap-8 sticky top-24">
      <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-[#3B82F6]">
        <div className="flex flex-col gap-6 relative">
          <div className="absolute left-[15px] top-8 bottom-2 w-0.5 bg-slate-800 -z-10"></div>

          {steps.map((step) => (
            <div key={step.number} className="flex gap-4">
              <div className={`relative z-10 flex items-center justify-center size-8 rounded-full ${
                currentStep > step.number 
                  ? "bg-[#3B82F6] text-white shadow-lg shadow-blue-500/25" 
                  : currentStep === step.number
                  ? "bg-white text-[#0F172A] shadow-lg shadow-white/10"
                  : "bg-slate-800 text-slate-500 border border-slate-700"
              } ring-4 ring-[#0F172A]`}>
                {currentStep > step.number ? <Check className="h-4 w-4" /> : <span className="font-bold text-sm">{step.number}</span>}
              </div>
              <div className="flex flex-col pt-1">
                <span className={`text-sm font-bold ${currentStep >= step.number ? "text-white" : "text-slate-500"}`}>
                  {step.title}
                </span>
                <span className={`text-xs ${currentStep > step.number ? "text-slate-400" : currentStep === step.number ? "text-[#3B82F6]" : "text-slate-600"}`}>
                  {currentStep > step.number ? "Completed" : currentStep === step.number ? "In Progress" : "Pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50">
        <h4 className="text-white font-bold mb-2">Why CVDebug?</h4>
        <p className="text-sm text-slate-400 leading-relaxed">
          Our AI engine parses 50+ ATS data points to find invisible blockers in your resume before the recruiter does.
        </p>
      </div>
    </div>
  );
}
