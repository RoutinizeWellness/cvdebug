import { Logo } from "@/components/Logo";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OnboardingHeader() {
  return (
    <header className="w-full z-50 border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-md sticky top-0">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo showText={true} />
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700">
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-medium text-slate-300">System Online</span>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
