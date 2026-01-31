import { FileText, Settings, Shield, LayoutDashboard, Target, Zap, PieChart, CreditCard } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Logo } from "@/components/Logo";
import { LogoutConfirmDialog } from "@/components/LogoutConfirmDialog";
import { SidebarApplicationTracker } from "@/components/dashboard/SidebarApplicationTracker";
import { useState, useEffect } from "react";

const apiAny = api;

interface SidebarProps {
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
  setShowPricing: (show: boolean) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
}

export function Sidebar({ setShowPricing, currentView, setCurrentView }: SidebarProps) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const currentUser = useQuery(apiAny.users.currentUser);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0 });

  const handleSignOut = async () => {
    try {
      await signOut();
      // Use window.location for full page reload after sign out
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Calculate sprint countdown
  useEffect(() => {
    const updateCountdown = () => {
      if (currentUser?.sprintExpiresAt) {
        const now = Date.now();
        const diff = currentUser.sprintExpiresAt - now;

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeRemaining({ days, hours, minutes });
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [currentUser?.sprintExpiresAt]);

  const NavItem = ({ active, icon, label, onClick, colorClass }: any) => (
    <button
      onClick={onClick}
      className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all relative w-full ${active
        ? "text-[#1E293B] bg-[#F1F5F9] shadow-sm"
        : "text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC]"
        }`}
    >
      {active && <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#1E293B] rounded-r"></div>}
      <span className={`flex items-center justify-center w-5 h-5 transition-colors ${active ? (colorClass || 'text-[#1E293B]') : 'text-[#94A3B8] group-hover:text-[#1E293B]'}`}>
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );

  const SectionHeader = ({ label }: { label: string }) => (
    <div className="flex items-center gap-2 px-3 mb-2 mt-6">
      <div className="h-px bg-slate-100 flex-1"></div>
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] font-mono">
        {label}
      </h3>
      <div className="h-px bg-slate-100 flex-1 md:hidden lg:block"></div>
    </div>
  );

  const hasActiveSprint = currentUser?.subscriptionTier === "interview_sprint" &&
    (currentUser?.sprintExpiresAt ? currentUser.sprintExpiresAt > Date.now() : true);

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-[#E2E8F0] flex flex-col h-screen overflow-hidden z-20 hidden md:flex font-sans">

      {/* 1. Logo Area */}
      <div className="flex flex-col px-6 py-6 flex-shrink-0">
        <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105" onClick={() => setCurrentView('mission')}>
          <Logo iconClassName="h-9 w-auto" />
        </div>
      </div>

      {/* 2. Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar space-y-0.5">

        {/* RESUMES */}
        <SectionHeader label="Resumes" />
        <NavItem
          active={currentView === 'mission'}
          icon={<LayoutDashboard className="w-4 h-4" />}
          label="Dashboard"
          onClick={() => setCurrentView('mission')}
        />
        <NavItem
          active={currentView === 'master-cvs'}
          icon={<FileText className="w-4 h-4" />}
          label="My Resumes"
          onClick={() => setCurrentView('master-cvs')}
        />
        <NavItem
          active={currentView === 'match'}
          icon={<Target className="w-4 h-4" />}
          label="Job Match"
          colorClass="text-emerald-600"
          onClick={() => setCurrentView('match')}
        />

        {/* TOOLS */}
        <SectionHeader label="Tools" />
        <NavItem
          active={currentView === 'tools' || currentView === 'cover-letter' || currentView === 'linkedin' || currentView === 'keyword-sniper' || currentView === 'bullet-rewriter'}
          icon={<Zap className="w-4 h-4" />}
          label="AI Assistant"
          colorClass="text-amber-500"
          onClick={() => setCurrentView('tools')}
        />
        <NavItem
          active={currentView === 'analytics'}
          icon={<PieChart className="w-4 h-4" />}
          label="Analytics"
          onClick={() => setCurrentView('analytics')}
        />

        {/* APPLICATIONS */}
        <SectionHeader label="Tracking" />
        <SidebarApplicationTracker />

        {/* ACCOUNT */}
        <SectionHeader label="Account" />
        <NavItem
          active={currentView === 'settings'}
          icon={<Settings className="w-4 h-4" />}
          label="Settings"
          onClick={() => setCurrentView('settings')}
        />
        <NavItem
          active={false}
          icon={<CreditCard className="w-4 h-4" />}
          label="Manage Plan"
          onClick={() => setShowPricing(true)}
        />

        {/* ADMIN PANEL - Highly isolated */}
        {user?.primaryEmailAddress?.emailAddress === "tiniboti@gmail.com" && (
          <div className="mt-8 pt-4 border-t border-slate-100">
            <NavItem
              active={false}
              icon={<Shield className="w-4 h-4 text-rose-500" />}
              label="Admin Console"
              onClick={() => navigate("/admin")}
            />
          </div>
        )}
      </div>

      {/* 3. Footer Area: Sprint Widget & Profile */}
      <div className="flex-shrink-0 p-4 space-y-4 bg-[#F8FAFC]">

        {/* Compact Sprint Progress */}
        {hasActiveSprint && (
          <div className="p-4 rounded-xl bg-slate-900 text-white overflow-hidden shadow-xl relative group cursor-pointer border border-slate-800" onClick={() => setShowPricing(true)}>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-indigo-500/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between mb-2 relative z-10">
              <span className="text-[10px] uppercase font-black text-emerald-400 tracking-wider flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                SPRINT ACTIVE
              </span>
              <span className="text-[10px] font-black text-white/50">{timeRemaining.days}d REMAINING</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden relative z-10 p-[1px]">
              <div
                className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-indigo-500 h-full rounded-full transition-all duration-1000"
                style={{ width: '85%' }}
              ></div>
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className="flex items-center gap-3 px-2 py-2 hover:bg-white rounded-xl transition-all duration-200 cursor-pointer shadow-sm border border-transparent hover:border-slate-200" onClick={() => setCurrentView('settings')}>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-9 w-9 ring-2 ring-white shadow-md transition-transform group-hover:scale-105",
                userButtonTrigger: "focus:shadow-none bg-transparent"
              }
            }}
          />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-[#1E293B] truncate">
              {currentUser?.name || user?.fullName || "User"}
            </span>
            <div className="flex items-center gap-1">
              <div className={`h-1.5 w-1.5 rounded-full ${currentUser?.subscriptionTier === "interview_sprint" ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">
                {currentUser?.subscriptionTier === "interview_sprint" ? "Pro Plan" : "Free Explorer"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <LogoutConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleSignOut}
      />
    </aside>
  );
}
