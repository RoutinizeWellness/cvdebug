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
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-6 rounded-2xl border-l-4 border-l-[#64748B] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-6 relative">
          <div className="absolute left-[15px] top-8 bottom-2 w-0.5 bg-[#E2E8F0] -z-10"></div>

          {steps.map((step) => (
            <div key={step.number} className="flex gap-4">
              <div className={`relative z-10 flex items-center justify-center size-8 rounded-full ${
                currentStep > step.number
                  ? "bg-[#64748B] text-white shadow-lg shadow-slate-500/25"
                  : currentStep === step.number
                  ? "bg-[#64748B] text-white shadow-lg shadow-slate-500/10"
                  : "bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]"
              } ring-4 ring-white`}>
                {currentStep > step.number ? <Check className="h-4 w-4" /> : <span className="font-bold text-sm">{step.number}</span>}
              </div>
              <div className="flex flex-col pt-1">
                <span className={`text-sm font-bold ${currentStep >= step.number ? "text-[#0F172A]" : "text-[#64748B]"}`}>
                  {step.title}
                </span>
                <span className={`text-xs ${currentStep > step.number ? "text-[#64748B]" : currentStep === step.number ? "text-[#64748B]" : "text-[#64748B]"}`}>
                  {currentStep > step.number ? "Completed" : currentStep === step.number ? "In Progress" : "Pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]">
        <h4 className="text-[#0F172A] font-bold mb-2">Why CVDebug?</h4>
        <p className="text-sm text-[#64748B] leading-relaxed">
          Our AI engine parses 50+ ATS data points to find invisible blockers in your resume before the recruiter does.
        </p>
      </div>
    </div>
  );
}
