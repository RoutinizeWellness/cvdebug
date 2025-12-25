import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageSquare, Linkedin, Sparkles, ArrowRight, Lock } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RecruiterDMGenerator } from "@/components/dashboard/tools/RecruiterDMGenerator";
import { useState } from "react";

// Cast to any to avoid deep type instantiation errors
const apiAny = api as any;

interface UpsellSidebarProps {
  onNavigate: (view: string) => void;
}

export function UpsellSidebar({ onNavigate }: UpsellSidebarProps) {
  const currentUser = useQuery(apiAny.users.currentUser);
  const isSprintActive = currentUser?.subscriptionTier === "interview_sprint";
  const [showDMGenerator, setShowDMGenerator] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Quick Actions</h3>
        {!isSprintActive && (
          <span className="text-[10px] text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
            Pro Tools
          </span>
        )}
      </div>

      {/* Card 1: AI Cover Letter */}
      <Card 
        className="bg-[#0A0A0A] border-zinc-800 hover:border-zinc-700 transition-all group cursor-pointer overflow-hidden relative"
        onClick={() => onNavigate('cover-letter')}
      >
        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="h-4 w-4 text-zinc-500" />
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Mail className="h-4 w-4 text-purple-500" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-zinc-200">AI Cover Letter</h4>
            <p className="text-xs text-zinc-500 mt-1">Generate a tailored letter for your active project.</p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
              {isSprintActive ? "Included" : "€2.99 / Free in Sprint"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Recruiter DM */}
      <Card 
        className="bg-[#0A0A0A] border-zinc-800 hover:border-zinc-700 transition-all group cursor-pointer overflow-hidden relative"
        onClick={() => setShowDMGenerator(true)}
      >
        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="h-4 w-4 text-zinc-500" />
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-zinc-200">Recruiter DM</h4>
            <p className="text-xs text-zinc-500 mt-1">Get the perfect LinkedIn DM for this role.</p>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: LinkedIn Optimizer */}
      <Card 
        className="bg-[#0A0A0A] border-zinc-800 hover:border-zinc-700 transition-all group cursor-pointer overflow-hidden relative"
        onClick={() => onNavigate('linkedin')}
      >
        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="h-4 w-4 text-zinc-500" />
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="h-8 w-8 rounded-lg bg-[#0077b5]/10 flex items-center justify-center">
            <Linkedin className="h-4 w-4 text-[#0077b5]" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-zinc-200">LinkedIn Optimizer</h4>
            <p className="text-xs text-zinc-500 mt-1">Your profile is only 60% optimized. Fix now.</p>
          </div>
        </CardContent>
      </Card>

      {/* Sprint Upsell / Status */}
      <div className="pt-4">
        <div className={`rounded-xl p-4 border ${
          isSprintActive 
            ? "bg-gradient-to-br from-zinc-900 to-black border-zinc-800" 
            : "bg-gradient-to-br from-primary/20 to-purple-900/20 border-primary/30"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className={`h-4 w-4 ${isSprintActive ? "text-zinc-400" : "text-yellow-400 animate-pulse"}`} />
            <span className={`text-xs font-bold ${isSprintActive ? "text-zinc-300" : "text-white"}`}>
              {isSprintActive ? "Sprint Active" : "Unlock Interview Sprint"}
            </span>
          </div>
          
          {isSprintActive ? (
            <div className="space-y-1">
              <div className="text-2xl font-mono font-bold text-white tracking-tight">
                48h 12m
              </div>
              <p className="text-[10px] text-zinc-500">of Unlimited Access remaining</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-zinc-300 leading-relaxed">
                Get unlimited AI scans, cover letters, and recruiter DMs for 7 days.
              </p>
              <Button size="sm" className="w-full font-bold text-xs bg-white text-black hover:bg-zinc-200">
                Start Sprint (€19.99)
              </Button>
            </div>
          )}
        </div>
      </div>

      <RecruiterDMGenerator open={showDMGenerator} onOpenChange={setShowDMGenerator} />
    </div>
  );
}