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
  const isPaidUser = currentUser?.subscriptionTier === "single_scan" || currentUser?.subscriptionTier === "interview_sprint";
  const [showDMGenerator, setShowDMGenerator] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Quick Actions</h3>
        {!isSprintActive && (
          <span className="text-[10px] text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
            Pro Tools
          </span>
        )}
      </div>

      {/* Card 1: AI Cover Letter */}
      <Card
        className="bg-[#FFFFFF] border-[#E2E8F0] hover:border-[#8B5CF6] transition-all group cursor-pointer overflow-hidden relative shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
        onClick={() => onNavigate('cover-letter')}
      >
        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="h-4 w-4 text-[#64748B]" />
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
            <Mail className="h-4 w-4 text-teal-500" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#0F172A]">AI Cover Letter</h4>
            <p className="text-xs text-[#64748B] mt-1">Generate a tailored letter for your active project.</p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] font-bold text-[#475569] bg-[#F8FAFC] px-2 py-1 rounded border border-[#E2E8F0]">
              {isSprintActive ? "Included" : "€2.99 / Free in Sprint"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Recruiter DM */}
      <Card
        className="bg-[#FFFFFF] border-[#E2E8F0] hover:border-[#8B5CF6] transition-all group cursor-pointer overflow-hidden relative shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
        onClick={() => setShowDMGenerator(true)}
      >
        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="h-4 w-4 text-[#64748B]" />
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="h-8 w-8 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-[#3B82F6]" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#0F172A]">Recruiter DM</h4>
            <p className="text-xs text-[#64748B] mt-1">Get the perfect LinkedIn DM for this role.</p>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: LinkedIn Optimizer */}
      <Card
        className="bg-[#FFFFFF] border-[#E2E8F0] hover:border-[#8B5CF6] transition-all group cursor-pointer overflow-hidden relative shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
        onClick={() => onNavigate('linkedin')}
      >
        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="h-4 w-4 text-[#64748B]" />
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="h-8 w-8 rounded-lg bg-[#0077b5]/10 flex items-center justify-center">
            <Linkedin className="h-4 w-4 text-[#0077b5]" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#0F172A]">LinkedIn Optimizer</h4>
            <p className="text-xs text-[#64748B] mt-1">Your profile is only 60% optimized. Fix now.</p>
          </div>
        </CardContent>
      </Card>

      {/* Sprint Upsell / Status */}
      <div className="pt-4">
        <div className={`rounded-xl p-4 border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] ${
          isSprintActive
            ? "bg-gradient-to-br from-[#F8FAFC] to-[#FFFFFF] border-[#E2E8F0]"
            : "bg-gradient-to-br from-[#F3E8FF] to-[#FFFFFF] border-[#8B5CF6]/30"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className={`h-4 w-4 ${isSprintActive ? "text-[#64748B]" : "text-[#F59E0B] animate-pulse"}`} />
            <span className={`text-xs font-bold ${isSprintActive ? "text-[#475569]" : "text-[#0F172A]"}`}>
              {isSprintActive ? "Sprint Active" : "Unlock Interview Sprint"}
            </span>
          </div>

          {isSprintActive ? (
            <div className="space-y-1">
              <div className="text-2xl font-mono font-bold text-[#0F172A] tracking-tight">
                48h 12m
              </div>
              <p className="text-[10px] text-[#64748B]">of Unlimited Access remaining</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-[#475569] leading-relaxed">
                Get unlimited AI scans, cover letters, and recruiter DMs for 7 days.
              </p>
              <Button size="sm" className="w-full font-bold text-xs bg-[#0F172A] text-white hover:bg-[#1E293B]">
                Start Sprint (€24.99)
              </Button>
            </div>
          )}
        </div>
      </div>

      <RecruiterDMGenerator
        open={showDMGenerator}
        onOpenChange={setShowDMGenerator}
        isPaidUser={isPaidUser}
        onUpgrade={() => onNavigate('pricing')}
      />
    </div>
  );
}