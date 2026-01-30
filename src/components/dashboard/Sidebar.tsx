import { FileText, Settings, Shield, LayoutDashboard, Target, Zap, Cpu, PieChart, LayoutTemplate } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Logo } from "@/components/Logo";
import { LogoutConfirmDialog } from "@/components/LogoutConfirmDialog";
import { SidebarApplicationTracker } from "@/components/dashboard/SidebarApplicationTracker";
import { useState, useEffect } from "react";
import { useI18n } from "@/contexts/I18nContext";

const apiAny = api;

interface SidebarProps {
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
  setShowPricing: (show: boolean) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
}

export function Sidebar({ categoryFilter, setCategoryFilter, setShowPricing, currentView, setCurrentView }: SidebarProps) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const currentUser = useQuery(apiAny.users.currentUser);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0 });
  const { t } = useI18n();

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

  const NavItem = ({ active, icon, label, onClick }: any) => (
    <button
      onClick={onClick}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative w-full ${active
        ? "text-[#0F172A] bg-slate-100 shadow-sm"
        : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50"
        }`}
    >
      {active && <div className="absolute left-0 top-1 bottom-1 w-1 bg-[#0F172A] rounded-r"></div>}
      <span className={`flex items-center justify-center w-5 h-5 ${active ? 'text-[#0F172A]' : 'text-[#64748B] group-hover:text-[#0F172A]'}`}>
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );

  const SectionHeader = ({ label }: { label: string }) => (
    <h3 className="px-3 mb-2 mt-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] font-mono">
      {label}
    </h3>
  );

  const hasActiveSprint = currentUser?.sprintExpiresAt && currentUser.sprintExpiresAt > Date.now();

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-[#E2E8F0] flex flex-col h-screen overflow-hidden z-20 hidden md:flex">

      {/* 1. Logo Area */}
      <div className="flex flex-col px-6 py-5 flex-shrink-0 border-b border-transparent">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('mission')}>
          <Logo iconClassName="h-8 w-auto" />
        </div>
      </div>

      {/* 2. Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar space-y-1">

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
          onClick={() => setCurrentView('match')}
        />

        {/* TOOLS */}
        <SectionHeader label="Tools" />
        <NavItem
          active={currentView === 'tools' || currentView === 'cover-letter' || currentView === 'linkedin' || currentView === 'keyword-sniper'}
          icon={<Cpu className="w-4 h-4" />}
          label="AI Assistant"
          onClick={() => setCurrentView('tools')}
        />
        <NavItem
          active={currentView === 'analytics'}
          icon={<PieChart className="w-4 h-4" />}
          label="Analytics"
          onClick={() => setCurrentView('analytics')}
        />

        {/* APPLICATIONS */}
        <SectionHeader label="Applications" />
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
          icon={<LayoutTemplate className="w-4 h-4" />}
          label="Manage Plan"
          onClick={() => setShowPricing(true)}
        />

        {/* ADMIN PANEL - Isolated at the bottom */}
        {user?.primaryEmailAddress?.emailAddress === "tiniboti@gmail.com" && (
          <div className="mt-6 pt-4 border-t border-slate-100">
            <SectionHeader label="Admin" />
            <NavItem
              active={false}
              icon={<Shield className="w-4 h-4 text-rose-500" />}
              label="Admin Panel"
              onClick={() => navigate("/admin")}
            />
          </div>
        )}
      </div>

      {/* 3. Footer Area: Sprint Widget & Profile */}
      <div className="flex-shrink-0 border-t border-slate-100 bg-slate-50/50 p-4 space-y-4">

        {/* Compact Sprint Progress */}
        {hasActiveSprint && (
          <div className="p-3 rounded-xl bg-[#0F172A] text-white overflow-hidden shadow-lg relative group cursor-pointer" onClick={() => setShowPricing(true)}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between mb-2 relative z-10">
              <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" /> Sprint Active
              </span>
              <span className="text-[10px] font-bold text-white">{timeRemaining.days}d left</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden relative z-10">
              <div
                className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full"
                style={{ width: '85%' }}
              ></div>
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className="flex items-center gap-3 px-1 hover:bg-white rounded-lg transition-colors cursor-pointer" onClick={() => setCurrentView('settings')}>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8 ring-2 ring-white shadow-sm",
                userButtonTrigger: "focus:shadow-none"
              }
            }}
          />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-[#0F172A] truncate">
              {currentUser?.name || user?.fullName || "User"}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {currentUser?.subscriptionTier === "interview_sprint" ? "Pro Member" : "Free Plan"}
            </span>
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
